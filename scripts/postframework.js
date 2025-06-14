function bc_post_framework(...args){
 const _parse_post = (e, repl=e) => {
  try {
   const str = e.innerHTML.trim().replaceAll("\n", "\\n");
   const json = JSON.parse(str);
   repl.innerHTML = json["post"].replaceAll("&amp;quot;",'"');
   return json["meta_data"]
  } catch(e) {
   return false;
  }
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
   const post = document.REPLIER.post_area.value.replaceAll('"', "&quot;");
   const json = {"meta_data": Object.fromEntries(data), "post": post};
   document.REPLIER.Post.value = JSON.stringify(json).replaceAll("\\n", "\n");
  }
 }
 const _clone_area = (e) => {
  const post_area = e.cloneNode(true);
  post_area.name = "post_area";
  e.hidden = "true";
  e.insertAdjacentElement("beforebegin", post_area);
  return post_area;
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
  const metadata = _parse_post(qe, post_area);
  post_area.onchange = (evt) => {
   const post = evt.target.value.replaceAll('"', "&quot;");
   const json = {"meta_data": metadata, "post": post};
   qe.value = JSON.stringify(json);
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

 if(!document.REPLIER.Post) return false
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
 schema = {...default_mdata, ...schema };
 const post_area = _clone_area(document.REPLIER.Post);
 post_area.onchange = (evt) => document.REPLIER.Post.value = evt.target.value;
 _parse_post(document.REPLIER.Post, post_area);
 document.REPLIER.addEventListener("submit", (e) => _submit_post(e, schema));
}