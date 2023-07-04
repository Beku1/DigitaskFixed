const asyncLocalStorage = require('./als.service')
const logger = require('./logger.service')

var gIo = null

function connectSockets(http, session) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  })

  gIo.on('connection', (socket) => {
    console.log('New socket', socket.id)
    socket.on('disconnect', (socket) => {
      console.log('Someone disconnected', socket)
    })
    //reference
    // socket.on('chat topic',topic=>{
    //     if(socket.myTopic === topic) return
    //     if(socket.myTopic){
    //         socket.leave(socket.myTopic)
    //     }
    //     socket.join(topic)
    //     socket.myTopic = topic
    // })
    // we need this too
    socket.on('user-watch', (userId) => {
      socket.join('watching:' + userId)
    })
    socket.on('unset-user-socket', () => {
      delete socket.userId
    })
    // attempt
    socket.on('board-watch', (boardId) => {
      if (socket.boardId === boardId) return
      if (socket.boardId) {
        socket.leave(socket.boardId)
      }
      socket.join(boardId)
      socket.boardId = boardId
      console.log(socket.boardId)
    })
    socket.on('mouseMove', (pos) => {
      // socket.broadcast.emit('mouseMove', pos)
      // gIo.to(socket.boardId).emit('mouseMove', pos)
      // gIo.broadcast.to(socket.boardId).emit('mouseMove', pos)
      // socket.broadcast.to(socket.boardId).emit('mouseMove', pos)
      // socket.broadcast.emit('mouseMove',pos,socket.boardId)
      socket.broadcast.to(socket.boardId).emit('mouseMove', pos)
      // gIo.broadcast(socket.boardId).emit('mouseMove', pos)
    })
    socket.on('board-updated', (board) => {
      console.log('board-updated')
      gIo.to(socket.boardId).emit('updated-board', board)
    })
  })
}

function emitTo({ type, data, label }) {
  if (label) gIo.to('watching:' + label).emit(type, data)
  else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
  logger.debug('Emiting to user socket: ' + userId)
  const socket = await _getUserSocket(userId)
  if (socket) socket.emit(type, data)
  else {
    console.log('User socket not found')
    _printSockets()
  }
}

async function broadcast({ type, data, boardId = null, userId }) {
  console.log('BROADCASTING', JSON.stringify(arguments))
  const excludedSocket = await _getUserSocket(userId)
  if (!excludedSocket) {
    // logger.debug('Shouldnt happen, socket not found')
    // _printSockets();
    return
  }
  logger.debug('broadcast to all but user: ', userId)
  if (boardId) {
    excludedSocket.broadcast.to(boardId).emit(type, data)
  } else {
    excludedSocket.broadcast.emit(type, data)
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets()
  const socket = sockets.find((s) => s.userId == userId)
  return socket
}

async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets()
  return sockets
}

module.exports = {
  connectSockets,
  emitTo,
  emitToUser,
  broadcast,
}
