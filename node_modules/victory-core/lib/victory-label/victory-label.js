"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _victoryPortal = _interopRequireDefault(require("../victory-portal/victory-portal"));

var _rect = _interopRequireDefault(require("../victory-primitives/rect"));

var _propTypes2 = _interopRequireDefault(require("../victory-util/prop-types"));

var _helpers = _interopRequireDefault(require("../victory-util/helpers"));

var _labelHelpers = _interopRequireDefault(require("../victory-util/label-helpers"));

var _style = _interopRequireDefault(require("../victory-util/style"));

var _log = _interopRequireDefault(require("../victory-util/log"));

var _textsize = _interopRequireDefault(require("../victory-util/textsize"));

var _tspan = _interopRequireDefault(require("../victory-primitives/tspan"));

var _text = _interopRequireDefault(require("../victory-primitives/text"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

  var scaledPoint = _helpers.default.scalePoint(props, props.datum);

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
      _log.default.warn("fontSize should be expressed as a number of pixels");

      return defaultStyles.fontSize;
    }
  }

  return defaultStyles.fontSize;
};

var getStyles = function (style, props) {
  var getSingleStyle = function (s) {
    s = s ? (0, _defaults2.default)({}, s, defaultStyles) : defaultStyles;

    var baseStyles = _helpers.default.evaluateStyle(s, props);

    return (0, _assign2.default)({}, baseStyles, {
      fontSize: getFontSize(baseStyles)
    });
  };

  return Array.isArray(style) && !(0, _isEmpty2.default)(style) ? style.map(function (s) {
    return getSingleStyle(s);
  }) : [getSingleStyle(style)];
};

var getHeight = function (props, type) {
  return _helpers.default.evaluateProp(props[type], props);
};

var getLineHeight = function (props) {
  var lineHeight = getHeight(props, "lineHeight");

  if (Array.isArray(lineHeight)) {
    return (0, _isEmpty2.default)(lineHeight) ? [1] : lineHeight;
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
      return _helpers.default.evaluateProp(line, props);
    });
  }

  var child = _helpers.default.evaluateProp(text, props);

  if (child === undefined || child === null) {
    return undefined;
  }

  return Array.isArray(child) ? child : "".concat(child).split("\n");
};

var getDy = function (props, lineHeight) {
  var style = Array.isArray(props.style) ? props.style[0] : props.style;
  lineHeight = lineHeight[0];
  var fontSize = style.fontSize;
  var dy = props.dy ? _helpers.default.evaluateProp(props.dy, props) : 0;
  var length = props.inline ? 1 : props.text.length;
  var capHeight = getHeight(props, "capHeight");
  var verticalAnchor = style.verticalAnchor || props.verticalAnchor;
  var anchor = verticalAnchor ? _helpers.default.evaluateProp(verticalAnchor, props) : "middle";

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
  var defaultAngle = polar ? _labelHelpers.default.getPolarAngle(props) : 0;
  var baseAngle = style.angle === undefined ? props.angle : style.angle;
  var angle = baseAngle === undefined ? defaultAngle : baseAngle;
  var transform = props.transform || style.transform;

  var transformPart = transform && _helpers.default.evaluateProp(transform, props);

  var rotatePart = angle && {
    rotate: [angle, x, y]
  };
  return transformPart || angle ? _style.default.toTransformString(transformPart, rotatePart) : undefined;
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
      return _helpers.default.getPadding({
        backgroundPadding: backgroundPadding
      }, "backgroundPadding");
    });
  } else {
    return _helpers.default.getPadding(props, "backgroundPadding");
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
    return _textsize.default.approximateTextSize(tspan.text, tspan.style);
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
  return _react.default.cloneElement(backgroundComponent, (0, _defaults2.default)({}, backgroundComponent.props, backgroundProps));
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

    var labelSize = _textsize.default.approximateTextSize(current.text, current.style);

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
    return _react.default.cloneElement(backgroundComponent, (0, _defaults2.default)({}, backgroundComponent.props, backgroundProps));
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
  var style = getStyles(props.style, (0, _assign2.default)({}, props, {
    text: text
  }));

  var id = _helpers.default.evaluateProp(props.id, props);

  return (0, _assign2.default)({}, props, {
    style: style,
    text: text,
    id: id
  });
};

