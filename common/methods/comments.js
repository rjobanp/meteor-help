userCommentsForLink = function(userId, linkId) {
  return Comments.find({
    userId: userId,
    linkId: linkId,
    active: true
  });
};

removeComment = function(comment) {
  if (typeof comment !== 'object') {
    comment = Comments.findOne(comment);
  }

  return Comments.update(comment._id, {
    $set: {
      active: false
    }
  });
}

Meteor.methods({
  insertComment: function(params) {
    params.userId = Meteor.userId();

    var link = params.linkId && Links.findOne(params.linkId);
    return Meteor.user() && link && Comments.insert(params) && incLinkCommentCount(params.linkId);
  },
  updateComment: function(commentId, params) {
    var comment = Comments.findOne(commentId);

    return Meteor.user() && comment && (comment.commentOwner(Meteor.userId()) || Meteor.user().admin) && Comments.update(comment._id, params);
  },
  removeComment: function(commentId) {
    var comment = Comments.findOne(commentId);

    return Meteor.user() && comment && (comment.commentOwner(Meteor.userId()) || Meteor.user().admin) && removeComment(comment) && decLinkCommentCount(comment.linkId);
  }
});