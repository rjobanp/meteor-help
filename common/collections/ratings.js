Rankings = new Meteor.Collection('rankings');

if (typeof Schema === 'undefined')
  Schema = {};

Schema.Ranking = new SimpleSchema({
  userId: {
    type: String
  },
  type: {
    type: String,
    allowedValues: ['rating', 'difficulty']
  },
  linkId: {
    type: String
  },
  rating: {
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
  active: {
    type: Boolean
  }
});

Rankings.attachSchema(Schema.Ranking);