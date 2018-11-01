parasails.registerPage('welcome', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    msg: '',
    discussions:'',
    currentDiscussion:'',
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

    io.socket.get('/api/v1/dashboard/get-discussions/', function(results){
      self.discussions=results.discussions;
    })

    io.socket.on('new_msg', function(results) {
      $('#messages').append('<p class="m-0 alert-success"><strong>'+results.sender+' :</strong> '+results.msg+'</p>');
      setTimeout(function () {
        $("p").removeClass('alert-success')
      }, 2000);
    });

    io.socket.on('new_discussion', function(results) {
      self.discussions.push(Object.assign({discussion:results.newDiscussion}));
    });

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    sendMsg : function(){
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      io.socket.post('/api/v1/dashboard/post-message', {msg: this.msg, discussion:this.currentDiscussion}, function(res, jrws){
        console.log(res, jrws);
      });
      this.msg='';
    },

    newDiscussion: function(){
      var self=this;
      io.socket.post('/api/v1/dashboard/create-new-discussion', {usersId:[this.me.id]}, function(res, jrws){
        console.log(res, jrws);
        self.currentDiscussion=res.newDiscussion.id;
        console.log(self.currentDiscussion)
      });
    },

    getDiscussion: function(){
      io.socket.get('/api/v1/dashboard/get-discussion/'+this.currentDiscussion, function(results){
        for (var i = 0; i < results.discussion.messages.length; i++) {
          $('#messages').append('<p class="m-0"><strong>'+results.discussion.messages[i].userFullName+' :</strong> '+results.discussion.messages[i].message+'</p>');
        }
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      })
    },

    switchDiscussion: function(discussionId){
      $('#messages').empty();
      this.currentDiscussion=discussionId;
      this.getDiscussion();
    }

  }
});
