import _isEmpty from "lodash/isEmpty";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/*eslint no-magic-numbers: ["error", { "ignore": [-0.5, 0.5, 0, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import VictoryPortal from "../victory-portal/victory-portal";
import Rect from "../victory-primitives/rect";
import CustomPropTypes from "../victory-util/prop-types";
import Helpers from "../victory-util/helpers";
import LabelHelpers from "../victory-util/label-helpers";
import Style from "../victory-util/style";
import Log from "../victory-util/log";
import TextSize from "../victory-util/textsize";
import TSpan from "../victory-primitives/tspan";
import Text from "../victory-primitives/text";
var defaultStyles = {
  fill: "#252525",
  fontSize: 14,
  fontFamily: "'Gill Sans', 'Gill Sans MT', 'Ser­avek', 'Trebuchet MS', sans-serif",
  stroke: "transparent"
};

var getPosition = function (props, dimension) {
  if (!props.datum) {
    return 0;
  }

  var scaledPoint = Helpers.scalePoint(props, props.datum);
  return scaledPoint[dimension];
};

var getFontSize = function (style) {
  var baseSize = style && style.fontSize;

  if (typeof baseSize === "number") {
    return baseSize;
  } else if (baseSize === undefined || baseSize === null) {
    return defaultStyles.fontSize;
  } else if (typeof baseSize === "string") {
    var fontSize = +baseSize.replace("px", "");

    if (!isNaN(fontSize)) {
      return fontSize;
    } else {
      Log.warn("fontSize should be expressed as a number of pixels");
      return defaultStyles.fontSize;
    }
  }

  return defaultStyles.fontSize;
};

var getStyles = function (style, props) {
  var getSingleStyle = function (s) {
    s = s ? _defaults({}, s, defaultStyles) : defaultStyles;
    var baseStyles = Helpers.evaluateStyle(s, props);
    return _assign({}, baseStyles, {
      fontSize: getFontSize(baseStyles)
    });
  };

  return Array.isArray(style) && !_isEmpty(style) ? style.map(function (s) {
    return getSingleStyle(s);
  }) : [getSingleStyle(style)];
};

var getHeight = function (props, type) {
  return Helpers.evaluateProp(props[type], props);
};

var getLineHeight = function (props) {
  var lineHeight = getHeight(props, "lineHeight");

  if (Array.isArray(lineHeight)) {
    return _isEmpty(lineHeight) ? [1] : lineHeight;
  } else {
    return [lineHeight];
  }
};

var getContent = function (text, props) {
  if (text === undefined || text === null) {
    return undefined;
  }

  if (Array.isArray(text)) {
    return text.map(function (line) {
      return Helpers.evaluateProp(line, props);
    });
  }

  var child = Helpers.evaluateProp(text, props);

  if (child === undefined || child === null) {
    return undefined;
  }

  return Array.isArray(child) ? child : "".concat(child).split("\n");
};

var getDy = function (props, lineHeight) {
  var style = Array.isArray(props.style) ? props.style[0] : props.style;
  lineHeight = lineHeight[0];
  var fontSize = style.fontSize;
  var dy = props.dy ? Helpers.evaluateProp(props.dy, props) : 0;
  var length = props.inline ? 1 : props.text.length;
  var capHeight = getHeight(props, "capHeight");
  var verticalAnchor = style.verticalAnchor || props.verticalAnchor;
  var anchor = verticalAnchor ? Helpers.evaluateProp(verticalAnchor, props) : "middle";

  switch (anchor) {
    case "end":
      return dy + (capHeight / 2 + (0.5 - length) * lineHeight) * fontSize;

    case "middle":
      return dy + (capHeight / 2 + (0.5 - length / 2) * lineHeight) * fontSize;

    default:
      return dy + (capHeight / 2 + lineHeight / 2) * fontSize;
  }
};

var getTransform = function (props) {
  var x = props.x,
      y = props.y,
      polar = props.polar,
      style = props.style;
  var defaultAngle = polar ? LabelHelpers.getPolarAngle(props) : 0;
  var baseAngle = style.angle === undefined ? props.angle : style.angle;
  var angle = baseAngle === undefined ? defaultAngle : baseAngle;
  var transform = props.transform || style.transform;
  var transformPart = transform && Helpers.evaluateProp(transform, props);
  var rotatePart = angle && {
    rotate: [angle, x, y]
  };
  return transformPart || angle ? Style.toTransformString(transformPart, rotatePart) : undefined;
};

var getXCoordinate = function (calculatedProps, labelSizeWidth) {
  var direction = calculatedProps.direction,
      textAnchor = calculatedProps.textAnchor,
      x = calculatedProps.x;

  if (direction === "rtl") {
    return x - labelSizeWidth;
  }

  switch (textAnchor) {
    case "start":
      return x;

    case "middle":
      return Math.round(x - labelSizeWidth / 2);

    case "end":
      return Math.round(x - labelSizeWidth);

    default:
      return x;
  }
};

var getYCoordinate = function (calculatedProps, props, textHeight) {
  var verticalAnchor = calculatedProps.verticalAnchor,
      y = calculatedProps.y;
  var dy = props.dy,
      inline = props.inline;
  var offset = y + (dy || 0);

  switch (verticalAnchor) {
    case "start":
      return Math.floor(offset);

    case "middle":
      return Math.floor(offset - textHeight / 2);

    case "end":
      return inline ? Math.floor(offset) : Math.ceil(offset - textHeight);

    default:
      return inline ? Math.floor(offset) : Math.floor(offset - textHeight / 2);
  }
};

var getBackgroundPadding = function (props) {
  if (props.backgroundPadding && Array.isArray(props.backgroundPadding)) {
    return props.backgroundPadding.map(function (backgroundPadding) {
      return Helpers.getPadding({
        backgroundPadding: backgroundPadding
      }, "backgroundPadding");
    });
  } else {
    return Helpers.getPadding(props, "backgroundPadding");
  }
};

var getBackgroundPaddingProp = function (i, backgroundPadding) {
  if (Array.isArray(backgroundPadding)) {
    return backgroundPadding[i] || backgroundPadding[0];
  } else {
    return backgroundPadding;
  }
};

var getFullBackground = function (props, calculatedProps, tspanValues) {
  var backgroundComponent = props.backgroundComponent,
      backgroundStyle = props.backgroundStyle,
      inline = props.inline;
  var dx = calculatedProps.dx,
      backgroundPadding = calculatedProps.backgroundPadding,
      transform = calculatedProps.transform;
  var textSizes = tspanValues.map(function (tspan) {
    return TextSize.approximateTextSize(tspan.text, tspan.style);
  });
  var height = inline ? Math.max.apply(Math, _toConsumableArray(textSizes.map(function (size) {
    return size.height;
  }))) : textSizes.reduce(function (memo, size, i) {
    return memo + size.height * tspanValues[i].lineHeight;
  }, 0);
  var width = inline ? textSizes.reduce(function (memo, size) {
    return memo + size.width;
  }, 0) + (dx || 0) : Math.max.apply(Math, _toConsumableArray(textSizes.map(function (size) {
    return size.width;
  }))) + (dx || 0);
  var xCoordinate = getXCoordinate(calculatedProps, width);
  var yCoordinate = getYCoordinate(calculatedProps, props, height);
  var backgroundProps = {
    key: "background",
    height: height + backgroundPadding.top + backgroundPadding.bottom,
    style: backgroundStyle,
    transform: transform,
    width: width + backgroundPadding.left + backgroundPadding.right,
    x: xCoordinate,
    y: yCoordinate
  };
  return React.cloneElement(backgroundComponent, _defaults({}, backgroundComponent.props, backgroundProps));
};

var getChildBackgrounds = function (props, calculatedProps, tspanValues) {
  var backgroundStyle = props.backgroundStyle,
      backgroundComponent = props.backgroundComponent,
      inline = props.inline,
      y = props.y;
  var dy = calculatedProps.dy,
      backgroundPadding = calculatedProps.backgroundPadding,
      transform = calculatedProps.transform;
  var textElements = tspanValues.map(function (current, i) {
    var previous = tspanValues[i - 1] || tspanValues[0];
    var labelSize = TextSize.approximateTextSize(current.text, current.style);
    var totalLineHeight = current.fontSize * current.lineHeight;
    var textHeight = Math.ceil(totalLineHeight);
    var prevPaddingProp = getBackgroundPaddingProp(i - 1, backgroundPadding);
    var childDy = i && !inline ? previous.fontSize * previous.lineHeight + prevPaddingProp.top + prevPaddingProp.bottom : dy - totalLineHeight * 0.5 - (current.fontSize - current.capHeight);
    return {
      textHeight: textHeight,
      labelSize: labelSize,
      y: y,
      fontSize: current.fontSize,
      dy: childDy
    };
  });
  return textElements.map(function (textElement, i) {
    var xCoordinate = getXCoordinate(calculatedProps, textElement.labelSize.width);
    var yCoordinate = textElements.slice(0, i + 1).reduce(function (prev, curr) {
      return prev + curr.dy;
    }, y);
    var padding = getBackgroundPaddingProp(i, backgroundPadding);
    var backgroundProps = {
      key: "tspan-background-".concat(i),
      height: textElement.textHeight + padding.top + padding.bottom,
      style: backgroundStyle[i] || backgroundStyle[0],
      width: textElement.labelSize.width + padding.left + padding.right,
      transform: transform,
      x: xCoordinate,
      y: yCoordinate
    };
    return React.cloneElement(backgroundComponent, _defaults({}, backgroundComponent.props, backgroundProps));
  });
};

var getBackgroundElement = function (props, calculatedProps, tspanValues) {
  return Array.isArray(props.backgroundStyle) ? getChildBackgrounds(props, calculatedProps, tspanValues) : getFullBackground(props, calculatedProps, tspanValues);
};

var calculateSpanDy = function (current, previous) {
  return -0.5 * previous.fontSize - 0.5 * (previous.fontSize * previous.lineHeight) + previous.fontSize * previous.lineHeight + 0.5 * current.fontSize + 0.5 * current.fontSize * current.lineHeight - (current.fontSize - current.capHeight) * 0.5 + (previous.fontSize - previous.capHeight) * 0.5;
};

var getTSpanDy = function (tspanValues, props, i) {
  var inline = props.inline,
      backgroundStyle = props.backgroundStyle;
  var current = tspanValues[i];
  var previous = tspanValues[i - 1] || tspanValues[0];

  if (i && !inline) {
    return backgroundStyle && Array.isArray(backgroundStyle) && backgroundStyle.length > 1 ? calculateSpanDy(current, previous) + current.backgroundPadding.top + previous.backgroundPadding.bottom : calculateSpanDy(current, previous);
  } else if (inline) {
    return i === 0 ? current.backgroundPadding.top : undefined;
  } else {
    return current.backgroundPadding.top;
  }
};

var evaluateProps = function (props) {
  /* Potential evaluated props are
    1) text
    2) style
    3) everything else
  */
  var text = getContent(props.text, props);
  var style = getStyles(props.style, _assign({}, props, {
    text: text
  }));
  var id = Helpers.evaluateProp(props.id, props);
  return _assign({}, props, {
    style: style,
    text: text,
    id: id
  });
};

