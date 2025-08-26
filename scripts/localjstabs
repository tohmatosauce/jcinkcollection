function bc_localjstabs(args) {
 
 let defaults = {toggle:'',carousel:'',divyChar: '-'};
 let params = {...defaults, ...args}; // right-most object overwrites 

 let stylingClass = params.outerName.substr(1) + "_active", // styling shit equipped to it.
     tabIdName = params.outerName.substr(1) + "_tab", // common identifer prefix name for tab
     contIdName = params.outerName.substr(1) + "_container", // common identifer prefix name for container
     divyChar = params.divyChar;

   //https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another?rq=1
  function array_move(arr, old_index, new_index) {
     while (old_index < 0) {
         old_index += arr.length;
     }
     while (new_index < 0) {
         new_index += arr.length;
     }
     if (new_index >= arr.length) {
         var k = new_index - arr.length + 1;
         while (k--) {
             arr.push(undefined);
         }
     }
     arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
     return arr; // for testing purposes
  };

 // this garbo's single purpose is to add unique identifier names and it's kind of the core of the script but i've lowkey forgotten how it works so uh whOOPS
 const allOuter = document.querySelectorAll(params.outerName),
       comp = document.querySelector(params.outerName);

  for (let a=0,i=0,j=allOuter.length;a<j;a++) {
   const allTabs = Array.isArray(params.tabClassName) ? params.tabClassName.map(x=>allOuter[a].querySelectorAll(x)) : [allOuter[a].querySelectorAll(params.tabClassName)],
         allCont = Array.isArray(params.contClassName) ? params.contClassName.map(x=>allOuter[a].querySelectorAll(x)) : [allOuter[a].querySelectorAll(params.contClassName)];

   for (const o of allTabs) {
    for (const [k,v] of Object.entries(o)) {
     const addName = tabIdName + divyChar + (parseInt(k)+1);
     v.classList.add(addName);

     if (comp.removeEventListener) {
      v.addEventListener("click",localT4_tabclick);
     } else if (comp.detachEvent) {
      v.attachEvent("onclick",localT4_tabclick);
     }

     if(params.toggle=='true'){
      i++;
      for(let r=j-i,d=0;d<r;d++){
       if (comp.removeEventListener) {
        v.removeEventListener("click",localT4_tabclick);
       } else if (comp.detachEvent) {
        v.detachEvent("onclick", localT4_tabclick);
       }
      }
     }
    }
   }
   for (const o of allCont) {
    for (const [k,v] of Object.entries(o)) {
     const addName = contIdName + divyChar + (parseInt(k)+1);
     v.classList.add(addName);
    }
   }
 };
 // garbo naming over lol

 function localT4_tabclick() {
  const $this = this,
        wrapper = $this.closest(params.outerName), // get closest #params.outerName from the element u clicked
        ele = $this.className, // get the clicked element's class
        hash = ele.lastIndexOf(divyChar); // find the last var of the divyChar contained and get its index position
   let id = ele.slice(hash + 1).replace(/\s/g, ''); // from this index pos add +1 so it slices off it and everything before it

  if(id.includes(stylingClass)){
   const e=id, t=e.indexOf(stylingClass);
   id=e.substring(0,t);
  }

  if(wrapper.getAttribute('t4active')!=id){
   wrapper.setAttribute("t4active", id);
  }

  const id0=parseInt(id)-1,
        id1=parseInt(id)+1;

  const allCont = wrapper.querySelectorAll(params.contClassName), // get all containers
        allTab = wrapper.querySelectorAll(params.tabClassName); // get all tabs

  let norm = 1;

  if(params.toggle) {
   norm = 0;
   for(var i=0; i<allCont.length; i++){
    if(allCont[i].className.includes(contIdName+divyChar+id)){
     allCont[i].classList.toggle(stylingClass);
    }
   }
   for(var i=0; i<allTab.length; i++){
    if (allTab[i].className.includes(tabIdName+divyChar+id)){
     allTab[i].classList.toggle(stylingClass);
    }
   }
  }

  if(norm==1){
   // allCont = however many containers exist. so this cycles through every container and applies shit.
   for(var i=0;i<allCont.length;i++) {
   if(allCont[i].className.includes(contIdName+divyChar+id)){
    allCont[i].classList.add(stylingClass);
   } else{
    allCont[i].classList.remove(stylingClass);
   }
  }
  // allTab = however many tabs exist. so this cycles through every tab and applies shit.
   for(var i=0;i<allTab.length;i++) {  
    if (allTab[i].className.includes(tabIdName+divyChar+id)){
     allTab[i].classList.add(stylingClass);
    } else {
    allTab[i].classList.remove(stylingClass);
    }
   }
  }
 
 };
}
