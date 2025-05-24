const refs = new Map();

function useRef(reference) {
    console.log(refs);

    if (reference === "BODY") {
        return document.body;
    }
    return refs.get(reference);
}

export { useRef, refs };
