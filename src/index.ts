type AnyProps = Record<string, any>;

export type ReactComponentFunction<T = AnyProps> = (props: T) => ReactComponentInternalMetadata;

type externalComponent = keyof HTMLElementTagNameMap | ReactComponentFunction<any>;

export type ReactComponentExternalMetadata<T extends AnyProps> = {
    component: externalComponent;
    props: T;
    children: Array<ReactComponentInternalMetadata>;
}

export type TagComponent = {
    kind: "tag";
    tagName: keyof HTMLElementTagNameMap;
};

export type FunctionalComponent = {
    kind: "function";
    name: string;
    function: (
        props: Record<string, unknown> | null
    ) => ReactComponentInternalMetadata;
};

export type ReactComponentInternalMetadata = {
    id: string;
    component: TagComponent | FunctionalComponent;
    props: AnyProps;
    children: Array<ReactComponentInternalMetadata | string>
}

function mapComponentToUnionTag(component: externalComponent): TagComponent | FunctionalComponent {
    if (typeof component === "string") return { kind: "tag", tagName: component }
    return { kind: "function", name: component.name, function: component }
}

export const createElement = <T extends AnyProps>(
    component: ReactComponentExternalMetadata<T>["component"], // Either an HTML tag or a function component
    props: T, // Props passed to the component
    ...children: Array<ReactComponentInternalMetadata | string> // Rest parameter for children
): ReactComponentInternalMetadata => {

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
function MyComponent() {
    return createElement("h1", {}, "Heading 1 Tag")
}

const element = createElement("div", { id: "test" },
    createElement("span", { className: "child" }, "Hello World")
);

console.log(element)