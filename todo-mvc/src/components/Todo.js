import { Div, H1, Input, Button, Ul, Li, Section, Header, Label, Main, Footer, Span, Link, useState, router, useRef, Watch } from '../../mostJS/index.js';



export default function Todo() {
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem('todos');
    return stored ? JSON.parse(stored) : [];
  });
  const [isUpdate, setupdate] = useState(false);

  const [input, setInput] = useState('');
  const [updateInput, setUpdateInput] = useState("");
  const [filter, setFilter] = useState(() => {
    return router.useParams().filter || "all";
  });


  const [invalidInput, setInvalidInput] = useState(false);
  const [invalidUpdateInput, setInvalidUpdateInput] = useState(false);




  const focusInput = () => {
    let inputRef = useRef("search-input");
    if (inputRef && isUpdate) {
      inputRef.focus();
      inputRef.setSelectionRange(inputRef.value.length, inputRef.value.length);
    }


  };

  Watch(focusInput);

  Watch(() => {
    let inputRef = useRef("check");
    if (inputRef) {
      for (let i = 0; i < todos.length; i++) {
        let element = todos[i];
        if (!element.completed) {
          inputRef.checked = false;
          return
        }
      }

      inputRef.checked = true;
    }

  });

  function validateInput(input) {
    if (!input) {
      return false;
    }
    return input.length > 1;
  }

  const updatecomponent = (event, todo) => {
    setTodos((prev) => {
      const updated = prev.map(t => t === todo ? { ...t, text: event.target.value, edit: false } : t)
      localStorage.setItem('todos', JSON.stringify(updated));
      return updated
    }
    )
  };


  return Section({ className: "todoapp", id: "root" }, [
    Header({ className: "header" }, [
      H1({}, "todos"),
      Div({ className: `input-container ${invalidInput ? 'invalid' : ''}` }, [
        Input({
          autofocus: true,
          id: "todo-input",
          className: "new-todo",
          type: "text",
          value: input,
          onkeydown: (e) => {
            if (e.key === "Enter") {
              if (!validateInput(input)) {
                setInvalidInput(true);
                return;
              }
              setInvalidInput(false);
              setTodos(newTodos => {
                const updated = [...newTodos, { text: input, completed: false, edit: false }];
                localStorage.setItem('todos', JSON.stringify(updated));
                return updated;
              });
              setInput('');
            }
          },
          oninput: (e) => {
            setInput(e.target.value);
            setInvalidInput(!validateInput(e.target.value));
          },
          placeholder: "What needs to be done?"
        }),
        Label({ className: "Visually-hidden", for: "todo-input" })
      ])
    ]),
    Main({ className: "main" }, [
      todos.length > 0 ? Div({ className: "toggle-all-container" }, [
        Input({
          className: "toggle-all", type: "checkbox", id: "toggle-all", reference: "check",
          onclick: (e) => {
            const checked = e.target.checked;
            setTodos(todos => {
              const updated = todos.map(t => {
                return { ...t, completed: checked }
              })
              localStorage.setItem('todos', JSON.stringify(updated));
              return updated
            })
          }
        }),
        Label({
          className: "toggle-all-label",
          for: "toggle-all",
        }, [])
      ]) : "",
      Ul({ className: "todo-list" },
        todos.filter((todo) => filter === 'all' || filter === 'active' && !todo.completed || filter === 'completed' && todo.completed).map((todo) => {
          return Li({
            className: `todo-item ${todo.completed ? 'completed' : ''}`, key: todo.text,
            ondblclick: (event) => {
              setupdate(true);
              setTodos(todos =>
                todos.map(t => t === todo ? { ...t, edit: true } : { ...t, edit: false })
              );
            }
          }, [
            !todo.edit ? Div({ className: "view" }, [
              Input({
                className: `toggle ${todo.completed ? 'checked' : ''}`,
                oninput: (e) => setTodos(todos => {
                  const updated = todos.map(t => t === todo ? { ...t, completed: !t.completed } : t);
                  localStorage.setItem('todos', JSON.stringify(updated));
                  return updated;
                }),
                type: "checkbox"
              }),
              Label({ className: "label" }, todo.text),
              Button({
                className: "destroy",
                onclick: () => setTodos(prev => {
                  const updated = prev.filter(t => t !== todo);
                  localStorage.setItem('todos', JSON.stringify(updated));
                  return updated;
                })
              })
            ]) : Div({ className: `input-container ${invalidUpdateInput ? 'invalid' : ''}` }, [
              Input({
                reference: "search-input",
                onBlur: (e) => {
                  setupdate(false);
                  setTodos(todos =>
                    todos.map(t => { return { ...t, edit: false } })
                  );
                },
                id: "todo-input",
                className: "new-todo",
                type: "text",
                value: updateInput || todo.text,
                onkeydown: (e) => {
                  if (e.key === "Enter") {
                    if (!validateInput(updateInput)) {
                      setInvalidUpdateInput(true);
                      return;
                    }
                    setInvalidUpdateInput(false);
                    updatecomponent(e, todo)
                    setUpdateInput('');
                  }
                },
                oninput: (e) => {
                  setUpdateInput(e.target.value);
                  setInvalidUpdateInput(!validateInput(e.target.value));
                },
              }),
            ])
          ])
        })
      )
    ]),
    Footer({ className: "footer" }, [
      Span({ className: "todo-count" }, [
        Span({}, `${todos.reduce((acc, todo) => !todo.completed ? acc + 1 : acc, 0)} item left`)
      ]),
      Ul({ className: "filters" }, [
        Li({ className: filter === "all" ? "selected" : "", onclick: () => setFilter(() => "all") }, Link({ href: "/all" }, "All", false)),
        Li({ className: filter === "active" ? "selected" : "", onclick: () => setFilter(() => "active") }, Link({ href: "/active" }, "Active", false)),
        Li({ className: filter === "completed" ? "selected" : "", onclick: () => setFilter(() => "completed") }, Link({ href: "/completed" }, "Completed", false))
      ]),
      Div({ className: "clear-completed" }, [
        Button({
          className: "clear-completed",
          onclick: () => {
            setTodos(() => {
              const updated = todos.filter((todo) => !todo.completed);
              localStorage.setItem('todos', JSON.stringify(updated));
              return updated;
            });
          }
        }, "Clear completed")
      ])
    ])
  ])
}
