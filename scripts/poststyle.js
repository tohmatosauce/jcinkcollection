// has to be hijacked b/c we killed the Post whoops
document.addEventListener("DOMContentLoaded", () => {
const searchparam = new URLSearchParams(document.location.search);
const pagecode = searchparam.get("CODE");
const pageact = searchparam.get("act");
if( !(pageact === "Post" && (pagecode === "02" || pagecode === "08")) ) return false
const tag = document.createElement("script");
  tag.innerHTML = 
  `jBBCode = new function() {
    // need to be on the right page or wtvr
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
  
  function simpletag(tag) {
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
    openTag = button.value.match(/\\*/);
    if (start != end) {
        jBBCode.addTag('['+tag.toLowerCase()+']','[/'+tag.toLowerCase()+']');
    } else if (openTag) {
        button.setAttribute('value', ' '+tag+' ');
        jBBCode.addTag('[/'+tag.toLowerCase()+']');
        document.REPLIER.tagcount.value--;
        jBBCode.openTags=jBBCode.openTags.replace("|"+tag,'');
    } else if (jBBCode.mode=='ezmode') {
        inserttext = prompt(jBBCode.text["start"] + "\\n[" + tag + "]Your Text[/" + tag + "]");
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
  `
  document.getElementById("code-buttons").appendChild(tag);
});


