module.exports = {


  friendlyName: 'Reset unread messages',


  description: 'Reset to 0 the unread message of the discussion for the user',


  inputs: {

    discussionId:{
      type:'string'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    await UserDiscussion.update({
      where:{userId:this.req.me.id, discussionId:inputs.discussionId}
    })
    .set({unreadMessages:0});

    return exits.success();

  }


};
