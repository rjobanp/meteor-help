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

incLinkCommentCount = function(linkId) {
  return Links.update(linkId, {
    $inc: {
      commentsCount: 1
    }
  });
};

decLinkCommentCount = function(linkId) {
  return Links.update(linkId, {
    $inc: {
      commentsCount: -1
    }
  });
};

insertLink = function(params) {
  // check that link doesn't already exist

  if ( Links.findOne({url: params.url}) ) {
    return false;
  }
  
  return Links.insert(params);
}

removeLink = function(link) {
  if (typeof link !== 'object') {
    link = Links.findOne(link);
  }

  return Links.update(link._id, {
    $set: {
      active: false
    }
  });
}

Meteor.methods({
  insertLink: function(params) {
    if ( !Meteor.user().admin ) {
      params.ownerIds = [Meteor.userId()];
    }

    var linkId = Meteor.user() && insertLink(params);

    if ( Meteor.isServer && linkId ) {
      return setOpenGraphIdForLink(Links.findOne(linkId)) && linkId;
    } else {
      return linkId;
    }
  },
  updateLink: function(params) {
    var link = Links.findOne({slug: params.slug});

    var newParams = {
      $set: params
    }

    var linkId = Meteor.user() && link && (link.linkOwner(Meteor.user()) || Meteor.user().admin) && Links.update(link._id, newParams);
  
    if ( Meteor.isServer && linkId ) {
      return setOpenGraphIdForLink(Links.findOne(linkId)) && linkId;
    } else {
      return linkId;
    }
  },
  removeLink: function(linkId) {
    var link = Links.findOne(linkId);

    return Meteor.user() && link && (link.linkOwner(Meteor.userId()) || Meteor.user().admin) && removeLink(link);
  },
  claimLinkOwner: function(linkId) {
    return Meteor.user() && claimLinkOwner(linkId, Meteor.userId());
  },
  adminAddLinkOwner: function(linkId, ownerId) {
    return Meteor.user() && Meteor.user().admin && addLinkOwner(linkId, ownerId);
  }
});