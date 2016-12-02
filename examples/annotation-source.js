import importPackage from '../src/js/import';
const util = importPackage('joosugi').annotationUtil;

// Dumb annotation endpoints
export default class AnnotationSource {
  getLayers() {
    return new Promise(function(resolve, reject) {
      jQuery.getJSON('/examples/data/layers.json', function(data) {
        resolve(data);
      });
    });
  }

  getAnnotations(canvasId) {
    return new Promise(function(resolve, reject) {
      jQuery.getJSON('/examples/data/annotations.json', function(data) {
        const annotations = [];
        for (let anno of data) {
          let targetCanvasIds = util.getTargetCanvasIds(anno, {deep: true, annotations: annotations});
          for (let targetCanvasId of targetCanvasIds) {
            if (targetCanvasId === canvasId) {
              annotations.push(anno);
            }
          }
        }
        resolve(annotations);
      });
    });
  }
}
