const styles = {
  "Audi Audle": ["#_audi", { fields: ["square img", "lyrics #1"] }],
  "BMW": ["#_bmw", { fields: ["horizontal img", "lyrics #1", "lyrics #2"] }]
}

bc_post_style(".postcolor", styles, {
  "square img": {
    label: `Square image: `,
    required: true,
    html: `<input type="url" placeholder="https://placehold.co/100x100.png"/>`
  },
  "horizontal img": {
    label: `Horizontal image: `,
    required: true,
    html: `<input type="url" placeholder="https://placehold.co/500x250.png"/>`
  },
  "lyrics #1": {
    label: `Lyrics #1: `,
    required: true,
    html: `<input type="text" placeholder="a short lyric #1"/>`
  },
  "lyrics #2": {
    label: `Lyrics #2: `,
    required: true,
    html: `<input type="text" placeholder="a short lyric #2"/>`
  }
}, {
  "templates": "poststyle_templates",
  "usertag": [true, ["AMa-10", "Isidro", "Sona", "Metis Geraldine"]]
}
)

document.REPLIER.addEventListener("submit", () => {
  if(document.REPLIER.Post.value.length < 1) return false
  document.querySelector('.postcolor').innerHTML = document.REPLIER.Post.value
  // console.log(document.REPLIER.Post.value)
  const _parse_post = (e, repl=e) => {
    if (!e.innerHTML.trim()) {
      return {
        post: '', html: {}, mdata: {}
      }
    }
    const m = {
      "meta_begin": e.innerHTML.match(/\[\[mdata\]\]/im),
      "meta_end": e.innerHTML.match(/\[\[\/mdata\]\]/im),
      "post_begin": e.innerHTML.match(/\[\[post\]\]/im),
      "post_end": e.innerHTML.match(/\[\[\/post\]\]/im),
      "html_begin": e.innerHTML.match(/\[\[mhtml\]\]/im),
      "html_end": e.innerHTML.match(/\[\[\/mhtml\]\]/im)
    }
    const mdata = e.innerHTML.slice(m.meta_begin.index + m.meta_begin[0].length, m.meta_end.index)
    const post = e.innerHTML.slice(m.post_begin.index + m.post_begin[0].length, m.post_end.index)
    const html = e.innerHTML.slice(m.html_begin.index + m.html_begin[0].length, m.html_end.index)
    const html_finder = [...html.matchAll(/\[\[(.*?)]](.*?)\[\[\/.*?]]/gim)]

    const json = {
    post: post,
    html: Object.fromEntries(html_finder.map(f => [f[1], f[2]])),
    meta_data: JSON.parse(mdata)
    }
    repl.innerHTML = json["post"]
    return json
  }
  const _parse_template = (template, data, options = {}) => {
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
  switch_demo("?showtopic")
  const data = _parse_post(document.querySelector('.postcolor'))
  const metadata = data.meta_data
  const style = styles[metadata.post_style]
  const [selector = "", _, callback = ()=>{}] = (metadata.post_style === "---")  ? ['', '', ()=>{}] : style
  const template = _parse_template(selector, { ...data, post: document.querySelector('.postcolor').innerHTML.trim() })
  document.querySelector('.postcolor').innerHTML = template
  callback(document.querySelector('.postcolor'), metadata)
})