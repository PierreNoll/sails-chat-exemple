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

    n=discussions.length;
    var discussionSorted=[];
    var firstFalse;
    var lastTrue;
    for (var i = 0; i < n; i++) {
      // Si le status de discussion[i] est vrai
      if (discussions[i].discussion.status) {
        // si c'est le premier statut actif, on le place index 0
        if (lastTrue==undefined) {
          discussionSorted[0]=discussions[i];
          lastTrue=0;
        }
        // sinon ça n'est pas la premiere discussion active et lastTrue est défini
        else {
          // on parcourt slmt les discussions actives (déjà triées)
          for (var j = 0; j <= lastTrue; j++) {
            // si la discussion non triée i est plus récente que la discussion triée j
            if (discussions[i].discussion.updatedAt>discussionSorted[j].discussion.updatedAt) {
              // alors on décale les discussions antérieures (j compris) d'un index vers la droite
              for (var p = 0; p <= lastTrue-j; p++) {
                discussionSorted[lastTrue-p+1]=discussionSorted[lastTrue-p];
              }
              // et on place la discussion non triée i sur l'index j de la discussion triée
              discussionSorted[j]=discussions[i];
              break;
            }
            // si la discution non triée i est plus ancienne que l'ensemble des discussions déjà triées
            //  et actives alors on la place à la fin des discussions triées et actives
            else if (j==lastTrue) {
              discussionSorted[j+1]=discussions[i];
            }
          }
          // on incrémente le compteur de 1 en dehors de la boucle
          lastTrue+=1;
        }
      }
      // sinon le status de la discussion est terminée (faux)
      //quasiment le meme raisonnement avec des sens inversés
      else {
        if (firstFalse==undefined) {
          discussionSorted[n-1]=discussions[i];
          firstFalse=n-1;
        }
        else {
          for (var j = 0; j <= n-1-firstFalse; j++) {
            if (discussions[i].discussion.updatedAt>discussionSorted[firstFalse+j].discussion.updatedAt) {
              if (j==0) {
                discussionSorted[firstFalse+j-1]=discussions[i];
              }
              else {
                for (var p = 0; p <= j; p++) {
                  discussionSorted[firstFalse+p-1]=discussionSorted[firstFalse+p];
                }
                discussionSorted[firstFalse+j]=discussions[i]
              }
              break;
            }
            else if ( j == n-1-firstFalse) {
              for (var p = 0; p <= j; p++) {
                discussionSorted[firstFalse+p-1]=discussionSorted[firstFalse+p];
              }
              discussionSorted[firstFalse+j]=discussions[i]
            }
          }
          firstFalse-=1;
        }
      }
    }


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

    return exits.success({discussions:discussionSorted});

  }


};
