export type AnyProps = Record<string, any>;

export type ReactComponentFunction<T = AnyProps> = (props: T) => ReactComponentInternalMetadata;

export type externalComponent = keyof HTMLElementTagNameMap | ReactComponentFunction<any>;

export type ReactComponentExternalMetadata<T extends AnyProps> = {
    component: externalComponent;
    props: T;
    children: Array<ReactComponentInternalMetadata>;
}

export type TextComponent = {
    kind: "text";
    content: string;
}

export type TagComponent = {
    kind: "tag";
    tagName: keyof HTMLElementTagNameMap;
};

export type FunctionalComponent = {
    kind: "function";
    name: string;
    function: (
        props: {
            children: Array<ReactComponentInternalMetadata>;
            [key: string]: unknown;
        }
    ) => ReactComponentInternalMetadata;
};

export type ComponentType = TagComponent | FunctionalComponent | TextComponent;


export type ReactComponentInternalMetadata = {
    id: string;
    component: ComponentType;
    props: AnyProps;
    children: Array<ReactComponentInternalMetadata>
}
// tree node
export type ReactViewTreeNode = {
    id: string,
    metadata: ReactComponentInternalMetadata, // node info
    childNodes: Array<ReactViewTreeNode>, // its children
}
