Template.link.events({
  'click .link': function() {
    Router.go('link', {slug: this.slug});
  }
});

Template.linkPage.events({
  'click .claim-owner': function (e,t) {
    e.preventDefault();
    Meteor.call('claimLinkOwner', this._id);
  }
});