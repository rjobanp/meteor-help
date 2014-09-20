Template.home.helpers({
  links: function() {
    var findQuery = {
      active: true
    };

    if ( Session.get('allLinks.types') ) {
      findQuery.types = { $in: Session.get('allLinks.types') };
    }

    if ( Session.get('allLinks.nameRegex') ) {
      findQuery.name = { $regex: Session.get('allLinks.nameRegex'), $options: 'i' };
    }

    var findOptions = {
      sort: Session.get('allLinks.sort') || [["rating.average", "desc"], ["rating.count", "desc"], ["difficulty.average", "asc"]],
      limit: Session.get('allLinks.limit') || 100,
      fields: {
        claimedOwnerIds: 0
      }
    };

    if ( Session.get('allLinks.skip') ) {
      findOptions.skip = Session.get('allLinks.skip');
    }

    return Links.find(findQuery, findOptions);
  },
  showHomeMessage: function() {
    return Router.current().route.name === 'home' && Session.get('showHomeMessage');
  }
});

Meteor.startup(function() {
  Session.set('showHomeMessage', true);
});

Template.home.events({
  'click .close': function(e,t) {
    Session.set('showHomeMessage', false);
  }
});