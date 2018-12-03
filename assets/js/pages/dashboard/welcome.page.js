parasails.registerPage('welcome', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    msg: '',
    discussions: '',
    currentDiscussion: '',
    users: [],
    setTitle: '',
    inputUsersToAdd: [],
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    io.socket.headers = {
      "x-csrf-token": this._csrf,
    };


  },
  mounted: async function() {

    var self = this;

    self.getConnexionStatus();
    //setInterval(self.getConnexionStatus, 1000);

    io.socket.on('user_logged_inout',function(results){
      var existingUser = _.find(self.users,{'id':results.user.id});
      existingUser.connexionStatus=results.user.connexionStatus;
      existingUser.lastSeenAt=results.user.lastSeenAt;
    });

    self.getDiscussions();

    io.socket.on('new_msg', function(results) {
      if (results.discussion == self.currentDiscussion.discussionId) {
        $('#messages').append('<p class="m-0 alert-success"><strong>' + results.sender + ' :</strong> ' + results.msg + '</p>'
        +'<p class="font-weight-light font-italic"><small>'+moment(results.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")+'</small></p>'
        +'<hr>'
      );
        setTimeout(function() {
          $("p").removeClass('alert-success')
        }, 2000);
        $("html, body").animate({
          scrollTop: $(document).height()
        }, 200);
        self.resetUnreadMessages(results.discussion);
      } else {
        self.getUnreadMessages(results.discussion);
        // var n = parseInt($('#'+results.discussion).text());
        // console.log(n);
        // if (n) {
        //   $('#'+results.discussion).text(n+1)
        // }
        // else {
        //   $('#'+results.discussion).text(1)
        // }
      }
    });

    io.socket.on('new_discussion', function(results) {
      self.getDiscussions();
    });

    io.socket.on('new_title', function(results) {
      self.getDiscussions();
    });

    io.socket.on('discussionClosed', function(results) {
      self.getDiscussions();
    });

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    refreshLastSeenAt: function(){
      var self = this;
      for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].connexionStatus=='online' && moment().diff(this.users[i].lastSeenAt)>86400000) {
          this.users[i].connexionStatus='offline';
        }
        $('#userLastSeenAt'+this.users[i].id).text(moment(this.users[i].lastSeenAt).fromNow());
      }
      setTimeout(self.refreshLastSeenAt, 1000);
    },

    getConnexionStatus: function() {
      var self = this;
      io.socket.get('/api/v1/dashboard/get-connexion-status/', function(results) {
        self.users = results.users;
        self.refreshLastSeenAt();
      })
    },

    getDiscussions: function() {
      var self = this;
      io.socket.get('/api/v1/dashboard/get-discussions/', function(results) {
        self.discussions = results.discussions;
        //console.log(a=self.discussions)
      })
    },

    sendMsg: function() {
      io.socket.post('/api/v1/dashboard/post-message', {
        msg: this.msg,
        discussion: this.currentDiscussion.discussionId
      }, function(res, jrws) {
        //console.log(res, jrws);
      });
      this.msg = '';
    },

    newDiscussion: function() {
      var self = this;
      io.socket.post('/api/v1/dashboard/create-new-discussion', {
        usersId: [this.me.id]
      }, function(res, jrws) {
        self.currentDiscussion.discussionId = res.newDiscussion.id;
      });
      $('#messages').empty();
    },

    getDiscussion: function() {
      io.socket.get('/api/v1/dashboard/get-discussion/' + this.currentDiscussion.discussionId, function(results) {
        for (var i = 0; i < results.discussion.messages.length; i++) {
          $('#messages').append(
            '<p class="m-0"><strong>' + results.discussion.messages[i].userFullName + ' :</strong> ' + results.discussion.messages[i].message + '</p>'
            +'<p class="font-weight-light font-italic"><small>'+moment(results.discussion.messages[i].createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")+'</small></p>'
            +'<hr>'
          );
        }
        $("html, body").animate({
          scrollTop: $(document).height()
        }, 1000);
      })
      this.getDiscussionMembers(this.currentDiscussion.discussionId);
    },

    getDiscussionMembers: function(discussionId) {
      var self = this;
      io.socket.get('/api/v1/dashboard/get-discussion-members/' + discussionId, function(results) {
        var discussion = _.find(self.discussions, {
          discussionId: discussionId
        });
        discussion.members = results.members;
        self.currentDiscussion = discussion;
        //console.log(a = self.currentDiscussion)
      })
    },

    switchDiscussion: function(discussionId) {
      $('#messages').empty();
      //$('#'+discussionId).empty();
      this.currentDiscussion = _.find(this.discussions, {
        discussionId: discussionId
      });
      this.getDiscussion();
      this.resetUnreadMessages(discussionId);
      this.getDiscussions();
    },

    resetUnreadMessages: function(discussionId) {
      io.socket.patch('/api/v1/dashboard/reset-unread-messages', {
        discussionId: discussionId
      }, function(res, jrws) {
        //console.log(res, jrws);
      });
    },

    getUnreadMessages: function(discussionId) {
      var self = this;
      io.socket.get('/api/v1/dashboard/get-unread-messages/' + discussionId, function(results) {
        var discussion = _.find(self.discussions, {
          discussionId: discussionId
        });
        discussion.unreadMessages = results.record.unreadMessages;
      });
    },

    newTitle: function() {
      io.socket.patch('/api/v1/dashboard/update-discussion-title', {
        discussionId: this.currentDiscussion.discussionId,
        newTitle: this.currentDiscussion.discussion.title
      }, function(res, jrws) {
        //console.log(res, jrws);
      });
      this.setTitle = false;
    },

    pushUserToAdd: function(e) {
      this.inputUsersToAdd.push(e.target.value);
    },

    postUsersToAdd: function() {
      var self = this;
      var lightUsersToAdd = [];

      var findMatch;
      var n = this.inputUsersToAdd.length; // The length of this array may change during this loop so we make it distinct of the object
      for (var i = 0; i < n; i++) {
        findMatch = false;
        for (var j = 0; j < this.users.length; j++) { // Check if the fullName match a real one
          if (this.inputUsersToAdd[i] == this.users[j].fullName) { // Si on trouve une correspondance on note l'id à ajouter et on passe au suivant
            findMatch = true;
            lightUsersToAdd.push(this.users[j].id);
            //console.log('correspondance avec un user')
            break;
          }
        }
        if (!findMatch) { // Si il n'y a pas de correspondance, on retire le membre incorrect et on continue
          _.pullAt(this.inputUsersToAdd, i);
        } else {
          // Check if the user is already in; if yes reject the user
          for (var k = 0; k < this.currentDiscussion.members.length; k++) {
            if (this.currentDiscussion.members[k].user.id == _.last(lightUsersToAdd)) {
              _.pullAt(this.inputUsersToAdd, i);
              lightUsersToAdd.pop();
            }
          }
        }
      }

      io.socket.post('/api/v1/dashboard/add-members-to-discussion', {
        usersId: lightUsersToAdd,
        discussionId: this.currentDiscussion.discussionId
      }, function(results) {
        self.getDiscussionMembers(self.currentDiscussion.discussionId);
      });

      this.inputUsersToAdd = [];
    },

    closeDiscussion: function(){
      io.socket.patch('/api/v1/dashboard/close-discussion', {
        discussionId: this.currentDiscussion.discussionId,
      }, function(res, jrws) {
        //console.log(res, jrws);
      });
      this.currentDiscussion.discussion.status=false;
      var indexDiscussion = _.findIndex(this.discussions, {
        discussionId: this.currentDiscussion.discussionId
      });
      this.discussions[indexDiscussion]=this.currentDiscussion;
    }

  }
});
