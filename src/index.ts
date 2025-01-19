import * as RType from "./types/types";
import * as core from "./handlers/core";

// functional component
function MyComponent(props: { title: string }) {
    const [HW, setHW] = core.useState("Hello World")
    console.log(HW)
    setHW("Hello World 2")
    console.log(HW)
    console.log(core.useState(0))
    
    return core.createElement("h1", {}, props.title);
}

const functionalElement = core.createElement(MyComponent, { title: "Welcome!" });

const MAINELEMENT = core.createElement("div", { id: "test" },
    core.createElement("span", { className: "child" }, "Hello World",), functionalElement, MyComponent({ title: "J. Cole Better than Kendrick" })
);

console.log(JSON.stringify(MAINELEMENT, null, 2));

// This is called ReactDOM.render in react

const rootElement: HTMLElement | null = document.querySelector("#root");

// to apply components to the dom for functinal components we'll use a lazy-evaluation approach of a Tree datastrcutre
// a recursive function that turn the lazy internal metadata into a full view tree

core.applyComponentsToDom(core.generateViewTree(MAINELEMENT), rootElement)
