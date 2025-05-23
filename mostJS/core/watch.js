import componentStack from "./componentStack.js";

let oldDependencies = new Map();
let afterRenderEffects = new Map();
let watchEffects = new Map();

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

export function Watch(callback, deps = null) {
    const currentComponent = componentStack.current;
    if (!currentComponent) {
        console.error("Watch called outside component context");
        return;
    }

    if (!watchEffects.has(currentComponent)) {
        watchEffects.set(currentComponent, [{ effects: [], index: 0 }]);
    }



    if (!afterRenderEffects.has(currentComponent)) {
        afterRenderEffects.set(currentComponent, []);
    }

    const effects = afterRenderEffects.get(currentComponent);


    if (!deps) {
        effects.push(() => {
            callback();
        });
        return;
    }


    if (!Array.isArray(deps)) {
        console.error(
            "%c[Watch Error]%c Expected an array of dependencies.\n" +
            "Wrap dependencies in square brackets like this: %c[dep1, dep2]%c.",
            "color: red; font-weight: bold;",
            "color: white;",
            "color: cyan; font-style: italic;",
            "color: white;"
        );
        return;
    }


    const oldDeps = oldDependencies.get(currentComponent) || [];


    const hasChanged = oldDeps.length === 0 || !areDepsEqual(deps, oldDeps);


    if (hasChanged) {
        oldDependencies.set(currentComponent, [...deps]);
        effects.push(() => {
            callback();
        });
    }
}

export function applyCallbacksAfterRender() {
    const currentComponent = componentStack.current;

    if (!currentComponent || !afterRenderEffects.has(currentComponent)) {
        return;
    }

    const currentAfterRenderEffects = afterRenderEffects.get(currentComponent);


    afterRenderEffects.set(currentComponent, []);


    if (currentAfterRenderEffects && currentAfterRenderEffects.length > 0) {
        requestAnimationFrame(() => {
            currentAfterRenderEffects.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error("Error in effect:", error);
                }
            });
        });
    }
}