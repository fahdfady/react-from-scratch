import * as RType from "./types/types";


function mapComponentToUnionTag(component: RType.externalComponent): RType.TagComponent | RType.FunctionalComponent {
    if (typeof component === "string")
        return { kind: "tag", tagName: component }
    else
        return { kind: "function", name: component.name, function: component }
}

// helper function to create text nodes
function createTextElement(text: string): RType.ReactComponentInternalMetadata {
    return {
        id: crypto.randomUUID(),
        component: {
            kind: "text",
            content: text
        },
        props: {},
        children: []
    };
}
const createElement = <T extends RType.AnyProps>(
    component: RType.ReactComponentExternalMetadata<T>["component"], // Either an HTML tag or a function component
    props: T, // Props passed to the component
    ...children: Array<RType.ReactComponentInternalMetadata | string> // Rest parameter for children
): RType.ReactComponentInternalMetadata => {

    // !! THIS WORKS
    // Process children to convert string children to TextComponents
    const processedChildren: Array<RType.ReactComponentInternalMetadata> = children.map(child => {
        if (typeof child === "string") {
            console.log("child   ", child)
            console.log(createTextElement(child))
            return createTextElement(child)
        };
        return child
    })


    // check if the component is a function and invoke it to return its metadata
    if (typeof component === "function") {
        return component({ ...props, children: processedChildren })
    }

    // !! THIS WORKS
    return ({
        id: crypto.randomUUID(), // Generate a unique ID for this element
        component: mapComponentToUnionTag(component), // Treat this as a tag by default
        props, // Set the props object
        children: processedChildren // Children passed as an array
    })
};

// functional component
function MyComponent(props: { title: string }) {
    return createElement("h1", {}, props.title);
}

const functionalElement = createElement(MyComponent, { title: "Welcome!" });

const MAINELEMENT = createElement("div", { id: "test" },
    createElement("span", { className: "child" }, "Hello World",), functionalElement, MyComponent({ title: "J. Cole Better than Kendrick" })
);

console.log(JSON.stringify(MAINELEMENT, null, 2));


function createNodeFromMetadata(metadata: RType.ReactComponentInternalMetadata): Node {
    const { component, props, children } = metadata;

    switch (component.kind) {
        case "tag": {
            const element = document.createElement(component.tagName);
            Object.assign(element, props);
            children.forEach(child => appendTagsToDom(element, child));
            return element;
        }
        case "text": {
            console.log(component)
            return document.createTextNode(component.content);
        }
        case "function": {
            throw new Error("Not Implemented yet.");
        }
    }
}

function appendTagsToDom(parent: HTMLElement | null, child: RType.ReactComponentInternalMetadata) {
    if (!parent) return;
    parent.appendChild(createNodeFromMetadata(child))
}


// This is called ReactDOM.render in react
function applyComponentsToDom(viewNode: ReactViewTreeNode, parent: HTMLElement | null) {
    const { metadata, childNodes } = viewNode

    switch (metadata.component.kind) {
        case "tag": {
            const element = document.createElement(metadata.component.tagName);
            Object.assign(element, metadata.props);
            parent?.appendChild(element);
            metadata.children.forEach(childNode => appendTagsToDom(element, childNode))
            console.log(element)
            break;
        }
        case "text": {
            const element = document.createTextNode(metadata.component.content);
            console.log(element)
            parent?.appendChild(element);
            break;
        }
        case "function": {
            // functional component has at most 1 child, since every element must have a parent when returned
            applyComponentsToDom(childNodes[0], parent)
        }
    }
}

const rootElement: HTMLElement | null = document.querySelector("#root");

applyComponentsToDom(generateViewTree(MAINELEMENT), rootElement)

// to apply components to the dom for functinal components we'll use a lazy-evaluation approach of a Tree datastrcutre

// tree node
type ReactViewTreeNode = {
    id: string,
    metadata: RType.ReactComponentInternalMetadata, // node info
    childNodes: Array<ReactViewTreeNode>, // its children
}


// a recursive function that turn the lazy internal metadata into a full view tree
function generateViewTree(internalMetadata: RType.ReactComponentInternalMetadata): ReactViewTreeNode {
    const newNode: ReactViewTreeNode = {
        id: crypto.randomUUID(),
        metadata: internalMetadata,
        childNodes: [],
    };

    switch (internalMetadata.component.kind) {
        case "function": {
            const outputInternalMetada = internalMetadata.component.function({
                children: internalMetadata.children,
                ...internalMetadata.props,
            });

            // recursive invoke to generate a sub-tree for the children
            const subViewTree = generateViewTree(outputInternalMetada);
            newNode.childNodes.push(subViewTree)
        }
        case "tag": {

            // TODO: implement the renderNode thing
            internalMetadata.children.forEach(child => {
                newNode.childNodes.push(generateViewTree(child));
            });
            break;
        }

        case "text": {
            // Text nodes are leaves in our tree, so they don't need further processing
            break;
        }
    }

    return newNode
}