var getCalculatedProps = function (props) {
  var lineHeight = getLineHeight(props);
  var direction = props.direction ? Helpers.evaluateProp(props.direction, props) : "inherit";
  var textAnchor = props.textAnchor ? Helpers.evaluateProp(props.textAnchor, props) : "start";
  var verticalAnchor = props.verticalAnchor ? Helpers.evaluateProp(props.verticalAnchor, props) : "middle";
  var dx = props.dx ? Helpers.evaluateProp(props.dx, props) : 0;
  var dy = getDy(props, lineHeight);
  var transform = getTransform(props);
  var x = props.x !== undefined ? props.x : getPosition(props, "x");
  var y = props.y !== undefined ? props.y : getPosition(props, "y");
  var backgroundPadding = getBackgroundPadding(props);
  return {
    lineHeight: lineHeight,
    direction: direction,
    textAnchor: textAnchor,
    verticalAnchor: verticalAnchor,
    dx: dx,
    dy: dy,
    backgroundPadding: backgroundPadding,
    transform: transform,
    x: x,
    y: y
  };
};

var renderLabel = function (props, calculatedProps, tspanValues) {
  var inline = props.inline,
      className = props.className,
      title = props.title,
      events = props.events,
      direction = props.direction,
      text = props.text;
  var textAnchor = calculatedProps.textAnchor,
      dx = calculatedProps.dx,
      dy = calculatedProps.dy,
      transform = calculatedProps.transform,
      x = calculatedProps.x,
      y = calculatedProps.y;

  var textProps = _objectSpread({
    key: "text"
  }, events, {
    direction: direction,
    dx: dx,
    x: x,
    y: y + dy,
    transform: transform,
    className: className,
    title: title,
    desc: Helpers.evaluateProp(props.desc, props),
    tabIndex: Helpers.evaluateProp(props.tabIndex, props),
    id: props.id
  });

  var tspans = text.map(function (line, i) {
    var currentStyle = tspanValues[i].style;
    var tspanProps = {
      key: "".concat(props.id, "-key-").concat(i),
      x: !inline ? props.x : undefined,
      dx: dx + tspanValues[i].backgroundPadding.left,
      dy: getTSpanDy(tspanValues, props, i),
      textAnchor: currentStyle.textAnchor || textAnchor,
      style: currentStyle,
      children: line
    };
    return React.cloneElement(props.tspanComponent, tspanProps);
  });
  return React.cloneElement(props.textComponent, textProps, tspans);
};

