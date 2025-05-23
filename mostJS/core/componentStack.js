
class ComponentStack {
  constructor() {
    this.stack = [];
  }

  push(component) {
    this.stack.push(component);
  }

  pop() {
    this.stack.pop();
  }

  get current() {
    return this.stack[this.stack.length - 1] || null;
  }
}

const componentStack = new ComponentStack();

export default componentStack;