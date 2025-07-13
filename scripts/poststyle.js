function bc_post_style(...args) {
  const [post, styles, fieldlist, options] = args
  if (!post && !document.REPLIER?.Post) return false

  const _add_menu = (stylemap, fieldmap, options) => {
    const menu = document.createElement("tr")
    const select = document.createElement("select")

    document.getElementById("post-options").after(menu)
    menu.id = "post-style-menu"
    menu.innerHTML = "<td class='pformleft'>Post Style</td><td class='pformright'></td>"

    if (options.usertag[0]) {
      const tagmenu = document.createElement("tr")
      menu.insertAdjacentElement('beforebegin', tagmenu)
      tagmenu.id = "tag-user-menu"
      const users = new Map(options.usertag[1].map((user, i) => [i, user]))
      tagmenu.innerHTML = "<select name='tag_user' multiple hidden disabled>" + Array.from(users).map(([i, user]) => "<option value='" + i + "'>" + user + "</option>").join("") + "</select><td class='pformleft'>Tag user(s)</td><td class='pformright'><div class='tags_preview'></div><input type='text' name='tag_user_search' placeholder='Search user(s)'/><select name='tag_user_view' style='display:none;overflow:auto' multiple></select></td>"
      document.REPLIER.tag_user_search.addEventListener("input", (evt) => {
        const searchkey = evt.target.value;
        const matched = Array.from(users).filter(([, x]) => searchkey.length > 0 && Array.from(document.REPLIER.tag_user.selectedOptions, o => o.innerText).indexOf(x) === -1 && x.toLowerCase().includes(searchkey.toLowerCase()));
        if (matched.length > 0) {
          document.REPLIER.tag_user_view.style.display = 'initial'
          document.REPLIER.tag_user_view.innerHTML = ''
          document.REPLIER.tag_user_view.size = matched.length < 4 ? matched.length : 4
          document.REPLIER.tag_user_view.insertAdjacentHTML('beforeend', matched.map(([i, user]) => "<option value='" + i + "'>" + user + "</option>").join(""))
          document.REPLIER.tag_user_view.addEventListener("change", ()=>{
            Array.from(document.REPLIER.tag_user_view.selectedOptions).forEach(x => {
              if (x.getAttribute("has-event") === "true") return false
              x.setAttribute("has-event", "true")
              // add to tag view
              const id = x.value
              document.REPLIER.tag_user.options[id].selected = true
              const tag = document.createElement("tag")
              tagmenu.querySelector(".tags_preview").append(tag)
              tag.innerText = x.innerText
              // check if tag is already loaded in the textarea itself and add if not
              const tag_finder = [...document.REPLIER.post_area_tag_user.value.matchAll(/\[user=.*?](.*?)\[\/user]/gim)].map(user => user[1])
              if(tag_finder.indexOf(x.innerText) < 0) document.REPLIER.post_area_tag_user.value += "@[" + x.innerText + "]"
              // remove tag
              tag.addEventListener("click", () => {
                document.REPLIER.tag_user.options[id].selected = false
                tag.remove()
                const tag_matcher = [...document.REPLIER.post_area_tag_user.value.matchAll(/\[user=.*?](.*?)\[\/user]|@\[(.*?)]/gim)].filter(u => u[2] === x.innerText || u[1] === x.innerText)
                const tag_remover = tag_matcher.map(u => [u[0], u[2] ?? u[1]])
                if (tag_remover[0][1] === x.innerText) document.REPLIER.post_area_tag_user.value = document.REPLIER.post_area_tag_user.value.replace(tag_remover[0][0], '')
              })
              x.remove()
              document.REPLIER.tag_user_search.value = ""
              document.REPLIER.tag_user_search.focus();
              document.REPLIER.tag_user_view.size = (matched.length - 1) < 4 ? matched.length - 1 : 4
              if (document.REPLIER.tag_user_view.size < 1) document.REPLIER.tag_user_view.style.display = 'none'
            })
          })
        } else {
          document.REPLIER.tag_user_view.style.display = 'none'
        }
      })
    }

    const fields = Array.from(fieldmap).map(([k,v]) => `<tr class='post-style-options' data-value='${v.value}' data-id='${k}'><td class='pformleft'>${v.label}</td><td class='pformright'>${v.html}</td></tr>`)
    menu.insertAdjacentHTML('afterend', fields.join(""))

    menu.querySelector(".pformright").append(select)
    select.id = "post-style"
    select.name = "post_style"
    stylemap.forEach((v, i) => menu.querySelector(".pformright select").insertAdjacentHTML("beforeend", "<option>" + v.name + "</option>"))
    menu.addEventListener("change", (evt) => {
      const $this = evt.target
      document.querySelectorAll(".post-style-options").forEach(option => {
        option.setAttribute("data-visible", "false")
        option.querySelector(".pformright").children[0].required = false;
      })
      if($this.value==="---") return false;
      const _selected = stylemap.get($this.value)
      const _fields = _selected.fields.map(field => fieldmap.get(field))
      _fields.forEach(_f => {
        document.querySelector(".post-style-options[data-value='" + _f.value + "']").setAttribute("data-visible", "true")
        document.querySelector(".post-style-options[data-value='" + _f.value + "'] .pformright").children[0].required = _f.required
      })
    })
  }

  const _load_menu = (fw, options) => {
    if (!document.REPLIER.Post.innerHTML.trim()) return false;
    const metadata = fw.meta_data
    
    document.REPLIER.post_style.value = metadata.post_style
    document.querySelectorAll(".post-style-options").forEach(option => {
      option.setAttribute("data-visible", "false")
      option.querySelector(".pformright").children[0].required = false;
    })
        if (options.usertag[0] && fw.html.tag_user) {
      const tag_finder = [...fw.html.tag_user.matchAll(/\[user=.*?](.*?)\[\/user]/gim)]
      const tag_map = new Map(Array.from(document.REPLIER.tag_user.options, option => [option.innerText, option.value]))
      tag_finder.forEach(user => {
        const id = tag_map.get(user[1])
        document.REPLIER.tag_user.options[id].selected = true
        const tag = document.createElement("tag")
        document.querySelector(".tags_preview").append(tag)
        tag.innerText = user[1]
        // remove tag
        tag.addEventListener("click", () => {
          document.REPLIER.tag_user.options[id].selected = false
          tag.remove()
          const tag_remover = [...document.REPLIER.post_area_tag_user.value.matchAll(/\[user=.*?](.*?)\[\/user]/gim)].filter(u => u[1] === user[1])
          if (tag_remover.length > 0 && tag_remover[0][1] === user[1]) document.REPLIER.post_area_tag_user.value = document.REPLIER.post_area_tag_user.value.replace(tag_remover[0][0], '')
        })
      })
      document.REPLIER.tag_user.selectedOptions
    }
    
    if(document.REPLIER.post_style.value==="---") return false;
    const _selected = stylemap.get(document.REPLIER.post_style.value)
    const _fields = _selected.fields.map(field => fieldmap.get(field))
    _fields.forEach(_f => {
      document.querySelector(".post-style-options[data-value='" + _f.value + "']").setAttribute("data-visible", "true")
      document.querySelector(".post-style-options[data-value='" + _f.value + "'] .pformright").children[0].required = _f.required
    })

    const style_options = document.querySelectorAll(".post-style-options")
    style_options.forEach(style => {
      const name = style.dataset.id
      const value = metadata.post_style_options[name]
      style.querySelector(".pformright").children[0].value = value
    })
  }

  const _parse_template = (template, data, options) => {
    const key_val = {
      post: data.post,
      tags: data.html.tag_user || "",
      "tags exists": data.html.tag_user ? 1 : 0,
      ...data.meta_data.post_style_options
    }
    const template_class = options.templates || "poststyle_templates"
    const template_content = data.meta_data.post_style === "---" ? ("${post}"+ (data.html.tag_user?"<br><br>${tags}":"")) : Array.from(document.querySelector("template"+template+"."+template_class).content.childNodes).reduce((acc, curr) => acc += curr.outerHTML || curr.nodeValue || "","")
    const template_content_replaced = template_content.replaceAll(/\$\{([^\.]*?)\}/g, (_,p1) => key_val[p1]).replaceAll(/\$\{(.*?)\.(.*?)\}/g, (_,p1,p2) => key_val[p1][p2])
    return template_content_replaced
  }

  // prepare styles by turning it into a map!
  const fieldmap = new Map(Object.entries(fieldlist).map(([k, v], i) => [k, { value: i, ...v }]))
  const stylemap = new Map(Object.entries({ "---": [], ...styles }).map(([k, v]) => [k, { name: k, ...v[1] }]))

  const framework = bc_post_framework(post, {
      text: {
        "post_style": () => document.REPLIER.post_style.selectedOptions[0].innerText,
        "post_style_options": () => Object.fromEntries(Array.from(document.querySelectorAll(".post-style-options"), x => [ x.dataset.id, x.querySelector(".pformright").children[0].value ]))
      }, 
      html: {
        "tag_user": () => Array.from(document.REPLIER.tag_user.selectedOptions, x => "@[" + x.innerHTML.trim() + "]")
      }
    }, function (e, json) {
      const metadata = json.meta_data
      const style = styles[metadata.post_style]
      const [selector = "", _, callback = ()=>{}] = (metadata.post_style === "---")  ? ['', '', ()=>{}] : style
      const post_options_exists = Object.entries(metadata.post_style_options).map(([k,v]) => [k+" exists", v.trim() ? 1 : 0]);
      metadata.post_style_options = Object.fromEntries(post_options_exists.concat( Object.entries(metadata.post_style_options) ));
      const template = _parse_template(selector, json, options)
      e.innerHTML = template
      callback(e, json)
    }
  );

  document.querySelectorAll(".codebuttons[onclick*='simpletag']").forEach(btn => btn.setAttribute('onclick', btn.getAttribute('onclick').replace("simpletag","ins_tag")))

  // post view
  if (!document.REPLIER.Post || document.REPLIER.qrc) return false
  _add_menu(stylemap, fieldmap, options)
  _load_menu(framework, options)
}

