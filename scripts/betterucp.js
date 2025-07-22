function bc_better_ucp(args) {
  if (!document.querySelector('input[name="CODE"][value="21"]')) return false;

  const validate_field_table = (table) => {
    const flattened = flatten_mixed_array(table);
    const flattened_ids = flattened.filter(e => Number.isInteger(e));
    return new Set(flattened_ids).size !== flattened_ids.length;
  }

  // Convert stringified variables embedded in the HTML templates into useable variables. Requires the field ID & associated template.
  const parse_template = (id, template) => {
    const forminput = document.querySelector("#ucpcontent .forminput[name='field_" + id + "']");
    const key_val = forminput ?
      {
        label: forminput.closest("tr").querySelector("label").innerHTML,
        description: Array.from(forminput.closest("tr").getElementsByTagName("td")[0].childNodes)[4]?.textContent.trim() ?? "",
        input: forminput.closest("td").innerHTML,
        id: id
      } :
      {
        day: '<select name="day" class="forminput">' + document.querySelector("select[name='day']").innerHTML + '</select>',
        month: '<select name="month" class="forminput">' + document.querySelector("select[name='month']").innerHTML + '</select>',
        year: '<select name="year" class="forminput">' + document.querySelector("select[name='year']").innerHTML + '</select>',
        website: document.querySelector("input[name='WebSite']").parentNode.innerHTML,
        location: document.querySelector("input[name='Location']").parentNode.innerHTML,
        interests: document.querySelector("textarea[name='Interests']").parentNode.innerHTML,
        submit: document.querySelector("#ucpcontent form .forminput[type='submit']").closest("td").innerHTML
      }
    const template_content = Array.from(document.querySelector(template).content.childNodes).reduce((acc, curr) => acc += curr.outerHTML || curr.nodeValue || "", "");
    const template_content_replaced = template_content.replaceAll(/(\$\{)(.*?)(\})/g, (m, _, p2) => key_val[p2]);
    return template_content_replaced;
  }

  // Take an array that contains mixed data, such as arrays, JS objects, text, etc., and flatten it.
  // ! Does not preserve nesting order.
  const flatten_mixed_array = (obj) => {
    const result = [];
    if (typeof obj !== "object") result.push(obj);
    else {
      for (const k in obj) {
        if (!Array.isArray(obj)) result.push(...flatten_mixed_array(k));
        result.push(...flatten_mixed_array(obj[k]));
      }
    }
    return result;
  }
  // Takes an object and flattens it. Does preserve nesting order.
  // https://www.tutorialspoint.com/flattening-a-json-object-in-javascript
  const flatten_object = (obj, res = {}, extraKey = '') => {
    for (key in obj) {
      if (typeof obj[key] !== 'object') {
        const newKey = !Array.isArray(obj) ? key : '';
        const attr_made = Object.hasOwn(res, extraKey.trim() + newKey);
        attr_made ? res[extraKey.trim() + newKey].push(obj[key]) : res[extraKey.trim() + newKey] = [obj[key]];
      } else {
        const newKey = !Array.isArray(obj) ? key : key;
        flatten_object(obj[key], res, extraKey + newKey + " ");
      };
    };
    return res;
  };

  const translate_group = (name, t) => {
    const result = t.get(name);
    if (!result) throw new Error(`Cannot find definition for field group: %${name}`);
    return result;
  }

  // Transpose the field templates list so that it is organised field number first.
  const get_transposed_fields = (transposed, default_field, template_class) => {
    const _field_templates = new Map([[0, default_field]]);
    for (const [k, v] of Object.entries(transposed)) {
      v.forEach(i => _field_templates.set(i, k + "." + template_class));
    }
    return _field_templates;
  }

  const get_field_templates = (table, id) => {
    const template = table.get(id) || table.get(0);
    const html_template = new DOMParser().parseFromString(parse_template(id, template), 'text/html')
    return html_template.getRootNode().body.childNodes
  }

  // for a cleaner main()... just indexes the UCP for the full field list, as well as required and optional fields.
  const get_field_list = () => {
    const get_field_id = (f) => Array.from(f).map(e => parseInt(e.getAttribute('name').slice(6)));
    const field_list = get_field_id(document.querySelectorAll('#ucpcontent form .forminput[name^=field]')),
      required_fields = get_field_id(document.querySelectorAll('#ucpcontent form table')[0].querySelectorAll('.forminput[name^=field]')),
      optional_fields = get_field_id(document.querySelectorAll('#ucpcontent form table')[1].querySelectorAll('.forminput[name^=field]'));
    return { field_list, required_fields, optional_fields };
  }

  // Takes an object or array, finds any referenced field group variables, and converts them into field indexes.
  const get_grouped_fields = (obj, table) => {
    let result = obj;
    if (typeof obj === "object") {
      for (const k in obj) {
        const to_insert = get_grouped_fields(obj[k], table);
        if (Array.isArray(obj) && Array.isArray(to_insert)) {
          const index = obj.indexOf(obj[k]);
          obj.splice(index, 1, ...to_insert);
        } else {
          obj[k] = to_insert;
        }
      }
    }
    else if (!Number.isInteger(obj) && Array.from(obj.trim())[0] == "%") {
      const group_name = obj.trim().slice(1).trim();
      const translation = translate_group(group_name, table);
      result = translation;
    }
    return result;
  }

  const get_level_map = (curr_node, depth = 0, map = new Array()) => {
    if (curr_node !== null) {
      map[depth] === undefined ?
        map[depth] = [curr_node] :
        map[depth] = [...map[depth], curr_node];
      for (const node of curr_node.children) get_level_map(node, depth + 1, map);
    }
    return map;
  }

  const ucpform = document.querySelector("#ucpcontent form"),
    { field_list, required_fields, optional_fields } = get_field_list(),
    wrapper_name = args.wrapper_name || "betterdiv",
    template_class = args.template_class || "better_ucp_templates",
    inner_structure = args.template_inner_structure || "#inner_structure",
    default_field = args.template_default_field || "#default_field",
    field_groups = new Map(Object.entries({ ...args.field_groups, required: required_fields, optional: optional_fields })) || new Map(Object.entries({ required: required_fields, optional: optional_fields })),
    field_order = get_grouped_fields(args.field_order, field_groups) || [],
    flattened_order = flatten_mixed_array(field_order),
    field_templates_transposed = get_grouped_fields(args.field_templates, field_groups) || {},
    field_templates = get_transposed_fields(field_templates_transposed, default_field, template_class);

  // Throw error if there are duplicate field IDs listed in field_order or field_templates
  const validate = {
    templates: validate_field_table(field_templates_transposed),
    order: validate_field_table(field_order)
  }
  if (validate.templates || validate.order) {
    throw new Error(`Duplicate field IDs listed in field_templates or field_order.`);
  }

  // Create wrapper
  const doc = document.createElement('body');
  const wrapper = document.createElement('div');
  wrapper.id = wrapper_name;
  wrapper.innerHTML += '<input type="hidden" name="act" value="UserCP"><input type="hidden" name="CODE" value="21">';
  doc.append(wrapper);

  // Fill the inner structure
  const inner_structure_translated = parse_template('', inner_structure + "." + template_class);
  const inner_structure_parsed = new DOMParser().parseFromString(inner_structure_translated, "text/html")
  const inner_structure_body = inner_structure_parsed.getRootNode().body;
  wrapper.append(...inner_structure_body.childNodes);
  const objected_order = { ["#" + wrapper_name]: field_order };
  const order = Object.entries(flatten_object(objected_order)).map(([k, v]) => [k.split(" ").filter((str,) => Number.isNaN(parseInt(str)) ).join(" "), v]);
 
  // Track nodes used
  const visited_nodes = [];
  for (const [selector, fields] of order) {
    let parent = null;
    for (const id of fields) {
      const parent_possibilities = doc.querySelectorAll(selector);
      for (const p of parent_possibilities)
        if (visited_nodes.indexOf(p) === -1) parent = p;
      if (!parent) throw new Error(`${selector} doesn't exist in your given inner structure. Accidental duplicate selectors listed in field_order is likely the culprit.`);
      parent.append(...get_field_templates(field_templates, id));
    }
    visited_nodes.push(parent)
  }
  // Dump all default variables that aren't included in the field order, so we need a way to compare field order list versus field list.
  const get_shallowest_node = (list) => {
    const level_structure_map = get_level_map(wrapper).slice(1);
    for (const floor of level_structure_map) {
      const floor_census = floor.filter(door => {
        for (const el of list) {
          if(el === door || door.contains(el)) return door; 
        }
        
      });
      if (floor_census.length > 0) return floor_census.pop()
    }
    return false;
  }
  const shallowest_node = get_shallowest_node(visited_nodes);
  const undeclared_fields = field_list.filter(f => flattened_order.indexOf(f) < 0);
  const dump_remaining = shallowest_node || wrapper.lastChild;
  for (const id of undeclared_fields.reverse()) {
    dump_remaining.after(...get_field_templates(field_templates, id));
  }
  // Add wrapper to document
  while (ucpform.firstChild) ucpform.removeChild(ucpform.firstChild);
  ucpform.appendChild(wrapper);
};