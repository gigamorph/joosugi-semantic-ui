// joosugi-semantic-ui DEV version 0.1.0
// Build: Tue Jan 24 2017 13:03:03 GMT-0500 (EST)

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _annotationExplorerDialog = __webpack_require__(2);

	var _annotationExplorerDialog2 = _interopRequireDefault(_annotationExplorerDialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(5);

	window.joosugiUI = {
	  AnnotationExplorerDialog: _annotationExplorerDialog2.default
	};

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _facetSelector = __webpack_require__(3);

	var _facetSelector2 = _interopRequireDefault(_facetSelector);

	var _annotationPanel = __webpack_require__(4);

	var _annotationPanel2 = _interopRequireDefault(_annotationPanel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//import importPackage from './import';
	//const joosugi = importPackage('joosugi');

	var AnnotationExplorerDialog = function () {

	  /**
	   * @param {object} elem a jQuery element
	   */
	  function AnnotationExplorerDialog(options) {
	    _classCallCheck(this, AnnotationExplorerDialog);

	    var _this = this;

	    jQuery.extend(this, {
	      appendTo: null,
	      dataSource: null,
	      canvases: null, // canvas IDs or ranges
	      defaultCanvas: null, // ID of default canvas to select
	      onSelect: null
	    }, options);

	    if (!this.model) {
	      this.model = new joosugi.AnnotationExplorer({
	        dataSource: this.dataSource
	      });
	    }

	    this.id = 'joosugi_anno_explorer_dialog';
	    this.elem = this.createElem(this.id);
	    this.annosPanel = new _annotationPanel2.default({
	      appendTo: this.elem.find('.column.annos'),
	      onChange: function onChange(annotation) {
	        _this.selectedAnnotation = annotation;
	        _this.okButton.removeClass('disabled');
	      }
	    });

	    this.okButton = this.elem.find('.ok');
	    this.cancelButton = this.elem.find('.cancel');

	    this.elem.modal({
	      observeChanges: true,
	      onApprove: function onApprove(elem) {
	        console.log('approve');
	        _this.onSelect(_this.selectedAnnotation);
	      },
	      onDeny: function onDeny(elem) {
	        console.log('deny');
	      },
	      onHidden: function onHidden(elem) {
	        console.log('hidden');
	      }
	    });

	    this.canvasSelector = this.setupCanvasSelector();

	    this.setupLayerSelector().then(function (selector) {
	      _this.layerSelector = selector;
	      if (_this.defaultCanvas) {
	        _this.canvasSelector.setValue(_this.defaultCanvas);
	      }
	    });

	    this.setupActions();
	  }

	  _createClass(AnnotationExplorerDialog, [{
	    key: 'open',
	    value: function open() {
	      this.elem.modal('show');
	    }
	  }, {
	    key: 'createElem',
	    value: function createElem(id) {
	      var oldElem = jQuery('#' + id);
	      if (oldElem.length > 0) {
	        oldElem.remove();
	      }
	      return jQuery('<div/>').addClass('ui modal').attr('id', id).html(template()).appendTo(this.appendTo);
	    }
	  }, {
	    key: 'setupCanvasSelector',
	    value: function setupCanvasSelector() {
	      var _this = this;
	      var selector = new _facetSelector2.default({
	        appendTo: this.elem.find('#facets'),
	        title: 'Canvas',
	        items: this.canvases,
	        parseItem: function parseItem(item) {
	          return { label: item['label'], value: item['@id'] };
	        },
	        isLeaf: function isLeaf(item) {
	          return item['@type'] !== 'sc:Range';
	        },
	        getChildren: function getChildren(item) {
	          return (item.canvases instanceof Array ? item.canvases : []).concat(item.members instanceof Array ? item.members : []);
	        },
	        onChange: function onChange(selectedValue) {
	          console.log('canvas select: ' + selectedValue);
	          _this.refresh({
	            canvasId: selectedValue
	          });
	        }
	      });
	      return selector;
	    }
	  }, {
	    key: 'setupLayerSelector',
	    value: function setupLayerSelector() {
	      var _this = this;
	      return this.model.getLayers().then(function (layers) {
	        return new _facetSelector2.default({
	          appendTo: _this.elem.find('#facets'),
	          title: 'Layer',
	          items: layers,
	          parseItem: function parseItem(item) {
	            return { label: item.label, value: item['@id'] };
	          },
	          onChange: function onChange(selectedValue) {
	            console.log('layer select: ' + selectedValue);
	            _this.refresh({
	              layerId: selectedValue
	            });
	          }
	        });
	      });
	    }
	  }, {
	    key: 'refresh',
	    value: function refresh(options) {
	      console.log('AnnotationExplorerDialog#refresh');
	      var _this = this;
	      var canvasId = this.canvasSelector.value();
	      var layerId = this.layerSelector.value();

	      this.model.getAnnotations({
	        canvasId: canvasId,
	        layerId: layerId
	      }).then(function (annotations) {
	        _this.annosPanel.reload(annotations);
	      });
	    }
	  }, {
	    key: 'setDimensions',
	    value: function setDimensions() {
	      var winHeight = jQuery(window).height();
	      var rest = 180; // estimate height of dialog minus height of content div
	      var maxContentHeight = (winHeight - rest) * 0.82;

	      this.elem.css('margin-top', -(winHeight * 0.45));
	      this.contentGrid.css('height', maxContentHeight);
	      this.canvasesPanel.css('height', maxContentHeight * 0.46);
	      this.layersPanel.css('height', maxContentHeight * 0.46);
	    }
	  }, {
	    key: 'scrollToCurrentCanvas',
	    value: function scrollToCurrentCanvas() {
	      var _this = this;
	      var canvasElems = this.canvasesPanel.find('.canvas');
	      var scrollTo = null;

	      console.log('scrollToCurrentCanvas ' + canvasElems.length);

	      canvasElems.each(function (index, canvasElem) {
	        var elem = $(canvasElem);

	        if (elem.data('canvasId') === _this.currentCanvasId) {
	          scrollTo = elem;
	          return false;
	        }
	      });

	      if (scrollTo) {
	        this.canvasesPanel.scrollTop(scrollTo.position().top + this.canvasesPanel.scrollTop() - 18);
	      }
	    }
	  }, {
	    key: 'setupActions',
	    value: function setupActions() {
	      var _this = this;
	      this.okButton.addClass('disabled');
	      this.okButton.click(function () {
	        console.log('ok clicked');
	      });
	      this.cancelButton.click(function () {
	        _this.elem.modal('hide');
	      });
	    }
	  }]);

	  return AnnotationExplorerDialog;
	}();

	exports.default = AnnotationExplorerDialog;


	var template = Handlebars.compile(['<div class="header">Find Annotation', '</div>', '<div class="content">', '  <div class="ui grid">', '    <div id="facets" class="six wide column facets">', '    </div>', '    <div class="ten wide column annos">', '    </div>', '  </div>', '</div>', '<div class="actions">', '  <div class="ui ok button">Select</div>', '  <div class="ui cancel button">Cancel</div>', '</div>'].join(''));

	var canvasLinkTemplate = Handlebars.compile(['<a href="#">{{label}}</a>'].join(''));

	var layerLinkTemplate = Handlebars.compile(['<a href="#">{{label}}</a>'].join(''));

	var annotationTemplate = Handlebars.compile(['<div>{{{content}}}</div>'].join(''));

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FacetSelector = function () {
	  function FacetSelector(options) {
	    _classCallCheck(this, FacetSelector);

	    jQuery.extend(this, {
	      appendTo: null,
	      title: null,
	      items: [],

	      // function that returns on object
	      // { label: _LABEL_, value: _VALUE_ }
	      parseItem: null,

	      isLeaf: function isLeaf() {
	        return true;
	      },
	      getChildren: null,
	      onChange: function onChange() {}
	    }, options);

	    this.elem = jQuery('<div/>').addClass('ui accordion').html(template).appendTo(this.appendTo);
	    this.elem.find('.title').text(this.title);

	    this.content = this.elem.find('.content');

	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var item = _step.value;

	        this.addItem(item, this.content);
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }

	    this.elem.accordion('open', 0);

	    this._value = null; // value of selected item
	  }

	  _createClass(FacetSelector, [{
	    key: 'value',
	    value: function value() {
	      return this._value;
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue(value) {
	      if (this.findItemByValue(value)) {
	        if (this._value !== value) {
	          this._value = value;
	          this.refresh();
	          this.onChange(value);
	        }
	      } else {
	        console.log('FacetSelector#setValue failed for value: ' + value);
	      }
	    }
	  }, {
	    key: 'findItemByValue',
	    value: function findItemByValue(value) {
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = this.content.find('.item')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var item = _step2.value;

	          if (jQuery(item).data('item').value === value) {
	            return true;
	          }
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      return false;
	    }
	  }, {
	    key: 'refresh',
	    value: function refresh() {
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = this.content.find('.item')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var item = _step3.value;

	          var $item = jQuery(item);
	          if ($item.data('item').value === this._value) {
	            $item.addClass('selected');
	          } else {
	            $item.removeClass('selected');
	          }
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'addLeaf',
	    value: function addLeaf(rawItem, appendTo) {
	      //console.log('FacetSelector#addLeaf item:', JSON.stringify(rawItem));
	      var _this = this;
	      var item = this.parseItem ? this.parseItem(rawItem) : rawItem;
	      var elem = jQuery('<div/>').addClass('item').html(itemTemplate({ label: item.label }));

	      elem.data('item', item);
	      elem.click(function () {
	        var item = jQuery(this).data('item');
	        if (item.value !== _this.value) {
	          _this.setValue(item.value);
	        }
	      });
	      appendTo.append(elem);
	    }
	  }, {
	    key: 'addItem',
	    value: function addItem(item, appendTo) {
	      if (this.isLeaf(item)) {
	        this.addLeaf(item, appendTo);
	      } else {
	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	          for (var _iterator4 = this.getChildren(item)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	            var child = _step4.value;

	            this.addItem(child, appendTo);
	          }
	        } catch (err) {
	          _didIteratorError4 = true;
	          _iteratorError4 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	              _iterator4.return();
	            }
	          } finally {
	            if (_didIteratorError4) {
	              throw _iteratorError4;
	            }
	          }
	        }
	      }
	    }
	  }]);

	  return FacetSelector;
	}();

	exports.default = FacetSelector;


	var template = Handlebars.compile(['<div class="title"></div>', '<div class="content">', '</div>'].join(''));

	var itemTemplate = Handlebars.compile(['<a href="#">{{label}}</a>'].join(''));

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//import importPackage from './import';
	//const util = importPackage('joosugi').annotationUtil;

	var util = joosugi.annotationUtil;

	var AnnotationPanel = function () {
	  function AnnotationPanel(options) {
	    _classCallCheck(this, AnnotationPanel);

	    jQuery.extend(this, {
	      appendTo: null,
	      onChange: null
	    }, options);

	    this.elem = jQuery('<div/>').addClass('joosugi_anno_panel').html(template()).appendTo(this.appendTo);
	  }

	  _createClass(AnnotationPanel, [{
	    key: 'value',
	    value: function value() {
	      return this._value;
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue(value) {
	      if (this.findItemByValue(value)) {
	        if (this._value !== value) {
	          this._value = value;
	          this.refresh();
	          this.onChange(value);
	        }
	      } else {
	        console.log('AnnotationPanel#setValue failed for value: ' + value);
	      }
	    }
	  }, {
	    key: 'findItemByValue',
	    value: function findItemByValue(value) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.elem.find('.item')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var item = _step.value;

	          console.log('00: ' + value['@id']);
	          console.log('01: ' + jQuery(item).data('item')['@id']);

	          if (jQuery(item).data('item') === value) {
	            return true;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return false;
	    }
	  }, {
	    key: 'reload',
	    value: function reload(annotations) {
	      console.log('AnnotationPanel#reload');
	      console.log(annotations);
	      this.elem.empty();
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = annotations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var anno = _step2.value;

	          this.elem.append(this.createItem(anno));
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'refresh',
	    value: function refresh() {
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = this.elem.find('.item')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var item = _step3.value;

	          var $item = jQuery(item);
	          console.log('0: ' + this._value['@id']);
	          console.log('1: ' + $item.data('item')['@id']);
	          if ($item.data('item')['@id'] === this._value['@id']) {
	            $item.addClass('selected');
	          } else {
	            $item.removeClass('selected');
	          }
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'createItem',
	    value: function createItem(annotation) {
	      var _this = this;
	      var elem = jQuery('<div/>').addClass('item').html(util.getText(annotation));
	      elem.data('item', annotation);
	      elem.click(function () {
	        _this.setValue(annotation);
	      });
	      return elem;
	    }
	  }]);

	  return AnnotationPanel;
	}();

	exports.default = AnnotationPanel;


	var template = Handlebars.compile(['<div>{{{content}}}</div>'].join(''));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./main.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./main.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "#joosugi_anno_explorer_dialog {\n  height: 80%;\n}\n#joosugi_anno_explorer_dialog .content {\n  height: 72%;\n}\n#joosugi_anno_explorer_dialog .content .grid {\n  height: 100%;\n}\n#joosugi_anno_explorer_dialog .column.facets {\n  height: 100%;\n  overflow-y: scroll;\n}\n#joosugi_anno_explorer_dialog .item.selected {\n  background-color: orange;\n}\n#joosugi_anno_explorer_dialog .item {\n  padding: 5px;\n  background-color: #eee;\n  border-radius: 5px;\n  margin: 2px;\n}\n#joosugi_anno_explorer_dialog .ui.accordion .content {\n  height: 120px;\n  overflow-y: scroll;\n}\n.joosugi_anno_panel {\n  height: 100%;\n  overflow-y: scroll;\n  border: solid 1px #bbb;\n  border-radius: 5px;\n  padding: 5px;\n}\n", ""]);

	// exports


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);