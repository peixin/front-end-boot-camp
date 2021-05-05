function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (const prop in element.computedStyle) {
    const value = element.computedStyle[prop].value + "";
    if (value.endsWith("px") || /^\d+$/.test(value)) {
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
  items.forEach(getStyle);

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

  let isAutoMainSize = false;
  // auto sizing
  if (!style[mainSize]) {
    isAutoMainSize = true;
    style[mainSize] = 0;
    for (const item of items) {
      if (item.style[mainSize] !== null && item.style[mainSize] !== void 0) {
        style[mainSize] += item.style[mainSize];
      }
    }
  }

  let flexLine = [];
  const flexLines = [flexLine];

  let mainSpace = style[mainSize];
  let crossSpace = 0;

  for (const item of items) {
    itemStyle = item.style;
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    // flex: 1
    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === "noWrap" && isAutoMainSize) {
      // noWrap
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
        flexLine.push(item);
      }
    } else {
      // bigger than parent mainSize
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }

      if (itemStyle[mainSize] < mainSpace) {
        flexLine.push(item);
      } else {
        // new line
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;

        flexLine = [];
        flexLines.push(flexLine);

        flexLine.push(item);

        mainSpace = style[mainSize];
        crossSpace = 0;
      }

      mainSpace -= itemStyle[mainSize];

      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
    }
  }

  flexLine.mainSpace = mainSpace;
  console.log(JSON.stringify(items, null, 2));
}

module.exports = layout;
