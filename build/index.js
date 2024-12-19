// src/index.ts
var mapComponentToUnionTag = function(component) {
  if (typeof component === "string")
    return { kind: "tag", tagName: component };
  else
    return { kind: "function", name: component.name, function: component };
};
var createTextElement = function(text) {
  return {
    id: crypto.randomUUID(),
    component: {
      kind: "text",
      content: text
    },
    props: {},
    children: []
  };
};
var MyComponent = function(props) {
  return createElement("h1", {}, props.title);
};
var createNodeFromMetadata = function(metadata) {
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
};
var appendTagsToDom = function(parent, child) {
  if (!parent)
    return;
  parent.appendChild(createNodeFromMetadata(child));
};
var applyComponentsToDom = function(viewNode, parent) {
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
};
var generateViewTree = function(internalMetadata) {
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
};
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
var functionalElement = createElement(MyComponent, { title: "Welcome!" });
var MAINELEMENT = createElement("div", { id: "test" }, createElement("span", { className: "child" }, "Hello World"), functionalElement, MyComponent({ title: "J. Cole Better than Kendrick" }));
console.log(JSON.stringify(MAINELEMENT, null, 2));
var rootElement = document.querySelector("#root");
applyComponentsToDom(generateViewTree(MAINELEMENT), rootElement);
