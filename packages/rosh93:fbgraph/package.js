Package.describe({
  summary: "Wrapper for fbgraph",
  version: "0.0.1"
});

Npm.depends({
  'fbgraph': '0.2.13'
});

Package.onUse(function(api) {
  api.add_files(['fbgraph.js'], 'server');
  api.export('FBGraph', 'server');
  api.versionsFrom('METEOR@0.9.3');
});