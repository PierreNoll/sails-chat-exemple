module.exports = {


  friendlyName: 'Get discussions',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var discussions = await UserDiscussion.find({
      userId:this.req.me.id
    })
    .populate('discussion');

    return exits.success({discussions:discussions});

  }


};
