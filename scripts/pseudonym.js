function jcinkPseudonym(args){
 const defaults={commonclass:'.pseudo', pseudPrefix:'', profilePrefix:'profile_'}
 const param = {...defaults,...args}
 
 const posts = param.wrapper;
 const suffix = param.suffix,
       profilePrefix = param.profilePrefix,
       pseudPrefix = param.pseudPrefix;
 
 try {
  document.querySelectorAll(posts).forEach(post => {
   const prop_tree = (obj, path = [], result = []) => {
    if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
     Object.keys(obj).forEach(child => {
      prop_tree(obj[child], [...path, child], result)
     })
    } else if(Array.isArray(obj)) { 
     result.push({ fields: obj, tree: path });
    } else { 
     throw new Error(["suffix", ...path].join(".") +" is not of type array.\n(Tip. Fields must be listed in an array, even if there is only one entry.)") 
    }
    return result;
   };
   const get_obj = (el, tree) => {
    const _tree = [...tree],
          prop = _tree.shift()
    if (_tree.length <= 0) { return el }
    else if (_tree.slice(1).length <= 0) { return el[prop] }
    get_obj(el[prop], _tree)
   };
   prop_tree(suffix).forEach(({fields, tree}) => {
    fields.forEach(field => {
     const pseud = post.querySelector("." + pseudPrefix + field);
     const profiles = post.querySelectorAll("." + profilePrefix + field);
     profiles.forEach(profile => {
      if(!pseud) return false;
      const obj = get_obj(profile, tree),
            replace = pseud.innerHTML
      if(obj===profile) { profile[tree.slice(-1)[0]] = replace }
      else { Object.defineProperty(obj, tree.slice(-1)[0], {value: replace, configurable: true}) }
      console.log(obj, tree.slice(-1)[0], pseud.innerHTML)
     })
    })
   })
  })
 } catch(e) {
  console.error("[Pseudonym]: " + e.message)
 }
}

export { jcinkPseudonym as default }