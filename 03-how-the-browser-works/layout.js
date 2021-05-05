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

  // init flex compute parameters
  ["width", "height"].forEach((size) => {
    if (element.style[size] === "auto" || !element.style[size]) {
      element.style[size] = null;
    }
  });
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
  // ["width", "height"].forEach((size) => {
  //   if (style[size] === "auto" || style[size] === "") {
  //     style[size] = null;
  //   }
  // });

  setDefaultValue(style, "flexDirection", "row");
  setDefaultValue(style, "alignItems", "stretch");
  setDefaultValue(style, "justifyContent", "flex-start");
  setDefaultValue(style, "flexWrap", "nowrap");
  setDefaultValue(style, "alignContent", "stretch");

  let mainSize,
    mainStart,
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
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  } else if (style.flexDirection === "row-reveres") {
    mainSize = "width";
    mainStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  } else if (style.flexDirection === "column") {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  } else if (style.flexDirection === "column-reveres") {
    mainSize = "height";
    mainStart = "bottom";
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
    } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
      // nowrap
      mainSpace -= itemStyle[mainSize];
      // calculate  crossSpace
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
        flexLine.push(item);
      }
    } else {
      // multiline wrap
      // bigger than parent mainSize
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }

      // line can contain element
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

  // calculate crossSpace
  if (style.flexWrap === "nowrap" || isAutoMainSize) {
    flexLine.crossSpace =
      style[crossSize] !== undefined && style[crossSize] !== null
        ? style[crossSize]
        : crossSpace;
  } else {
    flexLine.crossSpace = crossBase;
  }

  // calculate main axis
  if (mainSpace < 0) {
    // mainSpace < 0 must be single line
    // overflow (happens only if container is single line), scale every item

    // scale = realSize / needSize
    const scale = style[mainSize] / (style[mainSize] - mainSpace);
    let currentMain = mainBase;
    for (let i = 0; i <= items.length; i += 1) {
      const item = items[0];
      const itemStyle = item.style;

      // flex is not involved in the calculation
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] =
        itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    // process each flex line
    flexLines.forEach((items) => {
      const mainSpace = items.mainSpace;
      let flexTotal = 0;
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (item.style.flex !== null && item.style.flex !== void 0) {
          flexTotal += 1;
          continue;
        }
      }

      if (flexTotal > 0) {
        // There is flexible flex items
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i += 1) {
          const item = items[i];
          const itemStyle = item.style;
          if (item.style.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        // There is No flexible flex items, which means justifyContent should work
        //
        let currentMain = 0;
        let step = 0;
        if (style.justifyContent === "flex-end") {
          currentMain = mainSpace * mainSign + mainBase;
          step = 0;
        } else if (style.justifyContent === "center") {
          currentMain = (mainSpace / 2) * mainSign + mainBase;
          step = 0;
        } else if (style.justifyContent === "space-between") {
          currentMain = mainBase;
          step = (mainSpace / (items.length - 1)) * mainSign;
        } else if (style.justifyContent === "space-around") {
          step = (mainSpace / items.length) * mainSign;
          currentMain = step / 2 + mainBase;
        } else {
          // default flex start
          currentMain = mainSpace;
          step = 0;
        }

        for (let i = 0; i < items.length; i += 1) {
          const item = items[i];
          const itemStyle = item.style;
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }

  // calculate cross axis
  // align items, align-self
  // let crossSpace;
  if (!style[crossSize]) {
    // auto sizing
    crossSpace = 0;
    style[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i += 1) {
      style[crossSize] += flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i += 1) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === "wrap-reverse") {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  let lienSize = style[crossSize] / flexLines.length;
  let step = 0;

  if (style.alignContent === "flex-start") {
    crossBase += 0;
    step = 0;
  } else if (style.alignContent === "flex-end") {
    crossBase += crossSign * crossSpace;
    step = 0;
  } else if (style.alignContent === "center") {
    crossBase += (crossSign * crossSpace) / 2;
    step = 0;
  } else if (style.alignContent === "space-between") {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  } else if (style.alignContent === "space-around") {
    step = crossSpace / flexLines.length;
    crossBase += (crossSign * step) / 2;
  } else {
    // stretch
    crossBase += 0;
    step = 0;
  }

  //
  flexLines.forEach((items) => {
    const lineCrossSize =
      style.alignContent === "stretch"
        ? items.crossSpace + crossSpace / flexLines.length
        : items.crossSpace;

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const itemStyle = item.style;
      const align = itemStyle.alignSelf || style.alignItems;

      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = align === "stretch" ? lineCrossSize : 0;

        if (align === "flex-start") {
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossBase * itemStyle[crossSize];
        } else if (align === "flex-end") {
          itemStyle[crossEnd] = crossBase + crossSign * itemStyle[crossSize];
          itemStyle[crossStart] =
            itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
        } else if (align === "center") {
          itemStyle[crossStart] =
            crossBase +
            (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        } else if (align === "stretch") {
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] =
            crossBase +
            crossSign *
              (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0
                ? itemStyle[crossSize]
                : lineCrossSize);

          itemStyle[crossSize] =
            crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
        }

        crossBase += crossSign * (lineCrossSize + step);
      }
    }
  });
  // console.log(items);
}

module.exports = layout;
