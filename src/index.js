const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const {createMessage, createLocation} = require('./messages')
const {addUser, removeUser, getUser, getRoomUsers} = require('./users')

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

// socket.emit -> this user
// socket.broadcast.emit -> all users except this user
// io.emit -> all users
// add `to(room)` before `emit` to specify a room

io.on('connection', (socket) => {
    console.log('New connection!')
    
    socket.on('join', ({username, room}, callback) => {
        const {user, error} = addUser({id: socket.id, username, room})
        
        if(error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', createMessage({sender: 'Notification', text: `Welcome to ${user.room}!`}))
        socket.broadcast.to(user.room).emit('message', createMessage({sender: 'Notification', text: `${user.username} has joined!`}))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (text, callback) => {
        const filter = new Filter()
        // filter.removeWords('hell')
        // text = filter.clean(text)
        if(filter.isProfane(text)) {
            return callback('Watch your language!!')
        }

        const user = getUser(socket.id)
        io.to(user.room).emit('message', createMessage({sender: user.username, text}))

        callback()
    })

    socket.on('sendLocation', ({latitude, longitude}, callback) => {
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`
        const user = getUser(socket.id)
        io.to(user.room).emit('location', createLocation({sender: user.username, url}))

        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', createMessage({sender: 'Notification', text: `${user.username} has left!`}))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})