function bc_post_framework(...args){
 const _parse_post = (e, repl=e) => {
    if(!e.innerHTML.trim()) {
      return {
        post: '', html: {}, mdata: {}
      }
    }
   const m = {
     "meta_begin": e.innerHTML.match(/\[\[mdata\]\]/im),
     "meta_end": e.innerHTML.match(/\[\[\/mdata\]\]/im),
     "post_begin": e.innerHTML.match(/\[\[mpost\]\]/im),
     "post_end": e.innerHTML.match(/\[\[\/mpost\]\]/im),
     "html_begin": e.innerHTML.match(/\[\[mhtml\]\]/im),
     "html_end": e.innerHTML.match(/\[\[\/mhtml\]\]/im)
   }
   
   const mdata = (m.meta_begin && m.meta_end) ? e.innerHTML.slice(m.meta_begin.index + m.meta_begin[0].length, m.meta_end.index) : false
   const post = (m.post_begin && m.post_end) ? e.innerHTML.slice(m.post_begin.index + m.post_begin[0].length, m.post_end.index) : false
   const html = (m.html_begin && m.html_end) ? e.innerHTML.slice(m.html_begin.index + m.html_begin[0].length, m.html_end.index) : false
   const html_finder = html ? [...html.matchAll(/\[\[(.*?)]](.*?)\[\[\/.*?]]/gim)] : ''

    const desanitize = (obj, key, prev) => {
      if(typeof obj === 'string' || obj instanceof String) {
        prev[key] = obj.replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&amp;","&")
        return;
      } else if(typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([k,v]) => desanitize(v, k, obj))
      }
      return obj
    }
   
   const json = {
     	post: post ? post : e.innerHTML,
	    html: html ? Object.fromEntries(html_finder.map(f => [f[1], f[2]])) : false,
	    meta_data: mdata ? desanitize( JSON.parse(mdata) ) : false
   }
   
   repl.innerHTML = json["post"]
   
   return (!mdata && !post && !html) ? false : json
 }
 const _load_post = (e, callback) => {
  if(!e) return false;
  const metadata = _parse_post(e);
  callback(e, metadata);
  return metadata;
 }
 const _submit_post = (evt, schema) => {
  document.REPLIER.Post.value = document.REPLIER.post_area.value;
  let validate = false;
  try { validate = ValidateForm(); } 
  catch { validate = true; }
  if((!document.REPLIER.TopicTitle || document.REPLIER.TopicTitle.value.length >= 2) && validate) {    
   evt.preventDefault(); 
   const data = Object.entries(schema).map(([k,v])=> {
    try {
     const name = k, value = v();
     return [name, value]
    } catch {
     return []
    }
   }).filter(arr => arr.length > 0);

    let sanity = true;
    const sanitize = (obj = Object.fromEntries(data)) => {
      if(typeof obj === 'string' || obj instanceof String) {
        const bb = obj.match(/\[.*?].*?\[\/.*?]/m);
        if(bb !== null) {
          alert("Warning: BBcode is dangerous to use when parsing JSON! Please don't use it. Use HTML instead.");
        	sanity = false;
        }
      } else if(typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(v => sanitize(v))
      }
    }
    sanitize()
   const post = "[[mpost]]" + document.REPLIER.post_area.value + "[[/mpost]]"
   const json = Object.fromEntries(data);
   document.REPLIER.Post.value = "[[mdata]]" + JSON.stringify(json) + "[[/mdata]]" + post + "[[mhtml]]" + Array.from(document.querySelectorAll(".post_areas"), area => "[["+area.name.split("post_area_")[1]+"]]" + area.value + "[[/"+area.name.split("post_area_")[1]+"]]").join("") + "[[/mhtml]]"
    if(sanity) {
      if(evt.submitter.name==="preview") document.REPLIER.insertAdjacentHTML('beforeend','<input style="display:none" type="text" name="preview" value="Preview Post"/>')
      HTMLFormElement.prototype.submit.call(evt.target)
    } else {
      evt.submitter.disabled = false
    }
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
    cloned.insertAdjacentHTML("afterend", "<textarea class='post_areas' name='" + name + "'hidden></textarea>")
    const el = cloned.nextElementSibling
    el.value = data ? data[k] ?? '' : ''
  })
 }
 
 let [post, schema, callback] = args;
  
 // topic view
 const posts = document.querySelectorAll(post);
 posts.forEach(e => {
  e.setAttribute("data-visible", "false")
  _load_post(e, callback);
  // quick edit
  const pid = e.closest("[id*='pid_']");
  if(!pid) {
    e.setAttribute("data-visible", "true")
    return false;
  }
  const observe = new MutationObserver(function(evt, obs){
    const qe = evt[0].target.querySelector(".editor textarea");
    if(!qe) {
      _load_post(evt[0].target.querySelector(post), callback);
      evt[0].target.querySelector(post)?.setAttribute("data-visible", "true");
      return
    }
    if(qe.disabled) return false;
    obs.disconnect();
    document.querySelectorAll(".quick-edit .right-buttons input")[0].setAttribute("onclick", "if(this.form.post_area)this.form.post_area.style.height=parseInt(this.form.post_area.style.height)+100+'px'")
    document.querySelectorAll(".quick-edit .right-buttons input")[1].setAttribute("onclick", "if(this.form.post_area)this.form.post_area.style.height=parseInt(this.form.post_area.style.height)-100+'px'")
    const post_area = _clone_area(qe);
    const parsed = _parse_post(qe, post_area);
    _extra_fields(post_area, schema.html, parsed.html)
    
    post_area.onchange = (evt) => {
      const post = "[[mpost]]" + evt.target.value + "[[/mpost]]"
      const json = parsed.meta_data
      const html = Object.entries(parsed.html).map(([area, value]) => "[["+area+"]]" + value + "[[/"+area+"]]").join("")
      qe.value = "[[mdata]]" + JSON.stringify(json) + "[[/mdata]]" + post + "[[mhtml]]" + html + "[[/mhtml]]"
    };
    obs.observe(evt[0].target.closest("[id*='pid_']"), {childList: true, subtree: true});
  });
  observe.observe(pid, {childList: true, subtree: true})
  e.setAttribute("data-visible", "true")
 })

 if(!document.REPLIER?.Post) return false
 // posting view
 // need to convert any double quotes into their encoded counterpart " we can convert back after the fact.
  document.REPLIER.setAttribute("onsubmit", "")
 const default_mdata = {
  "forum_id": () => document.REPLIER.f.value,
  "author_name": () => {
    if(!document.REPLIER?.post_as && !document.REPLIER?.post_as_username) return document.getElementById("logged-in-as").innerText;
     const index = document.REPLIER.post_as.options.selectedIndex;
     if(!document.REPLIER.post_as) { return document.REPLIER.post_as_username.value }
     else if(index===0) { return document.getElementById("logged-in-as").innerText }
     else { return document.REPLIER.post_as.options[index].innerText.split("»")[1].trim(); }
  },
  "author_id": () => {
    if(!document.REPLIER?.post_as && !document.REPLIER?.post_as_username) return document.getElementById("logged-in-as").href.split("=")[1];
     const index = document.REPLIER.post_as.options.selectedIndex;
     if(!document.REPLIER.post_as) { return -1 }
     else if(index===0) { return document.getElementById("logged-in-as").href.split("=")[1] }
     else { return index }
  }
 }
 const normal_schema = {...default_mdata, ...schema.text};
 const post_area = _clone_area(document.REPLIER.Post);
 post_area.setAttribute("data-visible", "false")
 post_area.disabled = true
 // post_area.onchange = (evt) => document.REPLIER.Post.value = evt.target.value;
 const parsed = _parse_post(document.REPLIER.Post, post_area);
 _extra_fields(post_area, schema.html, parsed.html)
 document.REPLIER.addEventListener("submit", (e) => _submit_post(e, normal_schema));
 post_area.setAttribute("data-visible", "true")
 post_area.disabled = false
 return parsed;
}