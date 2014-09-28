Meteor.startup(function() {

  Links.update({}, {
    $set: {
      commentsCount: 0
    }
  });

  Meteor.setTimeout(function() {
    Comments.find({active: true}).forEach(function(comment) {
      incLinkCommentCount(comment.linkId);
    });
  }, 500);
});