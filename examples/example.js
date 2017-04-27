import AnnotationExplorerDialog from '../src/js/annotation-explorer-dialog';
import AnnotationSource from './annotation-source';
import importPackage from '../src/js/import';
const AnnotationExplorer = importPackage('joosugi').AnnotationExplorer;

const logger = {
  debug: function(...args) { this.log('DEBUG', args); },
  info: function(...args) { this.log('INFO', args); },
  error: function(...args) { this.log('ERROR', args); },
  log: function(flag, args) {
    const newArgs = [flag].concat(args);
    console.log.apply(console, newArgs);
  }
};

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

async function explore(options) {
  const annoSource = new AnnotationSource();
  const annotationExplorer = new AnnotationExplorer({
    dataSource: annoSource,
    logger: logger
  });
  const layers = await annotationExplorer.getLayers();
  const explorerDialog = new AnnotationExplorerDialog({
    appendTo: jQuery('body'),
    annotationExplorer: annotationExplorer,
    canvases: options.canvases,
    defaultCanvasId: 'http://example.org/canvas/01/01',
    layers: layers,
    defaultLayerId: 'http://example.org/layer/transcription',
    onSelect: function(annotation) {
      jQuery('#output').text(JSON.stringify(annotation, null, 2));
    },
    logger: logger
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

