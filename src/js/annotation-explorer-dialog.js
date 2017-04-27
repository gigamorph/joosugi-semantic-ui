import FacetSelector from './facet-selector';
import AnnotationPanel from './annotation-panel';

let logger = null;

export default class AnnotationExplorerDialog {

  /**
   * @param {object} elem a jQuery element
   */
  constructor(options) {
    this.options = Object.assign({
      appendTo: null,
      annotationExplorer: null,
      canvases: [], // canvas IDs or ranges
      defaultCanvasId: null, // ID of default canvas to select
      layers: [],
      defaultLayerId: null, // ID of default layer to select
      onSelect: null,
      logger: { debug: () => null, info: () => null, error: () => null }
    }, options);

    logger = this.options.logger;
    logger.debug('AnnotationExplorerDialog#constructor this.options:', this.options);

    this.id = 'joosugi_anno_explorer_dialog';
    this.elem = this.createElem(this.id);
    this.annosPanel = new AnnotationPanel({
      appendTo: this.elem.find('.column.annos'),
      onChange: annotation => {
        this.selectedAnnotation = annotation;
        this.okButton.removeClass('disabled');
      }
    });

    this.okButton = this.elem.find('.ok');
    this.cancelButton = this.elem.find('.cancel');

    this.elem.modal({
      observeChanges: true,
      onApprove: elem => {
        this.options.onSelect(this.selectedAnnotation);
      },
      onDeny: elem => {
      },
      onHidden: elem => {
      }
    });

    this.canvasSelector = this.setupCanvasSelector();
    this.layerSelector = this.setupLayerSelector();

    const canvasId = this.options.defaultCanvasId || this.options.canvases[0]['@id'];
    this.canvasSelector.setValue(canvasId);

    setTimeout(() => {
      this.canvasSelector.scrollToValue(canvasId);
    }, 0);

    const layerId = this.options.defaultLayerId || this.options.layers[0]['@id'];
    this.layerSelector.setValue(layerId);
    this.layerSelector.scrollToValue(layerId);

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
      .appendTo(this.options.appendTo);
  }

  setupCanvasSelector() {
    const selector = new FacetSelector({
      appendTo: this.elem.find('#facets'),
      title: 'Canvas',
      items: this.options.canvases,
      parseItem: item => ({label: item['label'], value: item['@id']}),
      isLeaf: function(item) {
        return item['@type'] !== 'sc:Range';
      },
      getChildren: function(item) {
        return (item.canvases instanceof Array ? item.canvases : [])
          .concat(item.members instanceof Array ? item.members : []);
      },
      onChange: selectedValue => {
        logger.debug('AnnotationExplorerDialog canvas selected:', selectedValue);
        this.refresh();
      },
      logger: logger
    });
    return selector;
  }

  setupLayerSelector() {
    return new FacetSelector({
      appendTo: this.elem.find('#facets'),
      title: 'Layer',
      items: this.options.layers,
      parseItem: item => ({label: item.label, value: item['@id']}),
      onChange: selectedValue => {
        logger.debug('AnnotationExplorerDialog layer selected:', selectedValue);
        this.refresh();
      },
      logger: logger
    });
  }

  async refresh() {
    const canvasId = this.canvasSelector.value();
    const layerId = this.layerSelector.value();
    logger.debug('AnnotationExplorerDialog#refresh', canvasId, layerId);

    if (!canvasId || !layerId) {
      logger.debug('AnnotationExplorerDialog#refresh skipping...');
      return;
    }

    this.annosPanel.showPlaceHolderText('Retrieving annotations...');
    const annotations = await this.options.annotationExplorer.getAnnotations({
      canvasId: canvasId,
      layerId: layerId
    });
    this.annosPanel.reload(annotations);
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

    logger.debug('AnnotationExplorerDialog scrollToCurrentCanvas', canvasElems.length);

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
