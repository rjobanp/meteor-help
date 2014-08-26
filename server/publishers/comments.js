Meteor.publish('linkComments', function(linkId) {
  var link = Links.findOne(linkId);

  if ( link && link.active ) {
    return link.comments();
  } else {
    this.ready();
  }
});