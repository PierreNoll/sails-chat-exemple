module.exports = {


  friendlyName: 'Get discussions',


  description: 'Get the discussions of the user and add him to the rooms under the cover',


  inputs: {

  },


  exits: {

    notSocket:{
      responseType:'badRequest',
      description:'The request is not a socket',
      extendedDescription:`A standard HTTP request cannot be added to a socket room`
    },

    socketCannotJoinRoom:{
      statusCode:500,
      description:'Error while attempting to add the socket to the rooms'
    }

  },


  fn: async function (inputs, exits) {

    if (!this.req.isSocket) {
      throw 'notSocket';
    };


    var discussions = await UserDiscussion.find({
      userId:this.req.me.id
    })
    .populate('discussion');

    var roomName='';
    for (var i = 0; i < discussions.length; i++) {
      roomName=discussions[i].discussionId.toString();
      sails.sockets.join(this.req,roomName , function(err) {
        if (err) {
          throw 'socketCannotJoinRoom';
        }
        sails.log('join the room'+roomName)
      })
    };

    return exits.success({discussions:discussions});

  }


};
