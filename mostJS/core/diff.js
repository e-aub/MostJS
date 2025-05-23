import { createElement } from "./dom.js";
import { componentStates } from "./state.js";
import componentStack from "./componentStack.js";

function diff(oldVNode, newVNode) {
  if (!oldVNode || !newVNode) return;
  if (!oldVNode.ref) {
    console.error("Missing ref in oldVNode:", oldVNode);
    return;
  }
  const parentEl = oldVNode.ref
  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];

  let currentDomIndex = 0;
  const matchedOld = new Set();

  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (!newChild) return
    let matchIndex = -1;
    if (newChild?.props?.key != null) {
      for (let j = 0; j < oldChildren.length; j++) {
        if (matchedOld.has(j)) continue;

        const oldChild = oldChildren[j];
        if (oldChild.props?.key === newChild.props.key) {
          matchIndex = j;
          break;
        }
      }
    }

    if (matchIndex === -1) {
      for (let j = 0; j < oldChildren.length; j++) {
        if (matchedOld.has(j)) continue;

        const oldChild = oldChildren[j];
        const isMatch =
          (newChild.tag && oldChild.tag && newChild.tag === oldChild.tag) ||
          (newChild.type === "text" && oldChild.type === "text");

        if (isMatch) {
          matchIndex = j;
          break;
        }
      }
    }

    if (matchIndex !== -1) {
      const oldChild = oldChildren[matchIndex];
      patchElement(oldChild, newChild);
      if (newChild.tag || newChild.type) {
        diff(oldChild, newChild);
      }
      matchedOld.add(matchIndex);

      const existing = oldChild.ref;

      // this line causes undefined
      const refAtIndex = parentEl.childNodes[currentDomIndex];
      if (refAtIndex !== existing) {
        parentEl.insertBefore(existing, refAtIndex || null);
      }

      newChild.ref = existing;
    } else {
      if (typeof newChild != "boolean") {
        const newEl = createElement(newChild);
        newChild.ref = newEl;
        const refAtIndex = parentEl.childNodes[currentDomIndex];
        parentEl.insertBefore(newEl, refAtIndex || null);
      }
    }

    currentDomIndex++;
  }

  oldChildren.forEach((oldChild, index) => {
    if (!matchedOld.has(index)) {
      oldChild.ref?.remove();
    }
  });

  newVNode.ref = oldVNode.ref;

  const currentComponent = componentStack.current;
  componentStates.get(currentComponent).vdom = newVNode
}

function patchElement(oldVNode, newVNode) {
  const el = oldVNode.ref;
  newVNode.ref = el;

  if (newVNode.tag === 'input') {
    if (newVNode?.props?.value !== undefined) {
      newVNode.ref.value = newVNode.props.value;
    }
  } else if (newVNode.type === "text") {
    if (newVNode.value !== oldVNode.value) {
      el.nodeValue = newVNode.value;
    }
  }

  const oldProps = oldVNode.props || {};
  const newProps = newVNode.props || {};

  if (newProps.style) {
    if (oldProps.style) {
      Object.keys(oldProps.style).forEach(key => {
        el.style[key] = '';
      });
    }
    Object.assign(el.style, newProps.style);
  } else if (oldProps.style) {
    Object.keys(oldProps.style).forEach(key => {
      el.style[key] = '';
    });
  }

  Object.keys(newProps).forEach((key) => {

    const val = newProps[key];
    const oldVal = oldProps[key];
    if (key === 'style') {
      return;
    }

    if (val !== oldVal) {
      if (key.startsWith("on") && typeof val === "function") {
        el[key.toLowerCase()] = val;
      } else if (key === "className") {
        el.className = val;
      } else {
        if (key === "autofocus") {
          el.autofocus = true;
        } else {
          el.setAttribute(key, val);

        }
      }
    }
  });

  Object.keys(oldProps).forEach((key) => {
    if (key === 'style') return;

    if (!(key in newProps)) {
      if (key.startsWith("on")) {
        el[key.toLowerCase()] = null;
      } else {
        el.removeAttribute(key);
      }
    }
  });
}

export { diff };