var VictoryLabel = function (props) {
  props = evaluateProps(props);

  if (props.text === null || props.text === undefined) {
    return null;
  }

  var calculatedProps = getCalculatedProps(props);
  var _props = props,
      text = _props.text,
      style = _props.style,
      capHeight = _props.capHeight;
  var backgroundPadding = calculatedProps.backgroundPadding,
      lineHeight = calculatedProps.lineHeight;
  var tspanValues = text.map(function (line, i) {
    var currentStyle = style[i] || style[0];
    var capHeightPx = TextSize.convertLengthToPixels("".concat(capHeight, "em"), currentStyle.fontSize);
    var currentLineHeight = lineHeight[i] || lineHeight[0];
    return {
      style: currentStyle,
      fontSize: currentStyle.fontSize || defaultStyles.fontSize,
      capHeight: capHeightPx,
      text: line,
      lineHeight: currentLineHeight,
      backgroundPadding: getBackgroundPaddingProp(i, backgroundPadding)
    };
  });
  var label = renderLabel(props, calculatedProps, tspanValues);

  if (props.backgroundStyle) {
    var backgroundElement = getBackgroundElement(props, calculatedProps, tspanValues);
    var children = [backgroundElement, label];
    var backgroundWithLabel = React.cloneElement(props.groupComponent, {}, children);
    return props.renderInPortal ? React.createElement(VictoryPortal, null, backgroundWithLabel) : backgroundWithLabel;
  }

  return props.renderInPortal ? React.createElement(VictoryPortal, null, label) : label;
};

