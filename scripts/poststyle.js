// has to be hijacked b/c we killed the Post whoops
document.addEventListener("DOMContentLoaded", () => {
const searchparam = new URLSearchParams(document.location.search);
const pagecode = searchparam.get("CODE");
const pageact = searchparam.get("act");
if( !(pageact === "Post" && (pagecode === "02" || pagecode === "08")) ) return false
const tag = document.createElement("script");
  tag.innerHTML = `var insCode = new function() {
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
  }`
  document.getElementsByTagName("head")[0].appendChild(tag);
  
});
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
          insCode.addTag('['+tag.toLowerCase()+']','[/'+tag.toLowerCase()+']');
          return;
      }
  } else {
      start       = editor.selectionStart;
      end         = editor.selectionEnd;
  }
  button = insCode.getButton(tag);
  openTag = button.value.match(/\*/);
  if (start != end) {
      insCode.addTag('['+tag.toLowerCase()+']','[/'+tag.toLowerCase()+']');
  } else if (openTag) {
      button.setAttribute('value', ' '+tag+' ');
      insCode.addTag('[/'+tag.toLowerCase()+']');
      document.REPLIER.tagcount.value--;
      insCode.openTags=insCode.openTags.replace("|"+tag,'');
  } else if (insCode.mode=='ezmode') {
      inserttext = prompt(insCode.text["start"] + "\n[" + tag + "]Your Text[/" + tag + "]");
      if ( (inserttext != null) && (inserttext != "") ) {
          insCode.addTag("[" + tag.toLowerCase() + "]" + inserttext + "[/" + tag.toLowerCase() + "] ");
      }
  } else {
      if (tag == 'CODE' || tag == 'QUOTE') {
          closeall();
      }
      button.value+='*';
      hstat('click_close');
      insCode.addTag('['+tag.toLowerCase()+']');
      document.REPLIER.tagcount.value++;
      insCode.openTags+='|'+tag;
  }
}

function bc_post_style(...args) {
  const [post, styles, fieldlist, options] = args
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
          post_style_options: json?.meta_data?.post_style_options || Object.fromEntries(Object.entries(fieldlist).map(([k,]) => [k,'']))
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
      callback(e, data)
    }
  );

  // post view
  if (!document?.REPLIER?.Post || document?.REPLIER?.qrc) return false
  _add_menu(stylemap, fieldmap, options, framework)
  // _load_menu(framework, options)
  document.querySelectorAll(".codebuttons[onclick*='simpletag']").forEach(btn => btn.setAttribute('onclick', btn.getAttribute('onclick').replace("simpletag","ins_tag")))
	const bbcodes = document.querySelectorAll(".codebuttons");
	const custombbcode_start = Array.from(bbcodes).indexOf( Array.from(document.querySelectorAll(".codebuttons[accesskey]")).slice(-1)[0] );
	for(let i = custombbcode_start; i < bbcodes.length ; i++) {
		const tag = bbcodes[i].value.trim()
    bbcodes[i].name = tag
		bbcodes[i].setAttribute("onclick", `ins_tag("${tag}")`)
	}
}

