const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const users = require("./users")();

const m = (name, text, id) => ({
  name,
  text,
  id,
  date: new Date(Date.now()).toLocaleTimeString()
});

io.on("connection", socket => {
  socket.on("init", cb => {
    console.log(users);
    socket.emit("updateUsers", users.users);
    cb();
  });

  socket.on("userJoined", (data, cb) => {
    if (!data.name || !data.room) return cb("invalid inputs");
    socket.join(data.room);
    users.remove(socket.id);
    users.add({ id: socket.id, name: data.name, room: data.room });
    cb({ userId: socket.id });
    io.to(data.room).emit("updateUsers", users.getByRoom(data.room));
    socket.emit("newMessage", m("admin", `Welcome ${data.name}`));
    socket.broadcast
      .to(data.room)
      .emit("newMessage", m("admin", ` ${data.name} joined the room`));
  });

  socket.on("createMessage", (data, cb) => {
    if (!data.text) {
      return cb("Can not be empty");
    }
    const user = users.get(data.id);
    if (user) {
      io.to(user.room).emit("newMessage", m(user.name, data.text, data.id));
    }
    cb();
  });

  socket.on("userLeft", (id, cb) => {
    const user = users.remove(id);
    if (user) {
      io.to(user.room).emit("updateUsers", users.getByRoom(user.room));
      io.to(user.room).emit("newMessage", m("admin", `${user.name} left room`));
    }
    cb();
  });

  socket.on("disconnect", () => {
    const user = users.remove(socket.id);
    if (user) {
      io.to(user.room).emit("updateUsers", users.getByRoom(user.room));
      io.to(user.room).emit("newMessage", m("admin", `${user.name} left room`));
    }
  });
});

module.exports = {
  app,
  server
};
