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

const load_html = async (name, callback = ()=>{}) => {
  const file = await get_from_url(dir + name + ".html")
  const el = document.createElement("section")
  el.id = name
  file.length > 0 ? el.append(...file) : el.append("nothing here for now!")
  document.body.append(el)
  callback(el);
}

const switch_demo = (name) => {
  document.getElementById("demo-switcher").value = name
  document.querySelector("demo.visible").classList.remove("visible")
  document.querySelector("demo[name='"+name+"']").classList.add("visible")
}

const build_page = async () => {
  await load_html("demo", (section) => {
    const demos = section.querySelectorAll("demo")
    const options = Array.from(demos, demo => "<option value='" + demo.getAttribute("name") +"'>" + demo.getAttribute("name") + "</option>")
    section.insertAdjacentHTML("beforebegin", "<select value='" + section.querySelector("demo.visible")?.getAttribute("name") + "' id='demo-switcher'>" + options.join("") + "</select>")
    document.getElementById("demo-switcher").addEventListener("change",(evt) => {
      const name = evt.target.value
      document.querySelector("demo.visible").classList.remove("visible")
      document.querySelector("demo[name='"+name+"']").classList.add("visible")
    })
  })
  await load_html("usage")
  const stylesheet = document.createElement("link")
  stylesheet.href = "/jcinkcollection/style/css/" + dir.split("/").slice(-2,-1) + ".css"
  stylesheet.rel = "stylesheet"
  document.head.appendChild(stylesheet)
  load_scripts("/jcinkcollection/scripts/" + dir.split("/").slice(-2,-1) + ".js", "demo.js")
}

window.addEventListener("load", build_page)