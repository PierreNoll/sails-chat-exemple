module.exports = {


  friendlyName: 'Valider inscription',


  description: '',


  inputs: {

    selectedInscription:{
      description:'Array contenant les id des demandes d\'inscription selectionnées pour validation.',
      type:'ref',
    }

  },


  exits: {

    emptyArray:{
      description: `Aucune demande selectionnée pour validation`,
      responseType: 'badRequest',
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided informations are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {

    if (!inputs.selectedInscription) {
      throw 'emptyArray'
    }

    var usersToValide = await DemandInscription.destroy({
      where:{id: {in: inputs.selectedInscription}}
    }).intercept({name: 'UsageError'}, 'invalid').fetch();

    for (var i = 0; i < usersToValide.length; i++) {
      var newUserRecord = await User.create(Object.assign({
        emailAddress: usersToValide[i].emailAddress,
        password: usersToValide[i].password,
        fullName: usersToValide[i].fullName,
        tosAcceptedByIp: usersToValide[i].tosAcceptedByIp,
        passwordResetToken: usersToValide[i].passwordResetToken,
        emailProofToken: usersToValide[i].emailProofToken,
        emailProofTokenExpiresAt: usersToValide[i].emailProofTokenExpiresAt,
        emailStatus: usersToValide[i].emailStatus,
        emailChangeCandidate: usersToValide[i].emailChangeCandidate
      }))
      //.intercept('E_UNIQUE', 'emailAlreadyInUse')
      .intercept({name: 'UsageError'}, 'invalid')
      .fetch();

      sails.log(newUserRecord);

      // Store the user's new id in their session.
      //this.req.session.userId = newUtilisateurRecord.id;
    }


    return exits.success();

  }


};
