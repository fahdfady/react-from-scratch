// this is a test file, the VDOM is generated and printed out in ./inspect.json to see how it looks like
import * as RType from "../src//types/types";
import * as core from "../src/handlers/core";


function MyComponent(props: { title: string }) {
    const [HW, setHW] = core.useState(props.title);
    setHW("Hello World");
    return core.createElement("h1", { style: "font-size:46px;" }, HW);
}

const functionalElement = core.createElement(MyComponent, { title: "Welcome!" });

const MAINELEMENT = core.createElement("div", { id: "test" },
    functionalElement, core.createElement("h2", { style: "color:red; font-size:28px;" }, "J. Cole Better than Kendrick")
);


const vdomViewTree = core.generateViewTree(MAINELEMENT);


export function logToFile(data: any, filename: string = 'inspect.json') {
    Bun.write(filename, JSON.stringify(data, null, 2));
}
logToFile(vdomViewTree, './test/inspect.json')

console.log("test ran successfully ✪ ω ✪")