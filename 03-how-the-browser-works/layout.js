function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (const prop in element.computedStyle) {
    const value = element.computedStyle[prop].value + "";
    if (value.endsWith("px") || /\d+/.test(value)) {
      element.style[prop] = parseInt(value, 10);
    } else {
      element.style[prop] = value;
    }
  }
}

function setDefaultValue(style, property, defaultVal) {
  if (!style[property] || style[property] === "auto") {
    style[property] = defaultVal;
  }
}

function layout(element) {
  if (!element.computedStyle) {
    return;
  }

  getStyle(element);

  const style = element.style;
  
  if (style.display !== "flex") {
    return;
  }

  const items = element.children.filter((e) => e.type === "element");

  items.sort((a, b) => (a.sort || 0) - (b.sort || 0));

  // init flex compute parameters
  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === "") {
      style[size] = null;
    }
  });

  setDefaultValue(style, "flexDirection", "row");
  setDefaultValue(style, "alignItems", "stretch");
  setDefaultValue(style, "justifyContent", "flex-start");
  setDefaultValue(style, "flexWrap", "noWrap");
  setDefaultValue(style, "alignContent", "stretch");

  let mainSize,
    minStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;

  if (style.flexDirection === "row") {
    mainSize = "width";
    minStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  } else if (style.flexDirection === "row-reveres") {
    mainSize = "width";
    minStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  } else if (style.flexDirection === "column") {
    mainSize = "height";
    minStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  } else if (style.flexDirection === "column-reveres") {
    mainSize = "height";
    minStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = style.height;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexWrap === "wrap-reverse") {
    tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    
    // crossBase = style.height;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = +1;
  }
}

module.exports = layout;
