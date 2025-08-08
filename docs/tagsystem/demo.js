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
triggers: list of selectors that will trigger the script to identify elements with tags in them.
selector: a css selector
use_topic_title: insert tag shorthands in topic title or topic description, depending on whether you're already using fizzyelf's bracket tags script
callback: function that takes two arguments for the element triggered and the list of tags found.
*/
const forum_settings = {
 triggers: [
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
 ],
 use_topic_title: false
};

bc_tag_system(options, forum_settings);