export default class FacetSelector {
  constructor(options) {
    jQuery.extend(this, {
      appendTo: null,
      title: null,
      items: [],
      
      // function that returns on object
      // { label: _LABEL_, value: _VALUE_ }
      parseItem: null, 
      
      isLeaf: () => true,
      getChildren: null,
      onChange: () => {}
    }, options);
    
    this.elem = jQuery('<div/>')
      .addClass('ui accordion')
      .html(template)
      .appendTo(this.appendTo);
    this.elem.find('.title').text(this.title);
    
    this.content = this.elem.find('.content');
    
    for (let item of this.items) {
      this.addItem(item, this.content);
    }
    this.elem.accordion('open', 0);
    
    this._value = null; // value of selected item
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
      console.log('FacetSelector#setValue failed for value: ' + value);
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
    //console.log('FacetSelector#addLeaf item:', JSON.stringify(rawItem));
    const _this = this;
    const item = this.parseItem ? this.parseItem(rawItem) : rawItem;
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
    if (this.isLeaf(item)) {
      this.addLeaf(item, appendTo);
    } else {
      for (let child of this.getChildren(item)) {
        this.addItem(child, appendTo);
      }
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