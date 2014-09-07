userRankingForLink = function(type, userId, linkId) {
  return Rankings.findOne({
    userId: userId,
    type: type,
    linkId: linkId,
    active: true
  });
};

insertRanking = function(params) {
  if ( !userRankingForLink(params.type, params.userId, params.linkId) ) {
    var rankingId = Rankings.insert(params);

    if ( rankingId ) {
      addLinkRanking(params.linkId, params.type, params.value);
      return rankingId;
    }
  }
};

updateRanking = function(params) {
  var ranking = userRankingForLink(params.type, params.userId, params.linkId);
  if ( ranking ) {
    var rankingId = Rankings.update(ranking._id, {$set: {value: params.value}});

    if ( rankingId ) {
      updateLinkRanking(ranking.linkId, ranking.type, ranking.value, params.value);
      return rankingId;
    }
  }
};

Meteor.methods({
  insertRanking: function(params) {
    params.userId = Meteor.userId();

    return Meteor.user() && insertRanking(params);
  },
  updateRanking: function(params) {
    params.userId = Meteor.userId();

    return Meteor.user() && updateRanking(params);
  }
});