addLinkRanking = function(link, rankObjKey, rankVal) {
  if (typeof link !== 'object') {
    link = Links.findOne(link);
  }

  var rankObj = link[rankObjKey] && link[rankObjKey];

  if ( rankObj && rankVal ) {
    
    var updateParams = {
      $set: {},
      $inc: {}
    };

    updateParams.$set[rankObjKey + '.average'] = (rankObj.total + rankVal)/(rankObj.count + 1);
    updateParams.$inc[rankObjKey + '.total'] = rankVal;
    updateParams.$inc[rankObjKey + '.count'] = 1;

    return Links.update(link._id, updateParams);
  }
};

removeLinkRanking = function(link, rankObjKey, rankVal) {
  if (typeof link !== 'object') {
    link = Links.findOne(link);
  }

  var rankObj = link[rankObjKey] && link[rankObjKey];

  if ( rankObj && rankVal ) {
    
    var updateParams = {
      $set: {},
      $inc: {}
    };

    updateParams.$set[rankObjKey + '.average'] = (rankObj.total - rankVal)/(rankObj.count - 1);
    updateParams.$inc[rankObjKey + '.total'] = -1*rankVal;
    updateParams.$inc[rankObjKey + '.count'] = -1;

    return Links.update(link._id, updateParams);
  }
};

updateLinkRanking = function(link, rankObjKey, oldRankVal, rankVal) {
  if (typeof link !== 'object') {
    link = Links.findOne(link);
  }

  var rankObj = link[rankObjKey] && link[rankObjKey];

  if ( rankObj && rankVal ) {
    
    var updateParams = {
      $set: {},
      $inc: {}
    };

    updateParams.$set[rankObjKey + '.average'] = (rankObj.total + rankVal - oldRankVal)/(rankObj.count);
    updateParams.$inc[rankObjKey + '.total'] = rankVal - oldRankVal;

    return Links.update(link._id, updateParams);
  }
};

claimLinkOwner = function(linkId, ownerId) {
  return Links.update(linkId, {
    $addToSet: {
      claimedOwnerIds: ownerId
    }
  })
};

addLinkOwner = function(linkId, ownerId) {
  return Links.update(linkId, {
    $pull: {
      claimedOwnerIds: ownerId
    },
    $addToSet: {
      ownerIds: ownerId
    }
  });
};

Meteor.methods({
  insertLink: function(params) {
    params.ownerIds = [Meteor.userId()];

    return Meteor.user() && Links.insert(params);
  },
  adminInsertLink: function(params) {
    return Meteor.user() && Meteor.user().admin && Links.insert(params);
  },
  claimLinkOwner: function(linkId) {
    return Meteor.user() && claimLinkOwner(linkId, Meteor.userId());
  },
  adminAddLinkOwner: function(linkId, ownerId) {
    return Meteor.user() && Meteor.user().admin && addLinkOwner(linkId, ownerId);
  }
});