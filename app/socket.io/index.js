const socketio = require('socket.io');
// Wrap middleware for Socket.IO
const wrapMiddlewareForSocketIo = middleware => (socket, next) => middleware(socket.request, {}, next, socket);
const passport = require('passport');
const Chat = require('./../models/chat');
const events = require('./events')
const { handleError, isIDGood } = require('../middleware/utils');
const { getUnseenMessagesFromDB, getConnectionsFromDB } = require('./../controllers/profile/helpers/index')
const clients = {}
/**
 *
 * @param {http.Server} server required to set up socket.io event handlers...
 */
module.exports = function setupSocket(server) {
  try {
    const io = socketio(server);

    // Use Passport to initialize and authenticate user
    io.use(wrapMiddlewareForSocketIo(passport.initialize()));
    io.use(wrapMiddlewareForSocketIo((req, res, next, socket) => {
      // const authorizationHeader = req.headers['authorization'];
      const authorizationHeader = socket.handshake.auth.token;

      // console.log('received: ', authorizationHeader);
      const token = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
      if (!req.body) req.body = { authorization: authorizationHeader }
      if (!req.query) req.query = { authorization: authorizationHeader }
      if (!req.headers) req.headers = { authorization: authorizationHeader }
      next();
    }));
    io.use(wrapMiddlewareForSocketIo((req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        console.log(err, user, info);
        if (err) {
          console.log(err);
          return next(err);
        }
        if (!user) {
          return next(new Error('Unauthorized'));
        }
        req.user = user;
        return next();
      })(req, res, next);
    }));

    // io.use((socket,next)=>{
    //   // console.log(socket.);
    //   next()
    // })

    // io.onAny((event, ...args) => {
    // console.log('listner got : ', event, args);
    // });

    io.on(events.CONNECTION, async (socket) => {
      console.log('connection established with: ', socket.request.user.name);
      // active user
      const user = socket.request.user
      // Add client to the clients object
      if (clients[user._id]) {
        socket.emit('error', {
          message: 'already connected with other device!'
          //disconnect the socket off...
        })
      } else {
        //notifyOnlineUsers
        let allConnecitons = await getConnectionsFromDB(user._id)
        allConnecitons = allConnecitons.connections
        console.log(allConnecitons);
        let allConnectionsData = {}
        allConnecitons.forEach(connection => {
          let connectionId = connection._id
          allConnectionsData[connectionId] = { ...connection._doc, messages: [], status: 'offline' }
          if (clients[connectionId]) {
            clients[connectionId].emit(events.USER.NOW_ONLINE, user._id)
            allConnectionsData[connectionId].status = 'online'
          }
        });
        let unseenMessages = await getUnseenMessagesFromDB(user._id)
        unseenMessages.forEach(message => {
          allConnectionsData[message.senderId].messages.push(message)
        })
        clients[user._id] = socket;
        socket.emit(events.USER.INIT, allConnectionsData)
      }

      // Listen for chat message events
      socket.on(events.CHAT.MESSAGE, (message) => {
        console.log(message);
        message['senderId'] = user._id
        message['status'] = 'unseen'
        const chat = new Chat(message)
        let validationError = chat.validateSync()
        if (validationError) {
          // console.log(JSON.parse(JSON.stringify(validationError)));
          socket.emit('error', validationError)
          return;
          // handleSocketError({}, validationError)
        }

        //check: receiverId in user.connections
        if (user.connections.indexOf(chat._doc.receiverId) < 0) {
          socket.emit('error', {
            'errors': {
              'receiverId': {
                stringValue: chat._doc.receiverId,
                message: 'receiver not in your connections, cant send message to him/her...'
              }
            }
          })
          return;
        }
        console.log('checkes passed, saving to db...');

        //save message into database
        chat.save()
          .then(dbResponse => {
            // console.log(dbResponse); //updated  document...
            socket.emit(events.CHAT.SENDING, chat._doc) //single tick

            if (clients[chat._doc.receiverId]) {
              console.log('sending message to', chat._doc.receiverId);
              // Chat.findByIdAndUpdate(chat._doc._id, { $set: { status: 'sent', sentAt: Date() } })
              clients[chat._doc.receiverId].emit(events.CHAT.MESSAGE, chat._doc)
              // socket.emit(events.CHAT.SENT, chat._doc) //double tick
            }
          })
      });

      // receiver emits this event when chat box is opened
      socket.on(events.CHAT.SEEN, async (message) => {
        //update status to seen in database
        let updatedChat, messageId;
        try {
          messageId = await isIDGood(message._id)
          updatedChat = await Chat.findOneAndUpdate(
            { _id: message, status: 'unseen', receiverId: user._id },
            { $set: { status: 'seen', seenAt: Date.now() } },
            { returnDocument: 'after' }
          )


          //if sender is online, send event chat:seen to him
          let senderId = await isIDGood(message.senderId)
          if (!updatedChat) {
            socket.emit('error', { message: 'no received message with given _id and unseen status found!' })
            return;
          }
          if (clients[senderId] && updatedChat) {
            clients[senderId].emit(events.CHAT.SEEN, updatedChat)
          }
        } catch (error) {
          console.error(error);
          socket.emit('error', error)
        }
      })

      // Remove client from the clients object when they disconnect
      socket.on(events.DISCONNECT, () => {
        //update lastSeen or lastOnline field of user using this event
        //using user module...
        console.log('disconnecting', user.name);
        user.connections.forEach(connection => {
          if (clients[connection]) {
            clients[connection].emit(events.USER.NOW_OFFLINE, user._id)
          }
        })
        clients[user._id] = undefined;
      });
    });


  } catch (error) {
    // console.log('errror', error);
  }


}

function buildvalidatedMessage(messageObj) {
  const chat = new Chat(messageObj)
  let validationError = chat.validateSync()
  if (validationError) {
    // console.log(JSON.parse(JSON.stringify(validationError)));

    // handleSocketError({}, validationError)
  }
  return chat._doc;
}


/**

import io from 'socket.io-client';

const token = 'your_jwt_token_here';

const socket = io('http://localhost:3000', {
  extraHeaders: {
    Authorization: `Bearer ${token}`
  }
});

socket.emit('my-event', { data: 'hello' });

 */
