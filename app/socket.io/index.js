const socketio = require('socket.io');
// Wrap middleware for Socket.IO
const wrapMiddlewareForSocketIo = middleware => (socket, next) => middleware(socket.request, {}, next);
const passport = require('passport');
const Chat = require('./../models/chat');
const { handleError } = require('../middleware/utils');
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
    // io.use(wrapMiddlewareForSocketIo((req, res, next) => {
    //   const authorizationHeader = req.headers['authorization'];
    //   console.log('received: ', authorizationHeader, req.headers);
    //   const token = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    //   next();
    // }));
    io.use(wrapMiddlewareForSocketIo((req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(new Error('Unauthorized'));
        }
        req.user = user;
        return next();
      })(req, res, next);
    }));

    // io.onAny((event, ...args) => {
    //   console.log('listner got : ', event, args);
    // });

    io.on('connection', (socket) => {
      console.log('connection established with: ', socket.request.user);
      const user = socket.request.user
      // Add client to the clients object
      if (clients[user._id]) {
        socket.emit('error', {
          message: 'already connected with other device!'
          //disconnect the socket off...
        })
      } else {
        //notifyOnlineUsers
        user.connections.forEach(connection => {
          if (clients[connection]) {
            clients[connection].emit('user:online', user._id)
          }
        })
        clients[user._id] = socket;
      }

      // Listen for chat message events
      socket.on('chat:message', (message) => {
        message['senderId'] = user._id

        const chat = new Chat(message)
        let validationError = chat.validateSync()
        if (validationError) {
          console.log(JSON.parse(JSON.stringify(validationError)));
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

        chat._doc.status='sending'
        //save message into database
        chat.save()
          .then(dbResponse => {
            console.log(dbResponse);
            socket.emit('chat:sending', chat._doc._id)

            //if receiver online, send message LIVE
            if (clients[chat._doc.receiverId]) {
              clients[chat._doc.receiverId].emit('chat:message', chat._doc, ()=>{
                Chat.findByIdAndUpdate(chat._doc._id, {$set:{status:'sent'}})
                socket.emit('chat:sent',chat._doc._id)
              })

            } else {
              console.log();
            }

          })

      });

      // receiver emits this event when chat box is opened
      socket.on('chat:seen', (chat)=>{
        //update status to seen in database
        //if sender is online, send event chat:seen to him
      })

      // Remove client from the clients object when they disconnect
      socket.on('disconnect', () => {
        user.connections.forEach(connection => {
          if (clients[connection]) {
            clients[connection].emit('user:ofline', user._id)
          }
        })
        delete clients[socket.id];
      });
    });


  } catch (error) {
    console.log('errror', error);
  }


}

function buildvalidatedMessage(messageObj) {
  const chat = new Chat(messageObj)
  let validationError = chat.validateSync()
  if (validationError) {
    console.log(JSON.parse(JSON.stringify(validationError)));

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
