Meteor.publish('userRankings', function() {
  if ( this.userId ) {
    return Rankings.find({
      userId: this.userId,
      active: true
    });
  } else {
    this.ready();
  }
});