function bc_post_style(...args) {
  const [post, styles, fieldlist, options, postcb = ()=>{}] = args
  if (!document.querySelector(post) && !document.REPLIER?.Post) return false

  const _add_menu = (stylemap, fieldmap, options, json) => {
    const fw = { 
      meta_data: {
        post_style: json?.meta_data?.post_style || "---", 
        post_style_options: json?.meta_data?.post_style_options || Object.fromEntries(Object.entries(fieldlist).map(([k,]) => [k,'']))
      },
      html: {
        tag_user: json?.html?.tag_user || ""
      },
      post: json?.post || ''
    }

    document.getElementById("post-options").insertAdjacentHTML('afterend', "<tr id='post-style-header'><td>Post Settings</td></tr>")
    
    const menu = document.createElement("tr")
    const select = document.createElement("select")

    document.getElementById("post-style-header").after(menu)
    menu.id = "post-style-menu"
    menu.innerHTML = "<td class='pformleft'>Post Style</td><td class='pformright'></td>"

    /* setting up user tags + loading any existing user tags in */
    if (options.usertag[0]) {      
      const tagmenu = document.createElement("tr")
      menu.insertAdjacentElement('beforebegin', tagmenu);
      tagmenu.id = "tag-user-menu";
      
			const remove_tag = (tag, id, x) => {
        document.REPLIER.tag_user.options[id].selected = false
        x.selected = false
        tag.remove()
        const tag_matcher = [...document.REPLIER.post_area_tag_user.value.matchAll(/\[user=.*?](.*?)\[\/user]|@\[(.*?)]/gim)].filter(u => u[2] === x.innerText || u[1] === x.innerText)
        const tag_remover = tag_matcher.map(u => [u[0], u[2] ?? u[1]])
        if (tag_remover[0][1] === x.innerText) document.REPLIER.post_area_tag_user.value = document.REPLIER.post_area_tag_user.value.replace(tag_remover[0][0], '')
        x.style.display = "block"
        x.setAttribute("has-event", "false")
       document.REPLIER.tag_user_view.size = (document.REPLIER.tag_user_view.size + 1) < 4 ? (document.REPLIER.tag_user_view.size + 1) : 4
      }
      
      const add_tag = (x) => {
        if (x.getAttribute("has-event") === "true") return false
        x.setAttribute("has-event", "true")
        // add to tag view
        const id = x.value
        document.REPLIER.tag_user.querySelector("option[value='"+id+"']").selected = true
        const tag = document.createElement("tag")
        tag.addEventListener("click", remove_tag.bind(null, tag, id, x))
        tagmenu.querySelector(".tags_preview").append(tag)
        tag.innerText = x.innerText
        // check if usertag is already loaded in the textarea itself and add if not
        const tag_finder = [...document.REPLIER.post_area_tag_user.value.matchAll(/\[user=.*?](.*?)\[\/user]/gim)].map(user => user[1])
        if(tag_finder.indexOf(x.innerText) < 0) document.REPLIER.post_area_tag_user.value += "@[" + x.innerText + "]"
        // remove tag
        x.style.display = "none"
        // document.REPLIER.tag_user_search.value = ""
        document.REPLIER.tag_user_search.focus();
      }
      
      const search_tag = (evt, usertags) => {
        const searchkey = evt.target.value;
        const matched = usertags.filter(([, x]) => searchkey.length > 0 && Array.from(document.REPLIER.tag_user.selectedOptions, o => o.innerText).indexOf(x) === -1 && ( x.normalize("NFD").replace(/\p{Diacritic}/gu, '').toLowerCase().includes(searchkey.toLowerCase()) || x.normalize("NFC").toLowerCase().includes(searchkey.toLowerCase()) ) );

        if (matched.length > 0) {
          document.REPLIER.tag_user_view.style.display = 'initial'
          document.REPLIER.tag_user_view.innerHTML = ''
          document.REPLIER.tag_user_view.size = matched.length < 4 ? matched.length : 4
          document.REPLIER.tag_user_view.insertAdjacentHTML('beforeend', matched.map(([i, user]) => "<option value='" + i + "'>" + user + "</option>").join(""))
          document.REPLIER.tag_user_view.addEventListener("change", ()=>{
            Array.from(document.REPLIER.tag_user_view.selectedOptions).forEach(x => add_tag(x))
            const size = document.REPLIER.tag_user_view.options.length - document.REPLIER.tag_user_view.querySelectorAll("[has-event='true']").length
            document.REPLIER.tag_user_view.size = size < 4 ? size : 4
            if (document.REPLIER.tag_user_view.size < 1) document.REPLIER.tag_user_view.style.display = 'none'
          })
        } else {
          document.REPLIER.tag_user_view.style.display = 'none'
        }
      }
      
      (async () => {
        const usertags = await options.usertag[1]();
        tagmenu.innerHTML = "<select name='tag_user' multiple hidden disabled>" + usertags.map(([id, user]) => "<option value='" + id + "'>" + user + "</option>").join("") + "</select><td class='pformleft'>Tag user(s)</td><td class='pformright'><div class='tags_preview'></div><input type='text' name='tag_user_search' placeholder='Search user(s)'/><select name='tag_user_view' style='display:none;overflow:auto' multiple></select></td>"
        document.REPLIER.tag_user_search.addEventListener("input", (evt) => search_tag(evt, usertags))
        if(!json.html || !json.html.tag_user) return false
        const tag_finder = [...fw.html.tag_user.matchAll(/\d*,/gim)].map(id => id[0].slice(0,-1))
        const tag_map = new Map(usertags)
        tag_finder.forEach(id => {
          const name = tag_map.get(id)
          document.REPLIER.tag_user.querySelector("option[value='"+id+"']").selected = true
          const tag = document.createElement("tag")
          document.querySelector(".tags_preview").append(tag)
          tag.innerText = name
          // remove tag
          tag.addEventListener("click", () => {
            document.REPLIER.tag_user.options[id].selected = false
            tag.remove()
            const tag_remover = [...document.REPLIER.post_area_tag_user.value.matchAll(/\[user=(\d*).*?].*?\[\/user]/gim)].filter(u => u[1] === id)
            if (tag_remover.length > 0) document.REPLIER.post_area_tag_user.value = document.REPLIER.post_area_tag_user.value.replace(tag_remover[0][0], '')
          })
        })
      })()
    }

    /* adds field menus (not loaded any pre-existing data yet) */
    const fields = Array.from(fieldmap).map(([k,v]) => `<td class='post-style-options' data-value='${v.value}' data-id='${k}'><div class='pformleft'>${v.label}</div><div class='pformright'>${v.html}</div></td>`)
    menu.insertAdjacentHTML('afterend', '<tr id="options-header"><td>Template Options</td></tr><tr id="post-style-options">' + fields.join("") + '</tr>')

    menu.querySelector(".pformright").append(select)
    select.id = "post-style"
    select.name = "post_style"
    stylemap.forEach(v => {
      if(v.group && !menu.querySelector("optgroup[label='"+v.group+"']")) 
        menu.querySelector(".pformright select").insertAdjacentHTML("beforeend", "<optgroup label='"+ v.group +"'></optgroup>")
      const appendTo = menu.querySelector("optgroup[label='"+v.group+"']") || menu.querySelector(".pformright select")
      appendTo.insertAdjacentHTML("beforeend", "<option value='"+ v.name +"'>" + v.name + "</option>")
    })
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
    
    /* loading in data to the menu */
    document.querySelectorAll(".post-style-options").forEach(tr => tr.setAttribute("data-visible", "false"))
    if (!document.REPLIER.Post.innerHTML.trim() || !json) return false;
    const metadata = fw.meta_data
    
    document.REPLIER.post_style.value = metadata.post_style || "---"
    document.querySelectorAll(".post-style-options").forEach(option => {
      option.setAttribute("data-visible", "false")
      option.querySelector(".pformright").children[0].required = false;
    })
    
    const style_options = document.querySelectorAll(".post-style-options")
    style_options.forEach(style => {
      const name = style.dataset.id
      const value = metadata.post_style_options[name]
      style.querySelector(".pformright").children[0].value = value
    })
    
    if(document.REPLIER.post_style.value==="---") return false;

    const _selected = stylemap.get(document.REPLIER.post_style.value)
    const _fields = _selected.fields.map(field => fieldmap.get(field))
    _fields.forEach(_f => {
      document.querySelector(".post-style-options[data-value='" + _f.value + "']").setAttribute("data-visible", "true")
      document.querySelector(".post-style-options[data-value='" + _f.value + "'] .pformright").children[0].required = _f.required
    })
  }

  const _parse_template = (template, data, options) => {
    const key_val = {
      post: data.post,
      ...data.html,
      ...data.meta_data.post_style_options,
    }
    const template_class = options.templates || "poststyle_templates"
    const template_content = data.meta_data.post_style === "---" ? ("<post>${post}"+ (data.html.tag_user?"<br><br>${tags}":"") + "</post>") : Array.from(document.querySelector("template"+template+"."+template_class).content.childNodes).reduce((acc, curr) => acc += curr.outerHTML || curr.nodeValue || "","")
    const template_content_replaced = template_content.replaceAll(/\$\{([^\.]*?)\}/g, (_,p1) => key_val[p1] ?? "").replaceAll(/\$\{(.*?)\.(.*?)\}/g, (_,p1,p2) => key_val[p1][p2])
    return template_content_replaced
  }
  
  // prepare styles by turning it into a map!
  const fieldmap = new Map(Object.entries(fieldlist).map(([k, v], i) => [k, { value: i, ...v }]))
  const stylemap = new Map(Object.entries({ "---": [], ...styles }).map(([k, v]) => [k, { name: k, ...v[1] }]))

  const framework = bc_post_framework(post, {
      text: {
        "post_style": () => document.REPLIER.post_style.selectedOptions[0].innerText,
        "post_style_options": () => Object.fromEntries(Array.from(document.querySelectorAll(".post-style-options"), x => [ x.dataset.id, x.querySelector(".pformright").children[0].value]))
      }, 
      html: {
        "tag_user": () => Array.from(document.REPLIER.tag_user.selectedOptions, x => "@[" + x.innerHTML.trim() + "]")
      }
    }, function (e, json) {
      // validating stuff huzzuh
      if(!json) return false;
      const data = { 
        meta_data: {
          post_style: json?.meta_data?.post_style || "---", 
          post_style_options: json?.meta_data?.post_style_options || Object.fromEntries(Object.entries(fieldlist).map(([k,]) => [k,''])),
          forum_id: json.meta_data.forum_id,
          author_name: json.meta_data.author_name,
          author_id: json.meta_data.author_id
        },
        html: {
          tags: json?.html?.tag_user || "",
          "tags exists": json?.html?.tag_user ? 1 : 0
        },
        post: json?.post || ''
      }
      
      const [selector = "", _, callback = ()=>{}] = (data.meta_data.post_style === "---") ? ['', '', ()=>{}] : styles[data.meta_data.post_style]
      data.meta_data.post_style_options = Object.fromEntries(Object.entries(data.meta_data.post_style_options).map(([k,v]) => [k,v]))
      const post_options_exists = Object.fromEntries(Object.entries(data.meta_data.post_style_options).map(([k,v]) => [k+" exists", v.trim() ? 1 : 0]));
      data.meta_data.post_style_options = {...post_options_exists, ...data.meta_data.post_style_options};
      const template = _parse_template(selector, data, options)
      e.innerHTML = template

      const methods = {
        "parse": (selector, data, options) => _parse_template(selector, data, options)
      }
      callback(e, data, methods, args)
      postcb(e, data, methods, args)
    }
  );

  // post view
  if (!document?.REPLIER?.Post || document?.REPLIER?.qrc) return false
  _add_menu(stylemap, fieldmap, options, framework)
  // _load_menu(framework, options)
  // document.querySelectorAll(".codebuttons[onclick*='simpletag']").forEach(btn => btn.setAttribute('onclick', btn.getAttribute('onclick').replace("simpletag","ins_tag")))
	const bbcodes = document.querySelectorAll(".codebuttons");
	const custombbcode_start = Array.from(bbcodes).indexOf( Array.from(document.querySelectorAll(".codebuttons[accesskey]")).slice(-1)[0] );
	for(let i = custombbcode_start; i < bbcodes.length ; i++) {
		const tag = bbcodes[i].value.trim()
    bbcodes[i].name = tag
		bbcodes[i].setAttribute("onclick", `simpletag("${tag}")`)
	}
}