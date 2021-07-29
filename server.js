const express = require('express');
const { socket } = require('./src/socket');

const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.json());

const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId) ? {
    users: [...rooms.get(roomId).get('users').values()],
    messages: [...rooms.get(roomId).get('messages').values()],
  } : { users: [], messages: [] };
  res.json(obj);
})

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has()) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []]
      ]))
  }
  res.send();
})

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).emit('ROOM:SET_USERS', users);
  });
  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        console.log(users);
        socket.to(roomId).emit('ROOM:SET_USERS', users);
      }
    });
  });
  console.log('user', socket.id, 'connected');

})




server.listen(9999, (err) => {
  if (err) {
    throw Error(err)
  }
  console.log('Сервер запущен!');
})