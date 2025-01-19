import * as RType from "./types/types";
import * as rendering from "./handlers/rendering";
import * as reactivity from "./handlers/reactivity";

// functional component
function MyComponent(props: { title: string }) {
    return rendering.createElement("h1", {}, props.title);
}

const functionalElement = rendering.createElement(MyComponent, { title: "Welcome!" });

const MAINELEMENT = rendering.createElement("div", { id: "test" },
    rendering.createElement("span", { className: "child" }, "Hello World",), functionalElement, MyComponent({ title: "J. Cole Better than Kendrick" })
);

console.log(JSON.stringify(MAINELEMENT, null, 2));

// This is called ReactDOM.render in react

const rootElement: HTMLElement | null = document.querySelector("#root");

// to apply components to the dom for functinal components we'll use a lazy-evaluation approach of a Tree datastrcutre
// a recursive function that turn the lazy internal metadata into a full view tree

rendering.applyComponentsToDom(rendering.generateViewTree(MAINELEMENT), rootElement)
const [HW, setHW] = reactivity.useState("Hello World")
console.log(HW)
setHW("Hello World 2")
console.log(HW)
console.log(reactivity.useState(0))