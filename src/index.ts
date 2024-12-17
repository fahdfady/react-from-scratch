import * as RType from "./types/types";


function mapComponentToUnionTag(component: RType.externalComponent): RType.TagComponent | RType.FunctionalComponent {
    if (typeof component === "string") return { kind: "tag", tagName: component }
    return { kind: "function", name: component.name, function: component }
}


export const createElement = <T extends RType.AnyProps>(
    component: RType.ReactComponentExternalMetadata<T>["component"], // Either an HTML tag or a function component
    props: T, // Props passed to the component
    ...children: Array<RType.ReactComponentInternalMetadata | string> // Rest parameter for children
): RType.ReactComponentInternalMetadata => {

    // check if the component is a function and invoke it to return its metadata
    if (typeof component === "function") {
        return component(props)
    }

    return ({
        id: crypto.randomUUID(), // Generate a unique ID for this element
        component: mapComponentToUnionTag(component), // Treat this as a tag by default
        props, // Set the props object
        children // Children passed as an array
    })
};

// functional component
function MyComponent(props: { title: string }) {
    return createElement("h1", {}, props.title);
}

const functionalElement = createElement(MyComponent, { title: "Welcome!" });

const element = createElement("div", { id: "test" },
    createElement("span", { className: "child" }, "Hello World", functionalElement)
);

console.log(JSON.stringify(element, null, 2));


function createNodeFromMetadata(metadata: RType.ReactComponentInternalMetadata): Node {
    const { component, props, children } = metadata;

    if (component.kind === "tag") {
        const element = document.createElement(component.tagName);
        Object.assign(element, props);
        children.forEach(childNode => appendTagsToDom(element, childNode))
        return element;
    }
    else {
        throw new Error("Not Implemented yet.")
    }
}

function appendTagsToDom(parent: HTMLElement | null, child: RType.ReactComponentInternalMetadata | string) {
    if (typeof child === "string") {
        parent?.appendChild(document.createTextNode(child));
    }
    else {
        parent?.appendChild(createNodeFromMetadata(child))
    }
}


function applyComponentsToDom(metadata: RType.ReactComponentInternalMetadata, parent: HTMLElement | null) {
    if (parent === null) throw new Error("Aborted. no root element.");

    const { component, props, children } = metadata;

    if (component.kind === "tag") {
        const element = document.createElement(component.tagName);
        Object.assign(element, props);
        parent.appendChild(element);
        children.forEach(childNode => appendTagsToDom(element, childNode))
    }
    else {
        throw new Error("Not Implemented yet.")
    }
}

const rootElement: HTMLElement | null = document.querySelector("#root");

applyComponentsToDom(element, rootElement)