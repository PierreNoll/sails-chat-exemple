module.exports = {


  friendlyName: 'Get connexion status',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var moment = require('moment');

    var users = await User.find({
      select:['fullName','connexionStatus','lastSeenAt']
    });

    for (var i = 0; i < users.length; i++) {
      users[i].lastSeenAt=moment(users[i].lastSeenAt).fromNow();
    }


    return exits.success({users:users});

  }


};
