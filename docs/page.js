const dir = window.location.pathname

const get_from_url = async (file) => {
  const response = await fetch(file)
  if (!response.ok)
    return []
  const text = await response.text()
  const doc = new DOMParser().parseFromString(text, "text/html")
  return doc.body.children
}

const load_scripts = (...urls) => {
  /* stack overflow: https://stackoverflow.com/a/950146 */
  const ls = (url, callback) => {
    const script = document.createElement("script")
    script.src = url
    document.head.appendChild(script)
    script.onreadystatechange = callback
    script.onload = callback
  }
  const load = (arr) => {
    const url = arr.shift()
    ls(url, arr.length > 0 ? () => load(arr) : false)
  }

  load(urls)
}

const load_html = async (name) => {
  const file = await get_from_url(dir + name + ".html")
  const el = document.getElementById(name)
  file.length > 0 ? el.append(...file) : el.append("nothing here for now!")
}

const load_page = async () => {
  await load_html("demo")
  await load_html("use")
  load_scripts("/scripts/" + dir.split("/").slice(-2,-1) + ".js", "demo.js")
}

window.addEventListener("load", load_page)