// has to be hijacked b/c we killed the Post whoops
  /*-----------------------*\
  |*  jcink bbcode object  *|
  \*-----------------------*/

  /****************************
  <Laiam> yet another piece of
  IPB we've successfully killed 
  *****************************/

  var is_ie = !!navigator.userAgent.match(/msie/i);
  var ieVersion=(!!navigator.userAgent.match(/msie/i))?navigator.userAgent.split(/MSIE/i)[1].split(/;/)[0]:0,
  jBBCode = () => {
    //quick reference this
    var bb = this;
    //addTag overloaded function
    bb.addTag = function(jbTag,jbClsTag) {
        /*------------------------------------------------------*\
        |* jbTag: The tag to be inserted.                       *|
        |* jbClsTag: closing tag, used if we have selected text *|
        \*------------------------------------------------------*/
        var start, end, selection, replacement, caretPos, first, second,
            newString, newPos, editor = document.REPLIER.post_area;
        if ( is_ie && ieVersion < 10) {
            if(editor.isTextEdit) { // this doesn't work for NS, but it works for IE 4+ and compatible browsers
                editor.focus();
                var sel = document.selection;
                var rng = sel.createRange();
                rng.colapse;
                if((sel.type == "Text" || sel.type == "None") && rng != null) {
                    if(jbClsTag != null && rng.text.length > 0) {
                        jbTag += rng.text + jbClsTag;
                    }
                    rng.text = jbTag;
                }
            } else {
                editor.value += jbTag;
            }
        } else if (jbClsTag != null) {
            editor.focus();
            start       = editor.selectionStart;
            end         = editor.selectionEnd;
            first       = editor.value.substring(0, start);
            selection   = editor.value.substring(start,end);
            second      = editor.value.substring(end, editor.value.length);
            newString   = first + jbTag +selection + jbClsTag + second;
            editor.value = newString;
            newPos      = end + jbTag.length + jbClsTag.length;
            if (editor.setSelectionRange) {
                editor.setSelectionRange(start, newPos);
            } else if (editor.createTextRange) {
                var range = editor.createTextRange();
                range.collapse(true);
                range.moveEnd('character', start);
                range.moveStart('character', newPos);
                range.select();
            }
        } else {
            editor.focus();
            caretPos  = editor.selectionStart;
            first     = editor.value.substring(0, caretPos);
            second    = editor.value.substring(caretPos, editor.value.length);
            newString = first + jbTag + second;
            editor.value = newString;
            newPos    = first.length + jbTag.length;
            if (editor.setSelectionRange) {
                editor.setSelectionRange(newPos, newPos);
            } else if (editor.createTextRange) {
                var range = editor.createTextRange();
                range.collapse(true);
                range.moveEnd('character', newPos);
                range.moveStart('character', newPos);
                range.select();
            }
        }
        editor.focus();
    };
    bb.getButton = function (name) {
        if (name == 'CODE') {
            return document.getElementsByName(name)[1]
        }
        return document.getElementsByName(name)[0]
    };
    //help texts
    bb.help = {};
    bb.help["bold"]           = "Insert Bold Text";
    bb.help["italic"]         = "Insert Italic Text";
    bb.help["under"]          = "Insert Underlined Text";
    bb.help["font"]           = "Insert Font Face tags";
    bb.help["size"]           = "Insert Font Size tags";
    bb.help["color"]          = "Insert Font Color tags";
    bb.help["close"]          = "Close all open tags";
    bb.help["url"]            = "Insert Hyperlink";
    bb.help["img"]            = "Image [img]https://www.dom.com/img.gif[/img]";
    bb.help["taguser"]        = "Insert @user tag";
    bb.help["quote"]          = "Insert Quoted Text";
    bb.help["list"]           = "Create a list";
    bb.help["code"]           = "Insert Monotype Text";
    bb.help["click_close"]    = "Click button again to close";
    bb.help["dohtml"]         = "Enables HTML where allowed";
	bb.help["align"]           = "Insert Alignment tags";
		
    //error texts
    bb.error = {};
    bb.error["no_url"]    = "You must enter a URL";
	bb.error["no_title"]  = "You must enter a title";
    //prompt texts
    bb.text = {};
	bb.text["enter_url"]      = "Enter the complete URL for the hyperlink";
	bb.text["enter_url_name"] = "Enter the title of the webpage";
	bb.text["enter_image"]    = "Enter the complete URL for the image";
	bb.text["enter_usernametag"]  = "Enter the full user name of the member you wish to tag/alert.";
	bb.text["code"]           = "Usage: [CODE] Your Code Here.. [/CODE]";
	bb.text["quote"]          = "Usage: [QUOTE] Your Quote Here.. [/QUOTE]";
    bb.text["list_prompt"]    = "Enter a list item. Click 'cancel' or leave blank to end the list";
	bb.text["start"]        = "Enter the text to be formatted";
    bb.cookie = {
        ingredients: decodeURIComponent,
        mix: encodeURIComponent,
        bake:function( name, value ) {
            document.cookie = name+'='+this.mix(value);
        },
        jar:function(c_name) {
            try {
                return this.ingredients(document.cookie.match(new RegExp(c_name+"=([^;]+)"))[1]);
            } catch(e) {
                return "";
            }
        },
        crumb:function(c_name){
            c_name=this.jar(c_name);
            if (c_name!=null && c_name!="") {
                return true;
            } else {
                return false;
            }
        },
        eat:function(c_name){
            if (this.crumb(c_name)) {
                this.bake(c_name,'',-99);
            }
        }
    };
    
    bb.openTags = '';
    
    if (bb.cookie.crumb('bbmode')) {
        bb.mode = bb.cookie.jar('bbmode');
        if (bb.mode=='ezmode') {
            document.REPLIER.bbmode[0].checked = true;
        } else {
            document.REPLIER.bbmode[1].checked = true;
        }
    } else {
        bb.mode = 'normal';
        document.REPLIER.bbmode[1].checked = true;
    }
  }
  // i think this is for the guided mode? uhh but i dont trust it LMAO so im gonna... override it anyway

  /*-------------------------------------------*\
  |*---------- Simple tags function -----------*|
  |*-------------- B, U, I etc. ---------------*|
  \*-------------------------------------------*/

  function ins_tag(tag) {
      var start=0, end=0, editor = document.REPLIER.post_area, openTag, button;
      if (is_ie) {
          var sel = document.selection;
          var rng = sel.createRange();
              rng.colapse;
          if (sel.type == "Text" && rng != null) {
              jBBCode.addTag('['+tag.toLowerCase()+']','[/'+tag.toLowerCase()+']');
              return;
          }
      } else {
          start       = editor.selectionStart;
          end         = editor.selectionEnd;
      }
      button = jBBCode.getButton(tag);
      openTag = button.value.match(/\*/);
      if (start != end) {
          jBBCode.addTag('['+tag.toLowerCase()+']','[/'+tag.toLowerCase()+']');
      } else if (openTag) {
          button.setAttribute('value', ' '+tag+' ');
          jBBCode.addTag('[/'+tag.toLowerCase()+']');
          document.REPLIER.tagcount.value--;
          jBBCode.openTags=jBBCode.openTags.replace("|"+tag,'');
      } else if (jBBCode.mode=='ezmode') {
          inserttext = prompt(jBBCode.text["start"] + "\n[" + tag + "]Your Text[/" + tag + "]");
          if ( (inserttext != null) && (inserttext != "") ) {
              jBBCode.addTag("[" + tag.toLowerCase() + "]" + inserttext + "[/" + tag.toLowerCase() + "] ");
          }
      } else {
          if (tag == 'CODE' || tag == 'QUOTE') {
              closeall();
          }
          button.value+='*';
          hstat('click_close');
          jBBCode.addTag('['+tag.toLowerCase()+']');
          document.REPLIER.tagcount.value++;
          jBBCode.openTags+='|'+tag;
      }
  }