
# MostJS Framework Documentation

## Introduction

MostJS is a lightweight frontend framework that gives you complete control over your code without imposing restrictive patterns. It provides a simple yet powerful approach to building web applications, allowing you to use the framework's utilities while maintaining the freedom to incorporate your preferred JavaScript techniques.

Unlike larger frameworks that dictate how your application should be structured, MostJS provides essential tools for creating reactive web applications while keeping the core API minimal and approachable.

## Table of Contents

1. [Getting Started](#getting-started)
   * [Installation](#installation)
   * [Basic Usage](#basic-usage)
2. [Core Concepts](#core-concepts)
   * [Virtual DOM](#virtual-dom)
   * [Creating Elements](#creating-elements)
   * [Creation Components](#creation-components)
   * [Components](#components)
   * [State Management](#state-management)
   * [Handling References](#handling-references)
   * [Watching for Changes](#watching-for-changes)
   * [Routing](#routing)
   * [Diffing Algorithm](#diffing-algorithm)
   * [Rendering](#rendering)
3. [API Reference](#api-reference)
   * [Core Functions](#core-functions)
   * [Creation Components](#creation-components-1)
   * [Router API](#router-api)
4. [Examples](#examples)
   * [Counter Application](#counter-application)
   * [Theme Switcher with useRef and Watch](#theme-switcher-with-useref-and-watch)
   * [Todo List Application](#todo-list-application)
   * [SPA with Routing](#spa-with-routing)
5. [Under the Hood](#under-the-hood)
   * [Component Architecture](#component-architecture)
   * [State Management Implementation](#state-management-implementation)
   * [Component Lifecycle](#component-lifecycle)
   * [Diffing Algorithm Details](#diffing-algorithm-details)
6. [Best Practices](#best-practices)
   * [Component Organization](#component-organization)
   * [Performance Optimization](#performance-optimization)
   * [State Management Patterns](#state-management-patterns)
   * [Error Handling](#error-handling)

## Getting Started

### Installation

You can install MostJS via npm:

```bash
# Using npm
npm i @hacker_man/most-js
```

### Using CDN

For direct use in browsers without a build step:

```js
import { anything } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js'
```

### Basic Usage

Here's a simple example showing how to create a counter application:

```js
import { Div, H1, P, Button, useState, render } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';

const App = () => {
  const [count, setCount] = useState(0);
  
  return Div({ className: 'app' }, [
    H1({}, ["Hello, MostJS!"]),
    P({}, [`Current count: ${count}`]),
    Button({ 
      onClick: () => setCount((count)=>{count + 1}) 
    }, ["Increment"])
  ]);
}

// Render your app to the DOM
render("App", App);
```

## Core Concepts

### Virtual DOM

MostJS uses a virtual DOM approach to efficiently update the real DOM. The virtual DOM is a lightweight JavaScript representation of the actual DOM, allowing the framework to perform optimized updates.

**Why use a Virtual DOM?**

1. **Performance:** By comparing virtual DOM trees before updating the real DOM, MostJS minimizes expensive DOM operations.
2. **Simplicity:** Developers can describe the UI declaratively without worrying about manual DOM manipulations.

At its core, MostJS's virtual DOM nodes are simple JavaScript objects with the following structure:

```js
{
  tag: 'div',           // HTML tag or component name
  props: { /* ... */ }, // Element attributes, event handlers, etc.
  children: [],         // Child nodes or text content
  ref: null             // Reference to actual DOM element (populated after rendering)
}
```

### Creating Elements

In MostJS, you create virtual DOM elements using the `Create` function:

```js
Create(tag, props, ...children)
```

**Parameters:**

* `tag`: The HTML tag name (like 'div', 'span', etc.)
* `props`: An object containing attributes, event handlers, and other properties
* `children`: An array of child elements or text content

**Example:**

```js
const element = Create('div', { 
  className: 'container',
  id: 'main',
  onClick: () => console.log('Clicked!')
}, [
  Create('h1', {}, ["Title"]),
  Create('p', {}, ["Content"])
]);
```

Under the hood, the `Create` function does the following:

1. Processes children, converting strings and numbers to text nodes
2. Returns a virtual DOM node object with the specified tag, props, and children


### Creation Components

MostJS provides creation-components, which are predefined functions that use the `Create` function internally, making your code cleaner and more readable.

**Example:**

```js
import { Div, P } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';

return Div({ className: 'container' }, [
  P({ id: "greeting" }, ["Hello world"])
]);
```

#### Available Creation Components

MostJS includes creation components for most common HTML elements. Each one follows the same pattern - accepting props and children, then forwarding them to the `Create` function with the appropriate tag name:

* `Button`: For `<button>` elements
* `Div`: For `<div>` elements
* `Ul`: For `<ul>` elements
* `Li`: For `<li>` elements
* `H1` through `H6`: For heading elements
* `Input`: For `<input>` elements
* `P`: For paragraph elements
* `Span`: For `<span>` elements
* `Link`: For `<a>` elements (with special routing behavior)
* `Aside`: For `<aside>` elements
* `Header`: For `<header>` elements
* `Hr`: For `<hr>` elements
* `Blockquote`: For `<blockquote>` elements
* `Footer`: For `<footer>` elements
* `Section`: For `<section>` elements
* `Label`: For `<label>` elements
* `Main`: For `<main>` elements

**Special Case: Link Component**

The `Link` component deserves special attention as it integrates with the MostJS router:

* Requires an `href` prop
* Automatically opens external links in a new tab
* Intercepts click events to trigger client-side routing
* Supports a `render` parameter to control whether the new route should be rendered or just change path

Link(props= {}, children= [], render=true)

render parameter is for choosing to just push the path but not render anything you can acheive same result with

router.pushOnly()


### Components

MostJS components are functions that return virtual DOM nodes. Unlike some other frameworks, components in MostJS are pure JavaScript functions, making them intuitive and flexible.

The `Component` function is used to render and manage reusable components:

```js
Component(componentFn, props, title)
```

**Parameters:**

* `componentFn`: The component function to render
* `props`: Properties to pass to the component
* `title`: A unique identifier for the component (required)

**Example:**

```js
import { Div, Component } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';
import Sidebar from './Sidebar.js';
import MainContent from './MainContent.js';

const App = () => {
  return Div({ className: 'app' }, [
    Component(Sidebar, { isCollapsed: false }, "sidebar"),
    Component(MainContent, { title: "Welcome" }, "main-content")
  ]);
};
```

Under the hood, `Component` does the following:

1. Registers the component function with its title
2. Manages component state tracking
3. Handles the component stack for context during rendering
4. Captures and returns the component's virtual DOM representation

### State Management

MostJS provides a simple state management system with the `useState` fucntion, inspired by React's hook system.

#### useState

The `useState` hook allows components to maintain and update state:

```js
const [state, setState] = useState(initialValue);
```

**Parameters:**

* `initialValue`: Initial state value (can be a value or function)

**Returns:**

* An array containing:
  * `state`: Current state value
  * `setState`: Function to update the state

**Example:**

```js
import { Div, Button, useState } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return Div({}, [
    `Count: ${count}`,
    Button({ onClick: () => setCount(count + 1) }, ["Increment"])
  ]);
};
```

**How it works:**

The `useState` implementation:

1. Identifies the current component from the component stack
2. Retrieves or initializes the component's state storage
3. Gets or sets the state at the current index
4. Provides a setter function that:
   * Accepts a new value or a function to compute a new value
   * Performs equality checks based on the state type
   * Triggers a re-render only when the state actually changes

### Handling References

#### useRef

The `useRef` hook provides direct access to DOM elements:

```js
const elementRef = useRef(referenceId);
```

**Parameters:**

* `referenceId`: A unique string identifier that matches a `reference` prop on an element

**Returns:**

* The actual DOM element

**Example:**

```js
import { Div, Input, Button, useRef } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';

const SearchField = () => {
  const inputRef = useRef("search-input");
  
  const focusInput = () => {
    inputRef.focus();
  };
  
  return Div({}, [
    Input({ 
      reference: "search-input",
      placeholder: "Search..." 
    }, []),
    Button({ onClick: focusInput }, ["Focus Search"])
  ]);
};
```

**How it works:**

The reference system in MostJS:

1. Uses a global map to store references to DOM elements
2. Requires elements to have a `reference` prop with a unique identifier
3. During element creation, elements with a `reference` prop are added to the refs map
4. The `useRef` function retrieves elements from this map using the identifier

### Watching for Changes

#### Watch

The `Watch` function provides a way to perform side effects when dependencies change:

```js
Watch(callback, dependencies);
```

**Parameters:**

* `callback`: Function to execute
* `dependencies`: Array of values to watch (optional)

**Behavior:**

* If no dependency array is provided: The effect runs after every render
* If an empty array (`[]`) is provided: The effect runs only once when the component mounts
* With dependencies: The effect runs when any dependency changes

**Example:**

```js
import { Div, H1, useState, Watch } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';

const UserProfile = (props) => {
  const [user, setUser] = useState(null);
  
  Watch(() => {
    fetch(`/api/users/${props.userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [props.userId]); // Re-fetch when userId changes
  
  return Div({}, [
    H1({}, [user ? user.name : "Loading..."])
  ]);
};
```

**How it works:**

The `Watch` implementation:

1. Identifies the current component from the component stack
2. Compares the new dependencies with the previous ones using deep equality
3. If dependencies have changed, schedules the effect to run after render
4. Handles cleanup functions returned from the effect


## Routing

MostJS includes a robust client-side router for creating single-page applications (SPAs). The router enables navigation between different views without full page reloads, making your applications feel more responsive and native-like.

### Core Router Features

- **Path-based routing**: Define routes with static paths or dynamic parameters
- **Parameter extraction**: Use route patterns like `/users/:id` to capture URL segments
- **Query string parsing**: Access query parameters with `router.useQuery()`
- **Browser history integration**: Seamless integration with the browser's History API
- **Custom 404 handling**: Define custom handlers for unmatched routes
- **Title management**: Set document titles for each route

### Router API

#### Initialization

```js
import { router } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';

// Set up routes
router.register('/path', ComponentHandler, 'Page Title');
router.register('/users/:id', UserComponent, 'User Profile');

// Set a custom 404 handler
router.setNotFoundHandler(NotFoundComponent);

// Start the router (initialize with current URL)
router.start();
```

#### Route Registration

```js
router.register(path, handler, title)
```

**Parameters:**
- `path`: A string path pattern (can include dynamic segments with `:paramName` syntax)
- `handler`: The component function to render when the route matches
- `title`: The document title to set when this route is active (defaults to window.location.origin)

**Examples:**

```js
// Static route
router.register('/about', AboutComponent, 'About Us');

// Route with parameters
router.register('/products/:category/:id', ProductComponent, 'Product Details');

// Root route
router.register('/', HomeComponent, 'Home Page');
```

#### Navigation Methods

The router provides several methods for navigation:

##### `push(path)`

Navigates to a new route, updates the browser history, and renders the matching component.

```js
router.push('/products/electronics/12345'); // Navigate and render
```

##### `pushOnly(path)`

Updates the URL and browser history without rendering any component. Useful for updating the URL without triggering a re-render.

```js
router.pushOnly('/products?sort=price'); // Just update the URL
```

##### `reload()`

Re-renders the component for the current route. Useful after state changes that should refresh the current view.

```js
router.reload(); // Re-render current route
```

#### Accessing Route Parameters

```js
const params = router.useParams();
```

**Returns:** An object containing all route parameters extracted from the current URL.

**Example:**
```js
// For URL: /users/42/profile
const { id } = router.useParams(); // id will be "42"
```

#### Accessing Query Parameters

```js
const query = router.useQuery();
```

**Returns:** An object containing all query parameters from the current URL.

**Example:**
```js
// For URL: /search?q=javascript&sort=relevance
const { q, sort } = router.useQuery(); // q will be "javascript", sort will be "relevance"
```

#### Getting Current Path

```js
const path = router.currentPath();
```

**Returns:** The current pathname (without query string).

#### Custom 404 Handler

```js
router.setNotFoundHandler(NotFoundComponent);
```

**Parameters:**
- `handler`: Component function to render when no route matches the current URL

### The Link Component

MostJS provides a special `Link` component that integrates with the router:

```js
import { Link } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';

// In your component:
Link({ href: '/users/profile', className: 'nav-link' }, ['Go to Profile'], true);
```

**Parameters:**
- `props`: Object containing attributes for the anchor element (required: `href`)
- `children`: Content of the link
- `render`: Boolean that controls whether to render the new route (default: true)

**Features:**
- Automatically opens external links in a new tab
- Intercepts click events for internal links and uses client-side routing
- Can update URL without rendering via the `render` parameter

### Complete Routing Example

Here's an example of a complete SPA with routing:

```js
import { 
  Div, H1, P, Link, Component, 
  router 
} from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';

// Components
const Home = () => {
  return Div({ className: 'page home' }, [
    H1({}, ['Welcome to MostJS']),
    P({}, ['This is the homepage']),
    Link({ href: '/users' }, ['View Users'])
  ]);
};

const UserList = () => {
  // Get query parameters
  const query = router.useQuery();
  const sortBy = query.sort || 'name';
  
  return Div({ className: 'page users' }, [
    H1({}, ['User List']),
    P({}, [`Sorted by: ${sortBy}`]),
    Link({ href: '/' }, ['Back to Home']),
    // Sort links - notice the render=false parameter
    Link({ href: `/users?sort=name` }, ['Sort by Name'], false),
    Link({ href: `/users?sort=date` }, ['Sort by Date'], false)
  ]);
};

const UserProfile = () => {
  // Get route parameters
  const { id } = router.useParams();
  
  return Div({ className: 'page profile' }, [
    H1({}, [`User Profile: ${id}`]),
    Link({ href: '/users' }, ['Back to Users'])
  ]);
};

const NotFound = () => {
  return Div({ className: 'page not-found' }, [
    H1({}, ['404 - Page Not Found']),
    P({}, ['The requested page does not exist.']),
    Link({ href: '/' }, ['Go to Homepage'])
  ]);
};

// Register routes
router.setNotFoundHandler(NotFound);
router.register('/', Home, 'Home - MostJS App');
router.register('/users', UserList, 'User List');
router.register('/users/:id', UserProfile, 'User Profile');

// Start the router
router.start();
```

### Advanced Usage: Combining with State

You can combine the router with state management to create dynamic views:

```js
import { Div, P, useState, Watch, router } from 'https://cdn.jsdelivr.net/npm/@hacker_man/most-js@1.3.0/index.js';

const FilteredList = () => {
  // Initialize state from URL parameters
  const [filter, setFilter] = useState(() => {
    return router.useParams().filter || "all";
  });
  
  // Watch for changes to the filter
  Watch(() => {
    // Update URL when filter changes
    if (filter !== router.useParams().filter) {
      router.pushOnly(`/${filter}`);
    }
  }, [filter]);
  
  return Div({}, [
    P({}, [`Current filter: ${filter}`])
    // Rest of your component...
  ]);
};

router.register('/:filter', FilteredList, 'Filtered List');
router.register('/', FilteredList, 'All Items');
```

### Browser Navigation

The router automatically handles browser back/forward navigation by listening to the `popstate` event. When users navigate using browser controls, the router will update the application state and render the appropriate component.
### Diffing Algorithm

The diffing algorithm is central to MostJS's efficiency. It compares the old and new virtual DOM trees to determine the minimal set of changes required to update the real DOM.

**Key Features:**

* Node type comparison
* Key-based reconciliation
* Attribute and event handler updates
* Child node reconciliation
* Text node updates

**How it Works:**

1. Compare node types (tag names)
2. If key props are used, match by keys first
3. Update attributes and event handlers that have changed
4. Process children, reusing existing nodes where possible
5. Add new nodes and remove deleted ones


### Rendering

MostJS's rendering system is responsible for converting the virtual DOM into real DOM elements and updating the DOM when state changes.

**Primary Rendering Functions:**

1. **createElement** : Creates actual DOM elements from virtual nodes
2. **render** : Initial rendering of a component to the DOM
3. **rerender** : Updates the DOM when component state changes


## API Reference

### Core Functions

| Function                                       | Description                                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `Create(tag, props, ...children)`              | Creates a virtual DOM element                                                                      |
| `Component(componentFn, props, title)`         | Renders a reusable component with scoped state                                                     |
| `useState(initialValue)`                       | Creates a state variable with getter and setter                                                    |
| `useRef(referenceId)`                          | Accesses a DOM element by reference ID                                                             |
| `Watch(callback, dependencies)`                | Runs side effects when dependencies change                                                         |
| `render(componentTitle, componentFn, props)`   | Renders a component to the DOM                                                                     |
| `createStore(initialState)`                    | Creates a global state store with subscribe/dispatch pattern                                       |
| `diff(oldVNode, newVNode)`                     | Computes differences between virtual DOM trees                                                     |
| `createElement(vNode)`                         | Creates a real DOM element from a virtual DOM node                                                 |
| `rerender(component, props)`                   | Updates a component's DOM representation after state changes                                       |

### Creation Components

| Component                                         | HTML Equivalent     | Description                                  |
| ------------------------------------------------- | ------------------- | -------------------------------------------- |
| `Button(props, children)`                         | `<button>`          | Button element                               |
| `Div(props, children)`                            | `<div>`             | Division element                             |
| `Ul(props, children)`                             | `<ul>`              | Unordered list                               |
| `Li(props, children)`                             | `<li>`              | List item                                    |
| `H1(props, children)` to `H6(props, children)`    | `<h1>` to `<h6>`    | Heading elements                             |
| `Input(props, children)`                          | `<input>`           | Input element                                |
| `P(props, children)`                              | `<p>`               | Paragraph element                            |
| `Span(props, children)`                           | `<span>`            | Span element                                 |
| `Link(props, children, render)`                   | `<a>`               | Anchor element with routing support          |
| `Aside(props, children)`                          | `<aside>`           | Aside element                                |
| `Header(props, children)`                         | `<header>`          | Header element                               |
| `Footer(props, children)`                         | `<footer>`          | Footer element                               |
| `Section(props, children)`                        | `<section>`         | Section element                              |
| `Main(props, children)`                           | `<main>`            | Main content element                         |
| `Nav(props, children)`                            | `<nav>`             | Navigation element                           |
| `Article(props, children)`                        | `<article>`         | Article element                              |
| `Hr(props, children)`                             | `<hr>`              | Horizontal rule element                      |
| `Img(props, children)`                            | `<img>`             | Image element                                |
| `Label(props, children)`                          | `<label>`           | Form label element                           |
| `Form(props, children)`                           | `<form>`            | Form element                                 |
| `Textarea(props, children)`                       | `<textarea>`        | Text area input element                      |
| `Select(props, children)`                         | `<select>`          | Select dropdown element                      |
| `Option(props, children)`                         | `<option>`          | Option for select element                    |
| `Table(props, children)`                          | `<table>`           | Table element                                |
| `Tr(props, children)`                             | `<tr>`              | Table row element                            |
| `Th(props, children)`                             | `<th>`              | Table header cell element                    |
| `Td(props, children)`                             | `<td>`              | Table data cell element                      |
| `Thead(props, children)`                          | `<thead>`           | Table header section                         |
| `Tbody(props, children)`                          | `<tbody>`           | Table body section                           |
| `Tfoot(props, children)`                          | `<tfoot>`           | Table footer section                         |
| `Blockquote(props, children)`                     | `<blockquote>`      | Block quotation element                      |

### Router API

| Method                                   | Description                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| `router.register(path, handler, title)`  | Registers a route with a path pattern, component handler, and document title    |
| `router.push(path)`                      | Navigates to a path, updates history, and renders the matching component        |
| `router.pushOnly(path)`                  | Updates the URL without rendering a component                                   |
| `router.reload()`                        | Re-renders the component for the current route                                  |
| `router.useParams()`                     | Returns an object containing route parameters extracted from the current URL    |
| `router.useQuery()`                      | Returns an object containing query parameters from the current URL              |
| `router.getCurrentPath()`                | Returns the current pathname (without query string)                             |
| `router.setNotFoundHandler(handler)`     | Sets a component to render when no route matches the current URL                |
| `router.start()`                         | Initializes the router with the current URL and renders the matching component  |

### Event Handling

MostJS supports all standard DOM events. When defining event handlers in props, use the camelCase version of the event name:

| Event Prop                | DOM Event            | Description                                       |
| ------------------------- | -------------------- | ------------------------------------------------- |
| `onClick`                 | `click`              | Element click event                               |
| `onChange`                | `change`             | Form element value change                         |
| `onInput`                 | `input`              | Input element value change (immediate)            |
| `onSubmit`                | `submit`             | Form submission event                             |
| `onKeyDown`               | `keydown`            | Key press down event                              |
| `onKeyUp`                 | `keyup`              | Key release event                                 |
| `onFocus`                 | `focus`              | Element receives focus                            |
| `onBlur`                  | `blur`               | Element loses focus                               |
| `onMouseOver`             | `mouseover`          | Mouse pointer enters element                      |
| `onMouseOut`              | `mouseout`           | Mouse pointer leaves element                      |
| `onMouseMove`             | `mousemove`          | Mouse pointer moves within element                |
| `onTouchStart`            | `touchstart`         | Touch event begins                                |
| `onTouchEnd`              | `touchend`           | Touch event ends                                  |
| `onTouchMove`             | `touchmove`          | Touch moves on element                            |
| `onScroll`                | `scroll`             | Element or document scrolling                     |
| `onLoad`                  | `load`               | Element finished loading                          |
| `onError`                 | `error`              | Error during element loading                      |

### Special Props

| Prop                      | Description                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `className`               | Sets the HTML class attribute (use this instead of `class`)                        |                |                 |
| `reference`               | Sets a reference ID for accessing the DOM element via `useRef()`                   |
| `style`                   | Accepts an object of CSS properties in camelCase (e.g., `{fontSize: '16px'}`)      |
| `key`                     | Special prop for optimizing list rendering and reconciliation                      |                                       |
