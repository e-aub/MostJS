import {Div, P, Button, Component, router, useState } from '../../mostJS/index.js';
import NotFoundHandler from '/assets/components/NotFound.js';
import AsideComponent from '/assets/components/Aside.js';
import Todo from '/assets/components/Todo.js';



const App = () => {
  return Div({ className: 'app' }, [
    Component(AsideComponent, {}, "aside"),
    Component(Todo, {}, "todo-app"),
    Button({
      className: "reset",
      onclick: () => {
        localStorage.removeItem('todos');
        router.reload();
      }
    }, "Reset"),
    P({ className: "warning" }, "History will only be accessible in the browser where it was saved. If you use a different browser, a new, independent history will be created there.")
  ])
}

router.setNotFoundHandler(NotFoundHandler);
router.register("/:filter", App, "Todo App");
router.register("/", App, "Todo App");

router.start();

