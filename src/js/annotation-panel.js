//import importPackage from './import';
//const util = importPackage('joosugi').annotationUtil;

const util = joosugi.annotationUtil;
let logger = null;

export default class AnnotationPanel {
  constructor(options) {
    this.options = Object.assign({
      appendTo: null,
      onChange: null,
      logger: { debug: () => null, info: () => null, error: () => null }
    }, options);

    logger = this.options.logger;
    this.elem = jQuery('<div/>')
      .addClass('joosugi_anno_panel')
      .html(template())
      .appendTo(this.options.appendTo);
    this.placeHolder = this.elem.find('.place-holder');
    this.content = this.elem.find('.content');
  }

  value() {
    return this._value;
  }

  setValue(value) {
    if (this.findItemByValue(value)) {
      if (this._value !== value) {
        this._value = value;
        this.refresh();
        this.options.onChange(value);
      }
    } else {
      console.log('AnnotationPanel#setValue failed for value: ' + value);
    }
  }

  findItemByValue(value) {
    for (let item of this.content.find('.item')) {
      console.log('00: ' + value['@id']);
      console.log('01: ' + jQuery(item).data('item')['@id']);

      if (jQuery(item).data('item') === value) {
        return true;
      }
    }
    return false;
  }

  showPlaceHolderText(text) {
    this.placeHolder.text(text);
    this.placeHolder.show();
  }

  hidePlaceHolderText() {
    this.placeHolder.hide();
  }

  reload(annotations) {
    logger.debug('AnnotationPanel#reload', annotations);
    this.content.empty();
    for (let anno of annotations) {
      this.content.append(this.createItem(anno));
    }
    if (annotations.length > 0) {
      this.hidePlaceHolderText();
    } else {
      this.showPlaceHolderText('No annotations found');
    }
  }

  refresh() {
    for (let item of this.content.find('.item')) {
      const $item = jQuery(item);
      if ($item.data('item')['@id'] === this._value['@id']) {
        $item.addClass('selected');
      } else {
        $item.removeClass('selected');
      }
    }
  }

  createItem(annotation) {
    const _this = this;
    const elem = jQuery('<div/>')
      .addClass('item')
      .html(util.getText(annotation));
    elem.data('item', annotation);
    elem.click(function() {
      _this.setValue(annotation);
    });
    return elem;
  }
}

const template = Handlebars.compile([
  '<span class="place-holder"></span>',
  '<div class="content"></div>'
].join(''));
