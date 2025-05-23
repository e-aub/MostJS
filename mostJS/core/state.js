// Fixed state.js
import { rerender } from "./dom.js";
import { shallowEqualObjects, areDepsEqual, isPlainObject } from "./watch.js";
import componentStack from "./componentStack.js";

const componentStates = new Map();
const componentIndexes = new Map();

function useState(initial) {
  const component = componentStack.current;
  
  if (!component) {
    console.error("useState called outside component context");
    return [initial, () => {}];
  }
  
  if (!componentStates.has(component)) {
    componentStates.set(component, { states: [], vdom: null });
  }

  const componentState = componentStates.get(component);
  const states = componentState.states;
  const idx = componentIndexes.get(component) || 0;

 
  if (states[idx] === undefined) {
    states[idx] = typeof initial === "function" ? initial() : initial;
  }

  const localIndex = idx;
  const componentTitle = component;

  const setState = (value) => {
    const targetComponentState = componentStates.get(componentTitle);
    if (!targetComponentState) {
      console.error(`Component state not found for ${componentTitle}`);
      return;
    }
    
    const oldValue = targetComponentState.states[localIndex];
    const newValue = typeof value === "function" ? value(oldValue) : value;
    let shouldRerender = false;
    
   
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      if (oldValue.length !== newValue.length) {
        targetComponentState.states[localIndex] = newValue;
        shouldRerender = true;
      }
      if (!areDepsEqual(newValue, oldValue)) {
        targetComponentState.states[localIndex] = newValue;
        shouldRerender = true;
      }
    }else if (isPlainObject(oldValue) && isPlainObject(newValue)) {
      if (!shallowEqualObjects(newValue, oldValue)) {
        targetComponentState.states[localIndex] = newValue;
        shouldRerender = true;
      }
    }else if (oldValue !== newValue) {
      targetComponentState.states[localIndex] = newValue;
      shouldRerender = true;
    }
    
    if (shouldRerender) {
      requestAnimationFrame(() => {
        rerender(componentTitle);
      }, 0);
    }
  };

  componentIndexes.set(component, idx + 1);
  return [states[localIndex], setState];
}

export { useState, componentStates, componentIndexes };