Template.home.helpers({
  links: function() {
    var findQuery = {
      active: true
    };

    if ( Session.get('allLinks.types') ) {
      findQuery.types = { $in: Session.get('allLinks.types') };
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
    return Router.current().route.name === 'home' && Template.instance().showHomeMessage.get();
  }
});

Template.home.created = function() {
  this.showHomeMessage = new ReactiveVar(true);
}

Template.home.events({
  'click .close': function(e,t) {
    t.showHomeMessage.set(false);
  }
});