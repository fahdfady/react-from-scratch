// this is a test file, the VDOM is generated and printed out in ./inspect.json to see how it looks like
import * as RType from "../src//types/types";
import * as core from "../src/handlers/core";

// functional component
function MyComponent(props: { title: string }) {
    const [HW, setHW] = core.useState(props.title);
    console.log(HW);
    setTimeout(() => {
        setHW("Hello World");
    }, 1000);
    return core.createElement("h1", {}, HW);
}

const functionalElement = core.createElement(MyComponent, { title: "Welcome!" });

const MAINELEMENT = core.createElement("div", { id: "test" },
    functionalElement, MyComponent({ title: "J. Cole Better than Kendrick" })
);


export function logToFile(data: any, filename: string = 'inspect.json') {
    Bun.write(filename, JSON.stringify(data, null, 2));
}

logToFile(MAINELEMENT, './test/inspect.json')

console.log("test ran successfully ✪ ω ✪")