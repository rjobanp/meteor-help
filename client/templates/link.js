Template.linkPage.events({
  'click .claim-owner': function (e,t) {
    e.preventDefault();
    Meteor.call('claimLinkOwner', this._id);
  }
});

Template.linkPage.created = function() {
  document.title = this.data.name + ' - ' + 'Meteor Help';
}

Template.linkPage.destroyed = function() {
  document.title = 'Meteor Help';
}

Template.linkPage.helpers({
  encodedUrl: function() {
    return encodeURI('http://meteorhelp.com/l/' + this.slug);
  },
  encodedName: function() {
    return encodeURIComponent(this.name);
  },
  encodedBlurb: function() {
    return encodeURIComponent('Check out "' + this.name + '" on @MeteorHelp !');
  }
});