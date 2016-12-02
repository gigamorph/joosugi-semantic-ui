import AnnotationExplorerDialog from '../src/js/annotation-explorer-dialog';
import AnnotationSource from './annotation-source';

jQuery(document).ready(function() {
  let layers, canvasRanges, annotations;
  
  const p1 = getCanvasRanges();
  
  Promise.all([p1]).then(function(values) {
    const options = {
      canvases: values[0]
    };
    explore(options);
  });
});

function explore(options) {
  const annoSource = new AnnotationSource();
  const explorerDialog = new AnnotationExplorerDialog({
    appendTo: jQuery('body'),
    dataSource: annoSource,
    canvases: options.canvases,
    defaultCanvas: 'http://example.org/canvas/01/01',
    onSelect: function(annotation) {
      jQuery('#output').text(JSON.stringify(annotation, null, 2));
    }
  });
  jQuery('#open').click(function() {
    jQuery('#output').empty();
    explorerDialog.open();
  });
}

function getCanvasRanges() {
  return new Promise(function(resolve, reject) {
    jQuery.getJSON('/examples/data/canvas-ranges.json', function(data) {
      resolve(data);
    });
  });
}

