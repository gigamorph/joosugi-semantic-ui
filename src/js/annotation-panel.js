//import importPackage from './import';
//const util = importPackage('joosugi').annotationUtil;

const util = joosugi.annotationUtil;

export default class AnnotationPanel {
  constructor(options) {
    jQuery.extend(this, {
      appendTo: null,
      onChange: null
    }, options);

    this.elem = jQuery('<div/>')
      .addClass('joosugi_anno_panel')
      .html(template())
      .appendTo(this.appendTo);
  }
  
  value() {
    return this._value;
  }

  setValue(value) {
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

  findItemByValue(value) {
    for (let item of this.elem.find('.item')) {
      console.log('00: ' + value['@id']);
      console.log('01: ' + jQuery(item).data('item')['@id']);

      if (jQuery(item).data('item') === value) {
        return true;
      }
    }
    return false;
  }
  
  reload(annotations) {
    console.log('AnnotationPanel#reload');
    console.log(annotations);
    this.elem.empty();
    for (let anno of annotations) {
      this.elem.append(this.createItem(anno));
    }
  }
  
  refresh() {
    for (let item of this.elem.find('.item')) {
      const $item = jQuery(item);
      console.log('0: ' + this._value['@id']);
      console.log('1: ' + $item.data('item')['@id']);
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
  '<div>{{{content}}}</div>'
].join(''));
