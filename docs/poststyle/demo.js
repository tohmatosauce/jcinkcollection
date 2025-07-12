const styles = {
  "Audi": ["#_audi", { fields: ["square img", "lyrics #1"] }],
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
  const _parse_post = (e, repl = e) => {
    try {
      const str = e.innerHTML.trim().replaceAll("\n", "\\n");;
      const json = JSON.parse(str)
      repl.innerHTML = json["post"].replaceAll("&amp;quot;", '"')
      return json["meta_data"]
    } catch (e) {
      return false;
    }
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
  switch_demo("?showtopic")
  const metadata = _parse_post(document.querySelector('.postcolor'))
  if(metadata.post_style === "---") return false;
    console.log(metadata.post_style)
  const style = styles[metadata.post_style]
  const [selector, _, callback] = style
  const template = _parse_template(selector, { post: document.querySelector('.postcolor').innerHTML.trim(), ...metadata })
  document.querySelector('.postcolor').innerHTML = template
  callback(document.querySelector('.postcolor'), metadata)
})