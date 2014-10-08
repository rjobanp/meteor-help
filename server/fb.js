var Fiber = Npm.require('fibers');

Meteor.startup(function() {
  FBGraph.setAccessToken("707486559339549|7f28abaf6a183d058ddca0fb167ba470");

  // Go through all links without an open graph id set and try to find it

  Links.find({
    openGraphId: {$exists: false}
  }).forEach(function(link) {

    FBGraph.get("?id="+link.url, {}, Meteor.bindEnvironment(function(err, res) {
      if ( res && res.og_object ) {
        Links.update(link._id, {
          $set: {
            openGraphId: res.og_object.id
          }
        });
      }
    }));

  });

});