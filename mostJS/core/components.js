import { Create } from "./dom.js";
import router from "./router.js";
export function Button(props = {}, children = []) {
  return Create("button", props, children);
}

export function Div(props = {}, children = []) {
  return Create("div", props, children);
}

export function Ul(props = {}, children = []) {
  return Create("ul", props, children);
}

export function Li(props = {}, children = []) {
  return Create("li", props, children);
}

export function H1(props = {}, children = []) {
  return Create("h1", props, children);
}

export function H2(props = {}, children = []) {
  return Create("h2", props, children);
}

export function H3(props = {}, children = []) {
  return Create("h3", props, children);
}

export function H4(props = {}, children = []) {
  return Create("h4", props, children);
}

export function H5(props = {}, children = []) {
  return Create("h5", props, children);
}

export function H6(props = {}, children = []) {
  return Create("h6", props, children);
}

export function Input(props = {}, children = []) {
  return Create("input", props, children);
}

export function P(props = {}, children = []) {
  return Create("p", props, children);
}

export function Span(props = {}, children = []) {
  return Create("span", props, children);
}

function getOrigin(url) {
  try {
    if (url.startsWith("/") || url.startsWith("#")) {
      return router.origin;
    }
    return new URL(url).origin;
  } catch (e) {
    console.error("Invalid URL");
    return null;
  }
}

export function Link(props = {}, children = [], render = true) {
  if (!props.href) {
    console.error("Link must have a href");
    return null;
  }

  if (getOrigin(props.href) !== router.origin) {
    props.target = "_blank";
  }



  props["onClick"] = (e) => {
    if (e.target.target) {
      if (e.target.target === "_blank") {
        return
      };
    }
    e.preventDefault();
    if (render === false) {
      if (getOrigin(props.href) !== router.origin) {
        console.error(`Link to external domain "${props.href}" is not allowed with render: false`)
        return null;
      }
      router.pushOnly(props.href);
      return
    }
    router.push(props.href);
  }
  return Create("a", props, children);
}

export function Aside(props = {}, children = []) {
  return Create("aside", props, children);
}

export function Header(props = {}, children = []) {
  return Create("header", props, children);
}

export function Hr(props = {}, children = []) {
  return Create("hr", props, children);
}

export function Blockquote(props = {}, children = []) {
  return Create("blockquote", props, children);
}

export function Footer(props = {}, children = []) {
  return Create("footer", props, children);
}

export function Section(props = {}, children = []) {
  return Create("section", props, children);
}

export function Label(props = {}, children = []) {
  return Create("label", props, children);
}

export function Main(props = {}, children = []) {
  return Create("main", props, children);
}
