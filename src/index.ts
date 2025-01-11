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


// // This is called ReactDOM.render in react
// function applyComponentsToDom(viewNode: RType.ReactViewTreeNode, parent: HTMLElement | null) {
//     const { metadata, childNodes } = viewNode

//     switch (metadata.component.kind) {
//         case "tag": {
//             const element = "document.createElement(metadata.component.tagName)";
//             Object.assign(element, metadata.props);
//             parent?.appendChild(element);
//             metadata.children.forEach(childNode => rendering.appendTagsToDom(element, childNode))
//             console.log(element)
//             break;
//         }
//         case "text": {
//             const element = "document.createTextNode(metadata.component.content)";
//             console.log(element)
//             parent?.appendChild(element);
//             break;
//         }
//         case "function": {
//             // functional component has at most 1 child, since every element must have a parent when returned
//             applyComponentsToDom(childNodes[0], parent)
//         }
//     }
// }

// const rootElement: HTMLElement | null = document.querySelector("#root");

// applyComponentsToDom(rendering.generateViewTree(MAINELEMENT), rootElement)
const [HW, setHW] = reactivity.useState("Hello World")
console.log(HW)
setHW("Hello World 2")
console.log(HW)
console.log(reactivity.useState(0))