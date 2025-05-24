import componentStack from "./componentStack.js";
import { componentIndexes } from "./state.js";


const Data = new Map();  // Key = componentTitle  Value =[{deps: [values], calback: func }]
export const Indices = new Map();  // key = componentTitle Value = index (int)

let CalbackStack = [];

export function Watch(Depency, callback) {
    const currentComponent = componentStack.current;
    const index = Indices.get(currentComponent) || 0;
    let Deps = Data.get(currentComponent);
    if (!Deps) {
        Data.set(currentComponent, []);
        Deps = Data.get(currentComponent);
    }

    if (!Deps[index]) {
        Deps[index] = {
            deps: Depency,
            callback: callback,
        }
    } else {
        if (!areDepsEqual(Deps[index].deps, Depency)) {
            CalbackStack.push(callback);
            Deps[index].deps = Depency;
        } else if (Depency.length == 0) {
            CalbackStack.push(callback);
        }
    }
    Indices.set(currentComponent, index + 1);
}

export function applyCallbacksAfterRender() {
    CalbackStack.forEach((calback) => {
        calback();
    });
    CalbackStack = [];
}

export function isPlainObject(obj) {
    return obj !== null && typeof obj === "object" && obj.constructor === Object;
}

export function shallowEqualObjects(a, b) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => a[key] === b[key]);
}

export function areDepsEqual(newDeps, oldDeps) {
    if (newDeps.length !== oldDeps.length) return false;

    return newDeps.every((dep, i) => {
        const oldDep = oldDeps[i];

        if (Array.isArray(dep) && Array.isArray(oldDep)) {
            if (dep.length !== oldDep.length) return false;
            return dep.every((val, j) => {
                if (Array.isArray(val) && Array.isArray(oldDep[j])) {
                    return areDepsEqual(val, oldDep[j]);
                } else if (isPlainObject(val) && isPlainObject(oldDep[j])) {
                    return shallowEqualObjects(val, oldDep[j]);
                }
                return val === oldDep[j];
            });
        }

        if (isPlainObject(dep) && isPlainObject(oldDep)) {
            return shallowEqualObjects(dep, oldDep);
        }

        return dep === oldDep;
    });
}




///////////////////////////////////////////////////////////////////////



// export function Watch(callback, deps = null) {
//     const currentComponent = componentStack.current;
//     if (!currentComponent) {
//         console.error("Watch called outside component context");
//         return;
//     }

//     if (!watchEffects.has(currentComponent)) {
//         watchEffects.set(currentComponent, [{ effects: [], index: 0 }]);
//     }



//     if (!afterRenderEffects.has(currentComponent)) {
//         afterRenderEffects.set(currentComponent, []);
//     }

//     const effects = afterRenderEffects.get(currentComponent);


//     if (!deps) {
//         effects.push(() => {
//             callback();
//         });
//         return;
//     }


//     if (!Array.isArray(deps)) {
//         console.error(
//             "%c[Watch Error]%c Expected an array of dependencies.\n" +
//             "Wrap dependencies in square brackets like this: %c[dep1, dep2]%c.",
//             "color: red; font-weight: bold;",
//             "color: white;",
//             "color: cyan; font-style: italic;",
//             "color: white;"
//         );
//         return;
//     }


//     const oldDeps = oldDependencies.get(currentComponent) || [];


//     const hasChanged = oldDeps.length === 0 || !areDepsEqual(deps, oldDeps);


//     if (hasChanged) {
//         oldDependencies.set(currentComponent, [...deps]);
//         effects.push(() => {
//             callback();
//         });
//     }
// }
