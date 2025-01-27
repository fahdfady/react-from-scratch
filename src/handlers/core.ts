import * as RType from "../types/types";


let currentTreeRef: {
    firstRender: boolean,
    viewTree: RType.ReactTree | null,
    currentlyRendering: RType.ReactComponentInternalMetadata | null,
    currentHookIndex: number
} = {
    firstRender: true,
    viewTree: null,
    currentlyRendering: null,
    currentHookIndex: 0,
}


// helper function to assign the kind of component
export function mapComponentToUnionTag(component: RType.externalComponent): RType.ComponentType {
    if (typeof component === "string")
        return { kind: "tag", tagName: component }
    else
        return { kind: "function", name: component.name, function: component }
}

const mapExternalMetadataToInternalMetadata = (
    internalMetadata: RType.ReactComponentExternalMetadata<RType.AnyProps>,
): RType.ReactComponentInternalMetadata => {
    const { component, children, props, } = internalMetadata;
    return {
        id: crypto.randomUUID(),
        component: mapComponentToUnionTag(component),
        children: children,
        props: props,
        hooks: [],
    }
}

// helper function to create text nodes
export function createTextElement(text: string): RType.ReactComponentInternalMetadata {
    return {
        id: crypto.randomUUID(),
        component: {
            kind: "text",
            content: text
        },
        props: {},
        children: [],
        hooks: []
    };
}


export const createElement = <T extends RType.AnyProps>(
    component: RType.externalComponent, // Either an HTML tag or a function component
    props: T, // Props passed to the component
    ...children: Array<RType.ReactComponentInternalMetadata | string> // Rest parameter for children
): RType.ReactComponentInternalMetadata => {

    const processedChildren: Array<RType.ReactComponentInternalMetadata> = children.map(child => {
        if (typeof child === "string") {
            return createTextElement(child)
        };
        return child
    })


    // Do NOT invoke functionional components here. just store it as metadata
    // in React, functional components should not be invoked during element creation
    // rather, be invoked during the render phase
    /*
        if (typeof component === "function") {
        return component({ ...props, children: processedChildren })
        }
    */

    return mapExternalMetadataToInternalMetadata({
        component,
        props,
        children: processedChildren,
    })
};
console.log(currentTreeRef)

// to apply components to the dom for functinal components we'll use a lazy-evaluation approach of a Tree datastrcutre
// a recursive function that turn the lazy internal metadata into a full view tree
export function generateViewTree(internalMetadata: RType.ReactComponentInternalMetadata): RType.ReactViewTreeNode {
    console.log(`entered ${"generateViewTree"}`)
    hooksQueue = null // clear all hooks
    currentTreeRef.currentlyRendering = internalMetadata // set it as the currently rendering tree
    console.log(currentTreeRef)
    currentTreeRef.currentHookIndex = 0; // Reset hook index for the component

    const newNode: RType.ReactViewTreeNode = {
        id: crypto.randomUUID(),
        metadata: internalMetadata,
        childNodes: [],
        // parent: null,
    };

    switch (internalMetadata.component.kind) {
        case "function": {
            console.log(`invoking ${internalMetadata.component.name}`)
            const outputInternalMetada = internalMetadata.component.function({
                ...internalMetadata.props,
                children: internalMetadata.children,
            });
            console.log("outputInternalMetada", outputInternalMetada)
            // recursive invoke to generate a sub-tree for the children
            const subViewTree = generateViewTree(outputInternalMetada);
            newNode.childNodes.push(subViewTree);
            break;
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

    currentTreeRef.currentlyRendering = null // reset after rendering

    return newNode
}

// This is a somehow implementation of React.render .. takes
// 1. a virtual dom node that represents the whole tree
// 2. parent element in the DOM
export function applyComponentsToDom(viewNode: RType.ReactViewTreeNode, parent: HTMLElement | null) {
    const { metadata, childNodes } = viewNode
    console.log(metadata)
    switch (metadata.component.kind) {
        case "tag": {
            const element = document.createElement(metadata.component.tagName);
            Object.assign(element, metadata.props);
            parent?.appendChild(element);
            childNodes.forEach(child => {
                applyComponentsToDom(child, element)
            })
            break;
        }
        case "text": {
            const element = document.createTextNode(metadata.component.content);
            console.log(element)
            parent?.appendChild(element);
            break;
        }
        case "function": {
            childNodes.forEach(child =>
                applyComponentsToDom(child, parent)
            );
        }
    }
}

type Hook = {

};

let hooksQueue: Hook[] | null = [{

}]


export function useState<T>(initialValue: T): readonly [state: T, setState: (value: T) => void] {
    const { currentlyRendering, currentHookIndex } = currentTreeRef;
    console.log(currentTreeRef)
    // check if used inside of a component
    if (!currentlyRendering) throw new Error("useState must be called inside of a component")

    const hooks = currentlyRendering.hooks;

    if (!hooks[currentHookIndex]) {
        hooks[currentHookIndex] = {
            kind: "state",
            value: initialValue as T
        }
    }

    currentTreeRef.currentHookIndex++

    console.log(`called hook ${hooks[currentHookIndex].kind} with index ${currentHookIndex} with value ${hooks[currentHookIndex].value}`)

    let state: T = hooks[currentHookIndex].value as T

    console.log("useState initial value", state)

    const setState = (newValue: T) => {
        console.log("setting new value ... ")

        state = newValue

        console.log(`value set to ${state}`)
    }

    return [state, setState] as const
}
