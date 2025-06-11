function tagSystem(args) {
  const [options, forum_settings] = args;

  const _add_menu = (options) => {
    const post_opt = document.getElementById("post-options");
    const container = document.createElement("tr");
    post_opt.after(container);
    container.id = "post-tag-options";
    container.innerHTML = "<td class='pformleft'>Post Tags</td><td class='pformright'></td>";
    const tags_preview = document.createElement("div");
    tags_preview.id = "tags_preview";
    const tags_container = new DocumentFragment();
    const tag_inputs = new DocumentFragment();
    const menu_inputs = document.createElement("select");
    menu_inputs.id = "tag_menus";
    menu_inputs.name = "tag_menus"
    menu_inputs.innerHTML = "<option value='---'>---</option>";
    menu_inputs.addEventListener("change", () => {
      const parent = menu_inputs.parentElement;
      parent.setAttribute("selected-menu", menu_inputs.value);
      const hideElements = parent.querySelectorAll(".tag_container");
      const showElements = parent.querySelector("#" + menu_inputs.value);
      hideElements.forEach(e => e.setAttribute("data-visible", "false"));
      showElements?.setAttribute("data-visible", "true");
    });

    for (const m of options) {
      const posting_forum_id = parseInt(document.REPLIER.f?.value);
      if (m.forum.indexOf(posting_forum_id) === -1) continue;
      //menu select 
      const menu_id = m.menu.trim().replaceAll(" ", "_");
      const menu_selector = document.createElement("option");
      const tag_container = document.createElement("div");
      menu_inputs.append(menu_selector);
      menu_selector.value = menu_id;
      menu_selector.innerHTML = m.menu;
      tag_inputs.append(tag_container);
      tag_container.classList.add("tag_container");
      tag_container.id = menu_id;

      //tag options (in a different div)
      Object.entries(m.tags).forEach(([k, v]) => {
        const input = document.createElement("input");
        const label = document.createElement("label");
        const id = menu_id + "_" + k.trim().replaceAll(" ", "_");
        input.classList.add("tag_options");
        input.id = id;
        input.value = k;
        input.setAttribute("name", menu_id);
        input.setAttribute("type", m.type);
        label.innerHTML = v;
        label.setAttribute("for", id);
        tag_container.append(input, label);
        input.addEventListener("click", function ($this) {
          const parent = $this.target.closest(".pformright");
          const allChecked = parent.querySelectorAll("input:checked");
          tags_preview.innerHTML = Array.from(allChecked, e => {
            const id = e.id,
              label = parent.querySelector("label[for='" + id + "']"),
              menu = e.parentElement.id;
            return "<tag class='" + menu + "' id='tag_preview_" + id + "'>" + label.innerHTML + "</tag>";
          }).join("");
          tags_preview.querySelectorAll("tag").forEach(e => e.addEventListener("click", function (evt) {
            const tag = evt.target;
            const _input = parent.querySelector("input#" + tag.id.split("tag_preview_")[1]);
            _input.checked = false;
            tag.remove();
          }))
        })
      });
    }

    tags_container.append(menu_inputs, tag_inputs);
    container.querySelector(".pformright").append(tags_preview, tags_container)
  }

  const _load_menu = (options) => {
    const description = document.REPLIER.TopicDesc;
    const split_desc = description.value.split("$");
    const tags = split_desc.slice(1, -1);
    description.value = split_desc[split_desc.length - 1];
    if (tags.length > 0) {
      for (const tag of tags) {
        const input = document.querySelector("#post-tag-options .tag_options[value='" + tag + "']");
        input.checked = true;
      }
      const menu_value = document.querySelector("#post-tag-options .tag_options:checked").getAttribute("name");
      const menu = document.REPLIER.tag_menus;
      menu.value = menu_value;
      menu.setAttribute("selected-menu", menu_value);
      document.querySelector("#post-tag-options #" + menu_value).setAttribute("data-visible", "true")
    }
  }

  const _tag_submit = (e, options, forum_settings) => {
    let validate = false;
    try {
      validate = ValidateForm();
    } catch {
      validate = true;
    }
    // const validate = true;
    if (e.submitter.name !== "preview" && document.REPLIER.TopicTitle.value.length >= 2 && validate) {
      const checked_inputs = Array.from(document.querySelectorAll(".tag_container :checked"), e => e.value);
      if (checked_inputs.length > 0) {
        const desc = document.REPLIER.TopicDesc,
          post = document.REPLIER.Post;
        const new_desc = checked_inputs.reduce((acc, curr) => "$" + curr + acc, '$');
        const new_post = "<div class='tags' style='display: none'>" + checked_inputs.join(" ") + "</div>"
        desc.value = new_desc + desc.value;
        // forum_settings.post_snippet = forum_settings.post_snippet || new_post;
        // post.value = "[dohtml]"+forum_settings.post_snippet(checked_inputs)+"[/dohtml]" + post.value;
      }
    }
    return validate;
  }

  const _tag_load = (options, description) => {
    const split_desc = description.innerHTML.split("$");
    const tags = split_desc.slice(1, -1);
    description.innerHTML = split_desc[split_desc.length - 1];
    const map = new Map(Array.from(options, e => Object.entries(e.tags)));
    const maps = Array.from(options, e => [e.menu, map]);
    const tags_arr = tags.map(tag => {
      return {
        id: tag,
        label: map.get(tag),
        menu: maps.filter((m) => m[1].has(tag))[0][0]
      }
    })
    return tags_arr.length > 0 ? tags_arr : false;
  }

  if (document.REPLIER.TopicDesc) {
    _add_menu(options, forum_settings);
    _load_menu(options, forum_settings);
    document.REPLIER.addEventListener("submit", (e) => _tag_submit(e, options, forum_settings));
  } else {
    for (const entry of forum_settings.description) {
      document.querySelectorAll(entry.selector).forEach(el => {
        const tags = _tag_load(options, el);
        if (tags.length > 0 && entry.callback) entry.callback(el, tags);
      });
    };
  }
}