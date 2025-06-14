function bc_post_style(...args) {
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
        const matched = Array.from(users).filter(([, x]) => searchkey.length > 0 && Array.from(document.REPLIER.tag_user.selectedOptions, o => o.innerText).indexOf(x) === -1 && x.toLowerCase().startsWith(searchkey.toLowerCase()));
        if (matched.length > 0) {
          document.REPLIER.tag_user_view.style.display = 'initial'
          document.REPLIER.tag_user_view.innerHTML = ''
          document.REPLIER.tag_user_view.size = matched.length < 4 ? matched.length : 4
          document.REPLIER.tag_user_view.insertAdjacentHTML('beforeend', matched.map(([i, user]) => "<option value='" + i + "'>" + user + "</option>").join(""))
          document.REPLIER.tag_user_view.addEventListener("change", ()=>{
            Array.from(document.REPLIER.tag_user_view.selectedOptions).forEach(x => x.addEventListener("click", () => {
              if (x.getAttribute("has-event") === "true") return false
              x.setAttribute("has-event", "true")
              const id = x.value
              document.REPLIER.tag_user.options[id].selected = true
              const tag = document.createElement("tag")
              tagmenu.querySelector(".tags_preview").append(tag)
              tag.innerText = x.innerText
              tag.addEventListener("click", () => {
                document.REPLIER.tag_user.options[id].selected = false
                tag.remove()
              })
              x.remove()
              document.REPLIER.tag_user_search.value = ""
              document.REPLIER.tag_user_search.focus();
              document.REPLIER.tag_user_view.size = (matched.length - 1) < 4 ? matched.length - 1 : 4
              if (document.REPLIER.tag_user_view.size < 1) document.REPLIER.tag_user_view.style.display = 'none'
            }))
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
    stylemap.forEach((v, i) => menu.querySelector(".pformright select").insertAdjacentHTML("beforeend", "<option value='" + i + "'>" + v.name + "</option>"))
    menu.addEventListener("change", (evt) => {
      const $this = evt.target
      document.querySelectorAll(".post-style-options").forEach(option => {
        option.setAttribute("data-visible", "false")
        option.querySelector(".pformright").children[0].required = false;
      })
      if(parseInt($this.value)===0) return false;
      const _selected = stylemap.get(parseInt($this.value))
      const _fields = _selected.fields.map(field => fieldmap.get(field))
      _fields.forEach(_f => {
        document.querySelector(".post-style-options[data-value='" + _f.value + "']").setAttribute("data-visible", "true")
        document.querySelector(".post-style-options[data-value='" + _f.value + "'] .pformright").children[0].required = _f.required
      })
    })
  }

  const _parse_template = (template, data) => {
    const key_val = {
      post: data.post,
      tags: data.tag_user,
      ...data.post_style_options
    }
    const template_content = Array.from(document.querySelector("template"+template).content.childNodes).reduce((acc, curr) => acc += curr.outerHTML || curr.nodeValue || "","")
    const template_content_replaced = template_content.replaceAll(/\$\{([^\.]*?)\}/g, (_,p1) => key_val[p1]).replaceAll(/\$\{(.*?)\.(.*?)\}/g, (_,p1,p2) => key_val[p1][p2])
    return template_content_replaced
  }

  const [post, styles, fieldlist, options] = args
  // prepare styles by turning it into a map!
  const fieldmap = new Map(Object.entries(fieldlist).map(([k, v], i) => [k, { value: i, ...v }]))
  const stylemap = new Map(Object.entries({ "---": [], ...styles }).map(([k, v], i) => [i, { name: k, ...v[1] }]))

  bc_post_framework(post, {
    "post_style": () => document.REPLIER.post_style.selectedOptions[0].innerText,
    "post_style_options": () => Object.fromEntries(Array.from(document.querySelectorAll(".post-style-options"), x => [ x.dataset.id, x.querySelector(".pformright").children[0].value ])),
    "tag_user": () => Array.from(document.REPLIER.tag_user.selectedOptions, x => "@[" + x.innerHTML.trim() + "]"),
  }, function (e, metadata) {
    if(metadata.post_style === "---") return false
    const style = styles[metadata.post_style]
    const [selector, _, callback=()=>{}] = style
    const template = _parse_template(selector, { post: e.innerHTML.trim(), ...metadata })
    e.innerHTML = template
    callback(e, metadata)
  });

  // post view
  if (!document.REPLIER.Post || document.REPLIER.qrc) return false
  _add_menu(stylemap, fieldmap, options)
}