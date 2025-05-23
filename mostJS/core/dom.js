import { componentIndexes, componentStates } from "./state.js";
import componentStack from "./componentStack.js";
import { diff } from "./diff.js";
import { applyCallbacksAfterRender } from "./watch.js";
import { refs } from "./useRef.js";


const titleToComponentMap = new Map();


function Create(tag, props, ...children) {
  const processedChildren = children.flat().map((child) => {
    if (typeof child === "string" || typeof child === "number") {
      return {
        type: "text",
        value: child,
        ref: null
      };
    }
    return child;
  });

  return {
    tag,
    props: props || {},
    children: processedChildren,
    ref: null
  };
}

function createElement(node) {
  if (typeof node == "boolean" || node === null || node === undefined) {
    return document.createDocumentFragment();
  }

  if (typeof node === "function") {
    return createElement(node());
  }

  if (node.type === "text") {
    const textNode = document.createTextNode(String(node.value));
    node["ref"] = textNode;
    return textNode;
  }

  const element = document.createElement(node.tag);

  const props = node.props || {};
  const children = node.children || [];

  Object.entries(props).forEach(([name, val]) => {
    if (name === "autofocus" || name === "checked" ) {
      element[`${name}`] = true;
    } else if (name.startsWith("on") && typeof val === "function") {
      element[name.toLowerCase()] = val;
    } else if (name === "className") {
      element.className = val;
    } else if (name === "reference") {
      element.setAttribute("reference", val);
      refs.set(val, element);
    } else if (name === "style" && typeof val === "object") {
      Object.assign(element.style, val);
    } else {
      element.setAttribute(name, val);
    }
  });

  children.forEach((child) => {
    if (typeof child === "function") {
      const childNode = child();
      element.appendChild(createElement(childNode));
    } else {
      element.appendChild(createElement(child));
    }
  });

  node["ref"] = element;
  return element;
}

function render(componentTitle, componentFn, props = {}) {
  componentStack.push(componentTitle);

  let rootElement = document.getElementById("root");
  componentStates.clear();
  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
  } else {

    rootElement.innerHTML = "";

  }


  if (!componentStates.has(componentTitle)) {
    componentStates.set(componentTitle, { states: [], vdom: null });
  }


  titleToComponentMap.set(componentTitle, componentFn);


  componentIndexes.set(componentTitle, 0);


  const vdom = componentFn(props);
  const element = createElement(vdom);
  vdom.ref = element;


  const componentState = componentStates.get(componentTitle);
  componentState.vdom = vdom;
  componentStates.set(componentTitle, componentState);
  componentStack.pop();


  rootElement.appendChild(element);
  return element;
}


function rerender(componentTitle) {
  const componentFn = titleToComponentMap.get(componentTitle);
  if (!componentFn) {
    console.error(`Component function not found for ${componentTitle}`);
    return;
  }


  componentIndexes.set(componentTitle, 0);


  const componentState = componentStates.get(componentTitle);
  if (!componentState) {
    console.error(`Component state not found for ${componentTitle}`);
    return;
  }


  const oldVdom = componentState.vdom;
  if (!oldVdom) {
    console.error(`Invalid vdom for component ${componentTitle}`);
    return;
  }


  componentStack.push(componentTitle);
  const vdom = componentFn();




  diff(oldVdom, vdom);
  componentState.vdom = vdom;


  applyCallbacksAfterRender();


  componentStack.pop();
}


function Component(componentFn, props, title) {
  if (!title) {
    console.error("Component must have a title");
    return null;
  }


  titleToComponentMap.set(title, () => componentFn(props));


  componentIndexes.set(title, 0);


  if (!componentStates.has(title)) {
    componentStates.set(title, { states: [], vdom: null });
  }


  componentStack.push(title);

  try {

    const vdom = componentFn(props);


    componentStates.get(title).vdom = vdom;


    vdom.componentTitle = title;

    return vdom;
  } catch (error) {
    console.error(`Error rendering component ${title}:`, error);
    return null;
  } finally {

    componentStack.pop();
  }
}



export { Create, render, createElement, rerender, Component };
