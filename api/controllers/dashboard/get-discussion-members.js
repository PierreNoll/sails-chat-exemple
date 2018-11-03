module.exports = {


  friendlyName: 'Get discussion members',


  description: 'Get the members of the discussion passed in',


  inputs: {

    discussionId:{
      type:'number'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var userDiscussionRecords = await UserDiscussion.find({
      where:{discussionId:inputs.discussionId},
      select:['user']
    })
    .populate('user');

    var members = [];

    for (var i = 0; i < userDiscussionRecords.length; i++) {
      members.push(_.omit(userDiscussionRecords[i], 'id'));
    }

    return exits.success({members:members});

  }


};
