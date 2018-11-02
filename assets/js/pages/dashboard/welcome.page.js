parasails.registerPage('welcome', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    msg: '',
    discussions:'',
    currentDiscussion:'',
    users:'',
    setTitle:'',
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

    var self=this;

    self.getConnexionStatus();

    self.getDiscussions();

    io.socket.on('new_msg', function(results) {
      if (results.discussion==self.currentDiscussion.discussionId) {
        $('#messages').append('<p class="m-0 alert-success"><strong>'+results.sender+' :</strong> '+results.msg+'</p>');
        setTimeout(function () {
          $("p").removeClass('alert-success')
        }, 2000);
        self.resetUnreadMessages(results.discussion);
      }
      else {
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

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    getConnexionStatus:function(){
      var self=this;
      io.socket.get('/api/v1/dashboard/get-connexion-status/', function(results){
        self.users=results.users;
      })
    },

    getDiscussions: function() {
      var self=this;
      io.socket.get('/api/v1/dashboard/get-discussions/', function(results){
        self.discussions=results.discussions;
      })
    },

    sendMsg : function(){
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      io.socket.post('/api/v1/dashboard/post-message', {msg: this.msg, discussion:this.currentDiscussion.discussionId}, function(res, jrws){
        console.log(res, jrws);
      });
      this.msg='';
    },

    newDiscussion: function(){
      var self=this;
      io.socket.post('/api/v1/dashboard/create-new-discussion', {usersId:[this.me.id]}, function(res, jrws){
        self.currentDiscussion.discussionId=res.newDiscussion.id;
      });
      $('#messages').empty();
    },

    getDiscussion: function(){
      io.socket.get('/api/v1/dashboard/get-discussion/'+this.currentDiscussion.discussionId, function(results){
        for (var i = 0; i < results.discussion.messages.length; i++) {
          $('#messages').append('<p class="m-0"><strong>'+results.discussion.messages[i].userFullName+' :</strong> '+results.discussion.messages[i].message+'</p>');
        }
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      })
    },

    switchDiscussion: function(discussionId){
      $('#messages').empty();
      //$('#'+discussionId).empty();
      this.currentDiscussion=_.find(this.discussions,{discussionId:discussionId});
      this.getDiscussion();
      this.resetUnreadMessages(discussionId);
      this.getDiscussions();
    },

    resetUnreadMessages: function(discussionId){
      io.socket.patch('/api/v1/dashboard/reset-unread-messages',{discussionId:discussionId},function(res,jrws){
        console.log(res,jrws);
      });
    },

    getUnreadMessages: function(discussionId){
      var self=this;
      io.socket.get('/api/v1/dashboard/get-unread-messages/'+discussionId,function(results){
        var discussion= _.find(self.discussions,{discussionId:discussionId});
        console.log(a=discussion);
        discussion.unreadMessages = results.record.unreadMessages;
      });
    },

    newTitle: function(){
      io.socket.patch('/api/v1/dashboard/update-discussion-title',{discussionId:this.currentDiscussion.discussionId, newTitle:this.currentDiscussion.discussion.title},function(res,jrws){
        console.log(res,jrws);
      });
      this.setTitle=false;
    }

  }
});
