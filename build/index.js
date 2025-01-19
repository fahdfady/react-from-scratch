// src/handlers/rendering.ts
function mapComponentToUnionTag(component) {
  if (typeof component === "string")
    return { kind: "tag", tagName: component };
  else
    return { kind: "function", name: component.name, function: component };
}
function createTextElement(text) {
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
function generateViewTree(internalMetadata) {
  const newNode = {
    id: crypto.randomUUID(),
    metadata: internalMetadata,
    childNodes: []
  };
  switch (internalMetadata.component.kind) {
    case "function": {
      const outputInternalMetada = internalMetadata.component.function({
        children: internalMetadata.children,
        ...internalMetadata.props
      });
      const subViewTree = generateViewTree(outputInternalMetada);
      newNode.childNodes.push(subViewTree);
    }
    case "tag": {
      internalMetadata.children.forEach((child) => {
        newNode.childNodes.push(generateViewTree(child));
      });
      break;
    }
    case "text": {
      break;
    }
  }
  return newNode;
}
function createNodeFromMetadata(metadata) {
  const { component, props, children } = metadata;
  switch (component.kind) {
    case "tag": {
      const element = document.createElement(component.tagName);
      Object.assign(element, props);
      children.forEach((child) => appendTagsToDom(element, child));
      return element;
    }
    case "text": {
      console.log(component);
      return document.createTextNode(component.content);
    }
    case "function": {
      throw new Error("Not Implemented yet.");
    }
  }
}
function appendTagsToDom(parent, child) {
  if (!parent)
    return;
  parent.appendChild(createNodeFromMetadata(child));
}
function applyComponentsToDom(viewNode, parent) {
  const { metadata, childNodes } = viewNode;
  switch (metadata.component.kind) {
    case "tag": {
      const element = document.createElement(metadata.component.tagName);
      Object.assign(element, metadata.props);
      parent?.appendChild(element);
      metadata.children.forEach((childNode) => appendTagsToDom(element, childNode));
      console.log(element);
      break;
    }
    case "text": {
      const element = document.createTextNode(metadata.component.content);
      console.log(element);
      parent?.appendChild(element);
      break;
    }
    case "function": {
      applyComponentsToDom(childNodes[0], parent);
    }
  }
}
var createElement = (component, props, ...children) => {
  const processedChildren = children.map((child) => {
    if (typeof child === "string") {
      console.log("child   ", child);
      console.log(createTextElement(child));
      return createTextElement(child);
    }
    return child;
  });
  if (typeof component === "function") {
    return component({ ...props, children: processedChildren });
  }
  return {
    id: crypto.randomUUID(),
    component: mapComponentToUnionTag(component),
    props,
    children: processedChildren
  };
};

// src/handlers/reactivity.ts
function useState(initialValue) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialValue);
}
var resolveDispatcher = function() {
  const dispatcher = {
    useState: (initialState) => {
      let state = typeof initialState === "function" ? initialState() : initialState;
      const setState = (newState) => {
        console.log("***  NEW STATE PASSED:  ", newState, "  ***");
        state = newState;
        console.log("***  STATE CHANGED:  ", state, "  ***");
      };
      return [state, setState];
    }
  };
  if (dispatcher === null) {
    console.error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.");
  }
  return dispatcher;
};

// src/index.ts
var MyComponent = function(props) {
  return createElement("h1", {}, props.title);
};
var functionalElement = createElement(MyComponent, { title: "Welcome!" });
var MAINELEMENT = createElement("div", { id: "test" }, createElement("span", { className: "child" }, "Hello World"), functionalElement, MyComponent({ title: "J. Cole Better than Kendrick" }));
console.log(JSON.stringify(MAINELEMENT, null, 2));
var rootElement = document.querySelector("#root");
applyComponentsToDom(generateViewTree(MAINELEMENT), rootElement);
var [HW, setHW] = useState("Hello World");
console.log(HW);
setHW("Hello World 2");
console.log(HW);
console.log(useState(0));