var getCalculatedProps = function (props) {
  var lineHeight = getLineHeight(props);
  var direction = props.direction ? _helpers.default.evaluateProp(props.direction, props) : "inherit";
  var textAnchor = props.textAnchor ? _helpers.default.evaluateProp(props.textAnchor, props) : "start";
  var verticalAnchor = props.verticalAnchor ? _helpers.default.evaluateProp(props.verticalAnchor, props) : "middle";
  var dx = props.dx ? _helpers.default.evaluateProp(props.dx, props) : 0;
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
    desc: _helpers.default.evaluateProp(props.desc, props),
    tabIndex: _helpers.default.evaluateProp(props.tabIndex, props),
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
    return _react.default.cloneElement(props.tspanComponent, tspanProps);
  });
  return _react.default.cloneElement(props.textComponent, textProps, tspans);
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

    var capHeightPx = _textsize.default.convertLengthToPixels("".concat(capHeight, "em"), currentStyle.fontSize);

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

    var backgroundWithLabel = _react.default.cloneElement(props.groupComponent, {}, children);

    return props.renderInPortal ? _react.default.createElement(_victoryPortal.default, null, backgroundWithLabel) : backgroundWithLabel;
  }

  return props.renderInPortal ? _react.default.createElement(_victoryPortal.default, null, label) : label;
};

VictoryLabel.displayName = "VictoryLabel";
VictoryLabel.role = "label";
VictoryLabel.defaultStyles = defaultStyles;
VictoryLabel.propTypes = {
  active: _propTypes.default.bool,
  angle: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  backgroundComponent: _propTypes.default.element,
  backgroundPadding: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.object, _propTypes.default.array]),
  backgroundStyle: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.array]),
  capHeight: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes2.default.nonNegative, _propTypes.default.func]),
  className: _propTypes.default.string,
  data: _propTypes.default.array,
  datum: _propTypes.default.any,
  desc: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
  direction: _propTypes.default.oneOf(["rtl", "ltr", "inherit"]),
  dx: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string, _propTypes.default.func]),
  dy: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string, _propTypes.default.func]),
  events: _propTypes.default.object,
  groupComponent: _propTypes.default.element,
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string, _propTypes.default.func]),
  index: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  inline: _propTypes.default.bool,
  labelPlacement: _propTypes.default.oneOf(["parallel", "perpendicular", "vertical"]),
  lineHeight: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes2.default.nonNegative, _propTypes.default.func, _propTypes.default.array]),
  origin: _propTypes.default.shape({
    x: _propTypes2.default.nonNegative,
    y: _propTypes2.default.nonNegative
  }),
  polar: _propTypes.default.bool,
  renderInPortal: _propTypes.default.bool,
  scale: _propTypes.default.shape({
    x: _propTypes2.default.scale,
    y: _propTypes2.default.scale
  }),
  style: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.array]),
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  text: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.func, _propTypes.default.array]),
  textAnchor: _propTypes.default.oneOfType([_propTypes.default.oneOf(["start", "middle", "end", "inherit"]), _propTypes.default.func]),
  textComponent: _propTypes.default.element,
  title: _propTypes.default.string,
  transform: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object, _propTypes.default.func]),
  tspanComponent: _propTypes.default.element,
  verticalAnchor: _propTypes.default.oneOfType([_propTypes.default.oneOf(["start", "middle", "end"]), _propTypes.default.func]),
  x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
};
VictoryLabel.defaultProps = {
  backgroundComponent: _react.default.createElement(_rect.default, null),
  groupComponent: _react.default.createElement("g", null),
  direction: "inherit",
  textComponent: _react.default.createElement(_text.default, null),
  tspanComponent: _react.default.createElement(_tspan.default, null),
  capHeight: 0.71,
  // Magic number from d3.
  lineHeight: 1
};
var _default = VictoryLabel;
exports.default = _default;