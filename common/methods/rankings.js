userRankingForLink = function(type, userId, linkId) {
  return Rankings.findOne({
    userId: userId,
    type: type
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
    var rankingId = Rankings.update(ranking._id, {$set: {value: params.newVal}});

    if ( rankingId ) {
      updateLinkRanking(ranking.linkId, ranking.type, ranking.value, params.newVal);
      return rankingId;
    }
  }
};

Meteor.methods(function() {
  insertRating: function(params) {
    params.userId = Meteor.userId();
    params.type = 'rating';

    return Meteor.user() && insertRanking(params);
  },
  insertDifficultyRanking: function(params) {
    params.userId = Meteor.userId();
    params.type = 'difficulty';

    return Meteor.user() && insertRanking(params);
  },
  updateRating: function(params) {
    params.userId = Meteor.userId();
    params.type = 'rating';

    return Meteor.user() && updateRanking(params);
  },
  updateDifficultyRanking: function(params) {
    params.userId = Meteor.userId();
    params.type = 'difficulty';

    return Meteor.user() && updateRanking(params);
  }
});