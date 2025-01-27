import * as RType from "./types/types";
import * as core from "./handlers/core";

// functional component
function MyComponent(props: { title: string }) {
    const [HW, setHW] = core.useState(props.title);
    setHW("Hello World");
    return core.createElement("h1", { style: "font-size:46px;" }, HW);
}

const functionalElement = core.createElement(MyComponent, { title: "Welcome!" });

const MAINELEMENT = core.createElement("div", { id: "test" },
    functionalElement, core.createElement("h2", { style: "color:red; font-size:28px;" }, "J. Cole Better than Kendrick")
);



const rootElement: HTMLElement | null = document.querySelector("#root");

const vdomViewTree = core.generateViewTree(MAINELEMENT);

console.log(JSON.stringify(vdomViewTree, null, 2));
core.applyComponentsToDom(vdomViewTree, rootElement)
