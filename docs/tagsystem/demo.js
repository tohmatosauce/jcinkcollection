/*
menu: name of the tag menu.
forum: array of valid forum ids that this menu will show for.
values: is a list of the tags. the tag field is added to the description of a topic. it should ideally be as few characters as possible (don't want john to murder us). !! DO NOT CHANGE IT AFTER INSTALLATION it will cause you trouble !!
type: radio or checkbox.
*/
const options = [
 {
  menu: "location",
  forum: [1],
  tags: {
   "a1": "location 1",
   "a2": "location 2",
   "a3": "location 3"
  },
  type: "radio"
 },
 {
  menu: "factions",
  forum: [1],
  tags: {
   "b1": "faction a",
   "b2": "faction b",
   "b3": "faction c",
   "b4": "faction d"
  },
  type: "checkbox"
 },
 {
  menu: "thread type",
  forum: [1],
  tags: {
   "b1": "open",
   "b2": "private",
   "b3": "quest",
   "b4": "event"
  },
  type: "checkbox"
 }
];
/*
description: list of selectors that will trigger the script to identify topic descriptions with tags in them.
selector: a css selector
callback: function that takes two arguments for the description element triggered and the list of tags found.
*/
const forum_settings = {
 description: [
  { 
   selector: ".forum-row .desc", 
   callback: (el, tags) => {
    console.log(el, tags)
   }
  },
  {
   selector: ".topic-row .desc", 
   callback: (el, tags) => {
    console.log(el, tags)
   }
  }
  
 ]
};

bc_tag_system(options, forum_settings);