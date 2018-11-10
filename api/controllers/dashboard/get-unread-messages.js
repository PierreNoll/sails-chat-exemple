module.exports = {


  friendlyName: 'Get unread messages',


  description: 'Get the unread messages for a discussion and a specific user',


  inputs: {

    discussionId:{
      type:'string'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var unreadMessages = await UserDiscussion.findOne({
      where:{userId:this.req.me.id, discussionId:inputs.discussionId},
      select:'unreadMessages',
    });

    return exits.success({record:unreadMessages});

  }


};