VictoryLabel.displayName = "VictoryLabel";
VictoryLabel.role = "label";
VictoryLabel.defaultStyles = defaultStyles;
VictoryLabel.propTypes = {
  active: PropTypes.bool,
  angle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  backgroundComponent: PropTypes.element,
  backgroundPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  backgroundStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  capHeight: PropTypes.oneOfType([PropTypes.string, CustomPropTypes.nonNegative, PropTypes.func]),
  className: PropTypes.string,
  data: PropTypes.array,
  datum: PropTypes.any,
  desc: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  direction: PropTypes.oneOf(["rtl", "ltr", "inherit"]),
  dx: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),
  dy: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),
  events: PropTypes.object,
  groupComponent: PropTypes.element,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inline: PropTypes.bool,
  labelPlacement: PropTypes.oneOf(["parallel", "perpendicular", "vertical"]),
  lineHeight: PropTypes.oneOfType([PropTypes.string, CustomPropTypes.nonNegative, PropTypes.func, PropTypes.array]),
  origin: PropTypes.shape({
    x: CustomPropTypes.nonNegative,
    y: CustomPropTypes.nonNegative
  }),
  polar: PropTypes.bool,
  renderInPortal: PropTypes.bool,
  scale: PropTypes.shape({
    x: CustomPropTypes.scale,
    y: CustomPropTypes.scale
  }),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func, PropTypes.array]),
  textAnchor: PropTypes.oneOfType([PropTypes.oneOf(["start", "middle", "end", "inherit"]), PropTypes.func]),
  textComponent: PropTypes.element,
  title: PropTypes.string,
  transform: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
  tspanComponent: PropTypes.element,
  verticalAnchor: PropTypes.oneOfType([PropTypes.oneOf(["start", "middle", "end"]), PropTypes.func]),
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
VictoryLabel.defaultProps = {
  backgroundComponent: React.createElement(Rect, null),
  groupComponent: React.createElement("g", null),
  direction: "inherit",
  textComponent: React.createElement(Text, null),
  tspanComponent: React.createElement(TSpan, null),
  capHeight: 0.71,
  // Magic number from d3.
  lineHeight: 1
};
export default VictoryLabel;