function bc_better_ucp(args) {
  if (!document.querySelector('input[name="CODE"][value="21"]')) return false;

  const validate_field_table = (table) => {
    const flattened = flatten_mixed_array(table);
    const flattened_ids = flattened.filter(e => Number.isInteger(e));
    return new Set(flattened_ids).size !== flattened_ids.length;
  }

  // Convert stringified variables embedded in the HTML templates into useable variables. Requires the field ID & associated template.
  const parse_template = (id, template) => {
    const forminput = document.querySelector("#ucpcontent .forminput[name='field_" + id + "']");
    const key_val = forminput ?
      {
        label: forminput.closest("tr").querySelector("label").innerHTML,
        description: Array.from(forminput.closest("tr").getElementsByTagName("td")[0].childNodes)[4]?.textContent.trim() ?? "",
        input: forminput.closest("td").innerHTML,
        id: id
      } :
      {
        day: '<select name="day" class="forminput">' + document.querySelector("select[name='day']").innerHTML + '</select>',
        month: '<select name="month" class="forminput">' + document.querySelector("select[name='month']").innerHTML + '</select>',
        year: '<select name="year" class="forminput">' + document.querySelector("select[name='year']").innerHTML + '</select>',
        website: document.querySelector("input[name='WebSite']").parentNode.innerHTML,
        location: document.querySelector("input[name='Location']").parentNode.innerHTML,
        interests: document.querySelector("textarea[name='Interests']").parentNode.innerHTML,
        submit: document.querySelector("#ucpcontent form .forminput[type='submit']").closest("td").innerHTML
      }
    const template_content = Array.from(document.querySelector(template).content.childNodes).reduce((acc, curr) => acc += curr.outerHTML || curr.nodeValue || "", "");
    const template_content_replaced = template_content.replaceAll(/(\$\{)(.*?)(\})/g, (m, _, p2) => key_val[p2] ?? m);
    return template_content_replaced;
  }

  // Take an array that contains mixed data, such as arrays, JS objects, text, etc., and flatten it.
  // ! Does not preserve nesting order.
  const flatten_mixed_array = (obj) => {
    const result = [];
    if (typeof obj !== "object") result.push(obj);
    else {
      for (const k in obj) {
        if (!Array.isArray(obj)) result.push(...flatten_mixed_array(k));
        result.push(...flatten_mixed_array(obj[k]));
      }
    }
    return result;
  }
  // Takes an object and flattens it. Does preserve nesting order.
  // https://www.tutorialspoint.com/flattening-a-json-object-in-javascript
  const flatten_object = (obj, res = {}, extraKey = '') => {
    for (key in obj) {
      if (typeof obj[key] !== 'object') {
        const newKey = !Array.isArray(obj) ? key : '';
        const attr_made = Object.hasOwn(res, extraKey.trim() + newKey);
        attr_made ? res[extraKey.trim() + newKey].push(obj[key]) : res[extraKey.trim() + newKey] = [obj[key]];
      } else {
        const newKey = !Array.isArray(obj) ? key : key;
        flatten_object(obj[key], res, extraKey + newKey + " ");
      };
    };
    return res;
  };

  const translate_group = (name, t) => {
    const result = t.get(name);
    if (!result) throw new Error(`Cannot find definition for field group: %${name}`);
    return result;
  }

  // Transpose the field templates list so that it is organised field number first.
  const get_transposed_fields = (transposed, default_field, template_class) => {
    const _field_templates = new Map([[0, default_field]]);
    for (const [k, v] of Object.entries(transposed)) {
      v.forEach(i => _field_templates.set(i, k + "." + template_class));
    }
    return _field_templates;
  }

  const get_field_templates = (table, id) => {
    const template = table.get(id) || table.get(0);
    const range = document.createRange();
    const html_template = range.createContextualFragment( parse_template(id, template) );
    return html_template.getRootNode().childNodes
  }

  // for a cleaner main()... just indexes the UCP for the full field list, as well as required and optional fields.
  const get_field_list = () => {
    const get_field_id = (f) => Array.from(f).map(e => parseInt(e.getAttribute('name').slice(6)));
    const field_list = get_field_id(document.querySelectorAll('#ucpcontent form .forminput[name^=field]')),
      required_fields = get_field_id(document.querySelectorAll('#ucpcontent form table')[0].querySelectorAll('.forminput[name^=field]')),
      optional_fields = get_field_id(document.querySelectorAll('#ucpcontent form table')[1].querySelectorAll('.forminput[name^=field]'));
    return { field_list, required_fields, optional_fields };
  }

  // Takes an object or array, finds any referenced field group variables, and converts them into field indexes.
  const get_grouped_fields = (obj, table) => {
    let result = obj;
    if (typeof obj === "object") {
      for (const k in obj) {
        const to_insert = get_grouped_fields(obj[k], table);
        if (Array.isArray(obj) && Array.isArray(to_insert)) {
          const index = obj.indexOf(obj[k]);
          obj.splice(index, 1, ...to_insert);
        } else {
          obj[k] = to_insert;
        }
      }
    }
    else if (!Number.isInteger(obj) && Array.from(obj.trim())[0] == "%") {
      const group_name = obj.trim().slice(1).trim();
      const translation = translate_group(group_name, table);
      result = translation;
    }
    return result;
  }

  const get_level_map = (curr_node, depth = 0, map = new Array()) => {
    if (curr_node !== null) {
      map[depth] === undefined ?
        map[depth] = [curr_node] :
        map[depth] = [...map[depth], curr_node];
      for (const node of curr_node.children) get_level_map(node, depth + 1, map);
    }
    return map;
  }

  const ucpform = document.querySelector("#ucpcontent form"),
    { field_list, required_fields, optional_fields } = get_field_list(),
    wrapper_name = args.wrapper_name || "betterdiv",
    template_class = args.template_class || "better_ucp_templates",
    inner_structure = args.template_inner_structure || "#inner_structure",
    default_field = args.template_default_field || "#default_field",
    field_groups = new Map(Object.entries({ ...args.field_groups, required: required_fields, optional: optional_fields })) || new Map(Object.entries({ required: required_fields, optional: optional_fields })),
    field_order = get_grouped_fields(args.field_order, field_groups) || [],
    flattened_order = flatten_mixed_array(field_order),
    field_templates_transposed = get_grouped_fields(args.field_templates, field_groups) || {},
    field_templates = get_transposed_fields(field_templates_transposed, default_field, template_class);

  // Throw error if there are duplicate field IDs listed in field_order or field_templates
  const validate = {
    templates: validate_field_table(field_templates_transposed),
    order: validate_field_table(field_order)
  }
  if (validate.templates || validate.order) {
    throw new Error(`Duplicate field IDs listed in field_templates or field_order.`);
  }

  // Create wrapper
  const doc = document.createElement('body');
  const wrapper = document.createElement('div');
  wrapper.id = wrapper_name;
  wrapper.innerHTML += '<input type="hidden" name="act" value="UserCP"><input type="hidden" name="CODE" value="21">';
  doc.append(wrapper);

  // Fill the inner structure
  const inner_structure_translated = parse_template('', inner_structure + "." + template_class);
  const inner_structure_parsed = new DOMParser().parseFromString(inner_structure_translated, "text/html")
  const inner_structure_body = inner_structure_parsed.getRootNode().body;
  wrapper.append(...inner_structure_body.childNodes);
  const objected_order = { ["#" + wrapper_name]: field_order };
  const order = Object.entries(flatten_object(objected_order)).map(([k, v]) => [k.split(" ").filter((str,) => Number.isNaN(parseInt(str)) ).join(" "), v]);
 
  // Track nodes used
  const visited_nodes = [];
  for (const [selector, fields] of order) {
    let parent = null;
    for (const id of fields) {
      const parent_possibilities = doc.querySelectorAll(selector);
      for (const p of parent_possibilities)
        if (visited_nodes.indexOf(p) === -1) parent = p;
      if (!parent) throw new Error(`${selector} doesn't exist in your given inner structure. Accidental duplicate selectors listed in field_order is likely the culprit.`);
      parent.append(...get_field_templates(field_templates, id));
    }
    visited_nodes.push(parent)
  }
  // Dump all default variables that aren't included in the field order, so we need a way to compare field order list versus field list.
  const get_shallowest_node = (list) => {
    const level_structure_map = get_level_map(wrapper).slice(1);
    for (const floor of level_structure_map) {
      const floor_census = floor.filter(door => {
        for (const el of list) {
          if(el === door || door.contains(el)) return door; 
        }
        
      });
      if (floor_census.length > 0) return floor_census.pop()
    }
    return false;
  }
  const shallowest_node = get_shallowest_node(visited_nodes);
  const undeclared_fields = field_list.filter(f => flattened_order.indexOf(f) < 0);
  const dump_remaining = shallowest_node || wrapper.lastChild;
  for (const id of undeclared_fields.reverse()) {
    dump_remaining.after(...get_field_templates(field_templates, id));
  }
  // Add wrapper to document
  while (ucpform.firstChild) ucpform.removeChild(ucpform.firstChild);
  ucpform.appendChild(wrapper);
};