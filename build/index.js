// src/index.ts
var mapComponentToUnionTag = function(component) {
  if (typeof component === "string")
    return { kind: "tag", tagName: component };
  return { kind: "function", name: component.name, function: component };
};
var MyComponent = function(props) {
  return createElement("h1", {}, props.title);
};
var createNodeFromMetadata = function(metadata) {
  const { component, props, children } = metadata;
  if (component.kind === "tag") {
    const element = document.createElement(component.tagName);
    Object.assign(element, props);
    children.forEach((childNode) => appendTagsToDom(element, childNode));
    return element;
  } else {
    throw new Error("Not Implemented yet.");
  }
};
var appendTagsToDom = function(parent, child) {
  if (typeof child === "string") {
    parent?.appendChild(document.createTextNode(child));
  } else {
    parent?.appendChild(createNodeFromMetadata(child));
  }
};
var applyComponentsToDom = function(metadata, parent) {
  if (parent === null)
    throw new Error("Aborted. no root element.");
  const { component, props, children } = metadata;
  if (component.kind === "tag") {
    const element = document.createElement(component.tagName);
    Object.assign(element, props);
    parent.appendChild(element);
    children.forEach((childNode) => appendTagsToDom(element, childNode));
  } else {
    throw new Error("Not Implemented yet.");
  }
};
var createElement = (component, props, ...children) => {
  if (typeof component === "function") {
    return component(props);
  }
  return {
    id: crypto.randomUUID(),
    component: mapComponentToUnionTag(component),
    props,
    children
  };
};
var functionalElement = createElement(MyComponent, { title: "Welcome!" });
var element = createElement("div", { id: "test" }, createElement("span", { className: "child" }, "Hello World", functionalElement));
console.log(JSON.stringify(element, null, 2));
var rootElement = document.querySelector("#root");
applyComponentsToDom(element, rootElement);
