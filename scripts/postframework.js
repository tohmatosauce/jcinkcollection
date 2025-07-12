function bc_post_framework(...args){
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
 const _load_post = (e, callback) => {
  if(!e) return false;
  const metadata = _parse_post(e);
  callback(e, metadata);
 }
 const _submit_post = (evt, schema) => {
  let validate = false;
  try { validate = ValidateForm(); } 
  catch { validate = true; }
  if(evt.submitter.name !== "preview" && (!document.REPLIER.TopicTitle || document.REPLIER.TopicTitle.value.length >= 2) && validate) {
   const data = Object.entries(schema).map(([k,v])=> {
    try {
     const name = k, value = v();
     return [name, value]
    } catch {
     return []
    }
   }).filter(arr => arr.length > 0);
   const post = "[[post]]" + document.REPLIER.post_area.value + "[[/post]]"
   const json = Object.fromEntries(data)
   document.REPLIER.Post.value = "[[mdata]]" + JSON.stringify(json) + "[[/mdata]]" + post + "[[mhtml]]" + Array.from(document.querySelectorAll(".post_areas"), area => "[["+area.name.split("post_area_")[1]+"]]" + area.value + "[[/"+area.name.split("post_area_")[1]+"]]").join("") + "[[/mhtml]]"
  }
 }
 const _clone_area = (e) => {
  const post_area = e.cloneNode(true);
  post_area.name = "post_area";
  e.hidden = "true";
  e.insertAdjacentElement("beforebegin", post_area);
  return post_area;
 }
 const _extra_fields = (cloned, schema, data) => {
  Object.entries(schema).forEach(([k,]) => {
    const name = "post_area_" + k;
    cloned.insertAdjacentHTML("afterend", '<textarea class="post_areas" name="'+name+'" hidden></textarea>')
    const el = cloned.nextElementSibling
    el.value = data[k] ?? ''
  })
 }
 
 let [post, schema, callback] = args;
 
 // topic view
 const posts = document.querySelectorAll(post);
 const observe = new MutationObserver(function(evt, obs){
  const qe = evt[0].target.querySelector(".editor textarea");
  if(!qe) return _load_post(evt[0].target.querySelector(post), callback);
  if(qe.disabled) return false;
  obs.disconnect();
  const post_area = _clone_area(qe);
  const parsed = _parse_post(qe, post_area);
  _extra_fields(post_area, schema.html, parsed.html)
  post_area.onchange = (evt) => {
   const post = "[[post]]" + evt.target.value + "[[/post]]"
   const json = Object.fromEntries(parsed.meta_data)
   qe.value = "[[mdata]]" + JSON.stringify(json) + "[[/mdata]]" + post + "[[mhtml]]" + Array.from(parsed.html, area => "[["+area.name.split("post_area_")[1]+"]]" + area.value + "[[/"+area.name.split("post_area_")[1]+"]]").join("") + "[[/mhtml]]"
  };
  obs.observe(evt[0].target.closest("[id*='pid_']"), {childList: true, subtree: true});
 });
 posts.forEach(e => {
  _load_post(e, callback);
  // quick edit
  const pid = e.closest("[id*='pid_']");
  if(!pid) return false;
  observe.observe(pid, {childList: true, subtree: true})
 })

 if(!document.REPLIER?.Post) return false
 // posting view
 // need to convert any double quotes into their encoded counterpart &quot; we can convert back after the fact.
 const default_mdata = {
  "forum_id": () => document.REPLIER.f.value,
  "author_id": () => {
   const index = document.REPLIER.post_as.options.selectedIndex;
   if(!document.REPLIER.post_as) { return document.REPLIER.post_as_username.value }
   else if(index===0) { return document.getElementById("logged-in-as").innerText }
   else { return document.REPLIER.post_as.options[index].innerText.split("»")[1].trim(); }
  }
 }
 const normal_schema = {...default_mdata, ...schema.text};
 const post_area = _clone_area(document.REPLIER.Post);
 post_area.disabled = true
 post_area.onchange = (evt) => document.REPLIER.Post.value = evt.target.value;
 const parsed = _parse_post(document.REPLIER.Post, post_area);
 _extra_fields(post_area, schema.html, parsed.html)
 document.REPLIER.addEventListener("submit", (e) => _submit_post(e, normal_schema));
 post_area.disabled = false
 return parsed;
}