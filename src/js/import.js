require('exports?joosugi!../../node_modules/joosugi/dist/joosugi.js');

export default function importPackage(name) {
  switch (name) {
    case 'joosugi':
      return joosugi;
    default:
      return null;
  }
}
