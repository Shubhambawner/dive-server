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
  },
  USERS:{
    ONLINE:'users:online'//client listning, server emitting
  }
}
/**
 * chat: ::MESSAGE:-> uploading ->SENDING-> sending ->SEEN-> seen
 */
