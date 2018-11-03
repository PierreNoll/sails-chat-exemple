module.exports = {


  friendlyName: 'Add members to discussion',


  description: '',


  inputs: {

    usersId:{
      type:'ref'
    },

    discussionId:{
      type:'number'
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided users are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {

    var users=[];
    for (var i = 0; i < inputs.usersId.length; i++) {
      users.push(await User.findOne({id : inputs.usersId[i]}));
      if (!users[i]) {
        throw 'invalid';
      }
    }

    var discussion = await Discussion.findOne({id:inputs.discussionId});
    if (!discussion) {
      throw 'invalid';
    }

    var socketsId=[];
    for (var i = 0; i < inputs.usersId.length; i++) {
      await UserDiscussion.create(Object.assign({
        userId:inputs.usersId[i],
        discussionId: inputs.discussionId,
        user:inputs.usersId[i],
        discussion:inputs.discussionId,
      }))
      socketsId.push(users[i].socketId);
    }

    // sails.sockets.blast('new_discussion',
    // {
    //   newDiscussion:newDiscussion
    // });

    sails.sockets.broadcast(socketsId,'new_discussion',
    {
      newDiscussion:discussion
    });

    return exits.success();

  }


};
