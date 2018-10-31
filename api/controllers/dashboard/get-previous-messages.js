module.exports = {


  friendlyName: 'Get previous messages',


  description: 'Get the historical messages for a specific user.',


  inputs: {

    idUser:{
      type:'number'
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided user is invalid.',
    },

  },


  fn: async function (inputs, exits) {

    if (inputs.idUser!==this.req.me.id) {
      throw 'invalid';
    }
    else {
      var messages = await Message.find({
        sender:inputs.idUser
      })
      .populate('author')
      .intercept({name: 'UsageError'}, 'invalid');
    }

    sails.log(messages)

    return exits.success({messages:messages});

  }


};
