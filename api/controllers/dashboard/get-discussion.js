module.exports = {


  friendlyName: 'Get discussion',


  description: 'Get the historical messages for a specific discussion.',


  inputs: {

    idDiscussion:{
      type:'string'
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided user is invalid.',
    },

  },


  fn: async function (inputs, exits) {

    var userDiscussionRecord = await UserDiscussion.findOne({
      where:{userId:this.req.me.id, discussionId:inputs.idDiscussion}
    });


    if (!userDiscussionRecord) {
      throw 'invalid';
    }
    else {
      var discussion = await Discussion.findOne({
        id:inputs.idDiscussion
      })
      .populate('messages')
      .intercept({name: 'UsageError'}, 'invalid');

      return exits.success({discussion:discussion});

    }
  }


};
