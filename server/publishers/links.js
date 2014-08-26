Meteor.publish('userLinks', function() {
  if ( this.userId ) {
    return Links.find({
      ownerIds: this.userId,
      active: true
    });
  } else {
    this.ready();
  }
});

Meteor.publish('allLinks', function(params) {
  params = params || {};

  var findOptions = {
    sort: params.sort || [["rating.average", "desc"], ["rating.count", "desc"], ["difficulty.average", "asc"],
    limit: params.limit || 100,
    fields: {
      claimedOwnerIds: 0
    }
  };

  if ( params.skip )
    findOptions.skip = params.skip;

  return Links.find({
    active: true
  }, findOptions);
});