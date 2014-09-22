Links = new Mongo.Collection('links');

if (typeof Schema === 'undefined') {
  Schema = {};
}

Meteor.startup(function() {
  if ( Meteor.isServer ) {
    Links._ensureIndex({slug: 1});
    Links._ensureIndex({types: 1});
    Links._ensureIndex({types: 1, 'rating.average': -1});
    Links._ensureIndex({types: 1, 'rating.count': -1});
    Links._ensureIndex({types: 1, 'difficulty.average': -1});
    Links._ensureIndex({'rating.average': -1});
    Links._ensureIndex({'rating.count': -1});
    Links._ensureIndex({'difficulty.average': 1});
    Links._ensureIndex({createdAt: -1});
  }
});

Schema.ImageObject = new SimpleSchema({
  profile: {
    type: String,
    optional: true
  }
});

Schema.RankObject = new SimpleSchema({
  average: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0
      }
    }
  },
  total: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0
      }
    }
  },
  count: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0
      }
    }
  }
});

createSlugFromName = function(name) {
  var slug = Urlify(name);

  while ( Links.findOne({slug: slug}) ) {
    slug = slug + String(Math.round(Math.random()*100));
  }

  return slug;
}

Schema.Link = new SimpleSchema({
  name: {
    type: String
  },
  slug: {
    type: String,
    autoValue: function() {
      var name = this.field("name");
      if (name.isSet) {
        if (this.isInsert) {
          return createSlugFromName(name.value);
        } else {
          this.unset();
        }
      } else {
        this.unset();
      }
    }
  },
  types: {
    type: [String],
    allowedValues: ['article', 'video', 'book', 'wiki', 'blog', 'news', 'tutorial', 'questions', 'course', 'list', 'slides'],
    minCount: 1
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },
  ownerIds: {
    type: [String],
    optional: true
  },
  claimedOwnerIds: {
    type: [String],
    autoValue: function() {
      if (this.isInsert) {
        return [];
      }
    }
  },
  description: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return +moment();
      } else if (this.isUpsert) {
        return {$setOnInsert: +moment()};
      } else {
        this.unset();
      }
    }
  },
  updatedAt: {
    type: Number,
    autoValue: function() {
      if (this.isUpdate) {
        return +moment();
      }
    },
    denyInsert: true,
    optional: true
  },
  images: {
    type: Schema.ImageObject,
    optional: true
  },
  active: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return true;
      }
    }
  },
  noLongerRelevant: {
    type: Boolean,
    optional: true
  },
  tags: {
    type: [String],
    allowedValues: ['paid-content', 'video-content', 'email-list', 'audio-content'],
    optional: true
  },
  rating: {
    type: Schema.RankObject
  },
  difficulty: {
    type: Schema.RankObject
  }
});

Links.attachSchema(Schema.Link);

Links.helpers({
  userRating: function() {
    return userRankingForLink('rating', Meteor.userId(), this._id);
  },
  userDifficulty: function() {
    return userRankingForLink('difficulty', Meteor.userId(), this._id);
  },
  userComments: function() {
    return userCommentsForLink(Meteor.userId(), this._id);
  },
  comments: function() {
    return Comments.find({
      linkId: this._id,
      active: true
    }, {
      sort: [['createdAt', "desc"]]
    });
  },
  rankings: function() {
    return Rankings.find({
      linkId: this._id,
      active: true
    });
  },
  linkOwner: function(user) {
    if ( user === undefined ) {
      user =  Meteor.user();
    }
    return user && this.ownerIds.indexOf(user._id) > -1;
  },
  claimedLinkOwner: function(user) {
    if ( user === undefined ) {
      user =  Meteor.user();
    }
    return user && this.claimedOwnerIds.indexOf(user._id) > -1;
  }
});