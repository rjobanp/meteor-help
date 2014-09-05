Rankings = new Meteor.Collection('rankings');

if (typeof Schema === 'undefined') {
  Schema = {};
}

Meteor.startup(function() {
  if ( Meteor.isServer ) {
    Rankings._ensureIndex({linkId: 1});
    Rankings._ensureIndex({userId: 1});
  }
});

Schema.Ranking = new SimpleSchema({
  userId: {
    type: String,
    autoValue: function() {
      return Meteor.userId();
    }
  },
  type: {
    type: String,
    allowedValues: ['rating', 'difficulty']
  },
  linkId: {
    type: String
  },
  value: {
    type: Number,
    allowedValues: [1,2,3,4,5]
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
  active: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return true;
      }
    }
  }
});

Rankings.attachSchema(Schema.Ranking);

Rankings.helpers({
  link: function() {
    return Links.findOne(this.linkId)
  }
});