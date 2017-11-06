let logger = null;

export default class FacetSelector {
  constructor(options) {
    this.options = Object.assign({
      appendTo: null,
      title: null,
      items: [],

      // function that returns on object
      // { label: _LABEL_, value: _VALUE_ }
      parseItem: null,

      isLeaf: () => true,
      getChildren: null,
      onChange: () => null,
      logger: { debug: () => null, info: () => null, error: () => null }
    }, options);

    logger = this.options.logger;

    this.elem = jQuery('<div/>')
      .addClass('ui accordion')
      .html(template)
      .appendTo(this.options.appendTo);
    this.elem.find('.title').text(this.options.title);

    this.content = this.elem.find('.content');

    for (let item of this.options.items) {
      this.addItem(item, this.content);
    }

    this.elem.accordion({
      collapsible	: false,
      animateChildren: false,
      duration: 0,
      on: 'none'
    });

    this.elem.accordion('open', 0);
    this._value = null; // value of selected item
  }

  value() {
    return this._value;
  }

  setValue(value) {
    logger.debug('FacetSelector#setValue', value);
    if (this.findItemByValue(value)) {
      if (this._value !== value) {
        this._value = value;
        this.refresh();
        this.options.onChange(value);
      }
    } else {
      logger.error('FacetSelector#setValue failed for value', value);
    }
  }

  findItemByValue(value) {
    for (let item of this.content.find('.item')) {
      if (jQuery(item).data('item').value === value) {
        return true;
      }
    }
    return false;
  }

  refresh() {
    for (let item of this.content.find('.item')) {
      const $item = jQuery(item);
      if ($item.data('item').value === this._value) {
        $item.addClass('selected');
      } else {
        $item.removeClass('selected');
      }
    }
  }

  addLeaf(rawItem, appendTo) {
    //logger.debugg('FacetSelector#addLeaf item:', rawItem);
    const _this = this;
    const item = this.options.parseItem ? this.options.parseItem(rawItem) : rawItem;
    const elem = jQuery('<div/>')
      .addClass('item')
      .html(itemTemplate({label: item.label}));

    elem.data('item', item);
    elem.click(function() {
      const item = jQuery(this).data('item');
      if (item.value !== _this.value) {
        _this.setValue(item.value);
      }
    });
    appendTo.append(elem);
  }

  addItem(item, appendTo) {
    if (this.options.isLeaf(item)) {
      this.addLeaf(item, appendTo);
    } else {
      for (let child of this.options.getChildren(item)) {
        this.addItem(child, appendTo);
      }
    }
  }

  scrollToValue(value) {
    logger.debug('FacetSelector scrollToValue', value);
    const items = this.content.find('.item');
    let scrollTo = null;

    for (let item of items) {
      const elem = jQuery(item);
      if (elem.data('item').value === value) {
        scrollTo = elem;
        break;
      }
    }

    if (scrollTo) {
      console.log('SCROLL TO', scrollTo[0].outerHTML);
      scrollTo[0].scrollIntoView();
    }
  }
}

const template = Handlebars.compile([
  '<div class="title"></div>',
  '<div class="content">',
  '</div>'
].join(''));

 const itemTemplate = Handlebars.compile([
  '<a href="#">{{label}}</a>'
 ].join(''));