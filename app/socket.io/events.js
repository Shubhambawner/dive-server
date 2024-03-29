module.exports = {
  CONNECTION: 'connection',//server listning, client listning
  DISCONNECT: 'disconnect',//server listning
  //events related to chat
  CHAT: {
    MESSAGE: 'chat:message',//server listning, client listning
    SENDING: 'chat:sending',//client listning, server emiting
    SEEN: 'chat:seen'//server listning, client emiting
  },
  USER: {
    NOW_OFFLINE: 'user:now_offline',//client listning, server emitting
    NOW_ONLINE: 'user:now_online',//client listning, server emitting
    INIT:'user:init' // client listning, server emitting
  },
  PATIENT:{
    SHARE: 'patient:share',//server listning, client listning
    SENDING: 'patient:sending',//client listning, server emiting
    SEEN: 'patient:seen'//server listning, client emiting
  }
}
/**
 * chat: ::MESSAGE:-> uploading ->SENDING-> sending ->SEEN-> seen
 */
