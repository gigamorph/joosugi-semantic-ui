import FacetSelector from './facet-selector';
import AnnotationPanel from './annotation-panel';

import importPackage from './import';
const joosugi = importPackage('joosugi');

export default class AnnotationExplorerDialog {
  
  /**
   * @param {object} elem a jQuery element
   */
  constructor(options) {
    const _this = this;
    
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
    this.annosPanel = new AnnotationPanel({
      appendTo: this.elem.find('.column.annos'),
      onChange: function(annotation) {
        _this.selectedAnnotation = annotation;
        _this.okButton.removeClass('disabled');
      }
    });
    
    this.okButton = this.elem.find('.ok');
    this.cancelButton = this.elem.find('.cancel');
    
    this.elem.modal({
      observeChanges: true,
      onApprove: function(elem) {
        console.log('approve');
        _this.onSelect(_this.selectedAnnotation);
      },
      onDeny: function(elem) {
        console.log('deny');
      },
      onHidden: function(elem) {
        console.log('hidden');
      }
    });
    
    this.canvasSelector = this.setupCanvasSelector();
    
    this.setupLayerSelector().then(function(selector) {
      _this.layerSelector = selector;
      if (_this.defaultCanvas) {
        _this.canvasSelector.setValue(_this.defaultCanvas);
      }
    });
    
    this.setupActions();
  }
  
  open() {
    this.elem.modal('show');
  }
  
  createElem(id) {
    const oldElem = jQuery('#' + id);
    if (oldElem.length > 0) {
      oldElem.remove();
    }
    return jQuery('<div/>')
      .addClass('ui modal')
      .attr('id', id)
      .html(template())
      .appendTo(this.appendTo);
  }
  
  setupCanvasSelector() {
    const _this = this;
    const selector = new FacetSelector({
      appendTo: this.elem.find('#facets'),
      title: 'Canvas',
      items: this.canvases,
      parseItem: item => ({label: item['label'], value: item['@id']}),
      isLeaf: function(item) {
        return item['@type'] !== 'sc:Range';
      },
      getChildren: function(item) {
        return (item.canvases instanceof Array ? item.canvases : [])
          .concat(item.members instanceof Array ? item.members : []);
      },
      onChange: function(selectedValue) {
        console.log('canvas select: ' + selectedValue);
        _this.refresh({
          canvasId: selectedValue
        });
      }
    });
    return selector;
  }
  
  setupLayerSelector() {
    const _this = this;
    return this.model.getLayers().then(function(layers) {
      return new FacetSelector({
        appendTo: _this.elem.find('#facets'),
        title: 'Layer',
        items: layers,
        parseItem: item => ({label: item.label, value: item['@id']}),
        onChange: function(selectedValue) {
          console.log('layer select: ' + selectedValue);
          _this.refresh({
            layerId: selectedValue
          });
        }
      });
    });
  }
  
  refresh(options) {
    console.log('AnnotationExplorerDialog#refresh');
    const _this = this;
    const canvasId = this.canvasSelector.value();
    const layerId = this.layerSelector.value();
    
    this.model.getAnnotations({
      canvasId: canvasId,
      layerId: layerId
    }).then(function(annotations) {
      _this.annosPanel.reload(annotations);
    });
  }

  reloadAnnotations() {
    console.log('AnnotationExplorerDialog#reloadAnnotations');
    const _this = this;
    
    this.annosPanel.empty();
    
    const canvasId = this.canvasSelector.value();
    
    let annotations = this.model.getAnnotations(canvasId);
    
    jQuery.each(annotations, function(index, annotation) {
      if (annoUtil.isAnnoOnCanvas(annotation) &&
        annotation.layerId === _this.currentLayerId)
      {
        const elem = _this.createAnnoElem(annotation);
        _this.annosPanel.append(elem);
      }
    });
  }
  
  setDimensions() {
    const winHeight = jQuery(window).height();
    const rest = 180; // estimate height of dialog minus height of content div
    const maxContentHeight =  (winHeight - rest) * 0.82;
    
    this.elem.css('margin-top', -(winHeight * 0.45));
    this.contentGrid.css('height', maxContentHeight);
    this.canvasesPanel.css('height', maxContentHeight * 0.46);
    this.layersPanel.css('height', maxContentHeight * 0.46);
  }

  scrollToCurrentCanvas() {
    const _this = this;
    const canvasElems = this.canvasesPanel.find('.canvas');
    let scrollTo = null;
    
    console.log('scrollToCurrentCanvas ' + canvasElems.length);
    
    canvasElems.each(function(index, canvasElem) {
      const elem = $(canvasElem);
      
      if (elem.data('canvasId') === _this.currentCanvasId) {
        scrollTo = elem;
        return false;
      }
    });
    
    if (scrollTo) {
      this.canvasesPanel.scrollTop(scrollTo.position().top + this.canvasesPanel.scrollTop() - 18);
    }
  }
  
  setupActions() {
    const _this = this;
    this.okButton.addClass('disabled');
    this.okButton.click(function() {
      console.log('ok clicked');
    });
    this.cancelButton.click(function() {
      _this.elem.modal('hide');
    });
  }
}

const template = Handlebars.compile([
  '<div class="header">Find Annotation',
  '</div>',
  '<div class="content">',
  '  <div class="ui grid">',
  '    <div id="facets" class="six wide column facets">',
  '    </div>',
  '    <div class="ten wide column annos">',
  '    </div>',
  '  </div>',
  '</div>',
  '<div class="actions">',
  '  <div class="ui ok button">Select</div>',
  '  <div class="ui cancel button">Cancel</div>',
  '</div>'
].join(''));

const canvasLinkTemplate = Handlebars.compile([
  '<a href="#">{{label}}</a>'
].join(''));

const layerLinkTemplate = Handlebars.compile([
  '<a href="#">{{label}}</a>'
].join(''));

const annotationTemplate = Handlebars.compile([
  '<div>{{{content}}}</div>'
].join(''));
