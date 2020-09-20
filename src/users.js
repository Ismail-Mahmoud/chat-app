const users = {}
const roomUsers = {}

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase().replace(/\s+/g, ' ')
    room = room.trim().toLowerCase().replace(/\s+/g, ' ')

    if(!username || !room) {
        return {error: 'Username and room are required!'}
    }

    if(!roomUsers[room]) {
        roomUsers[room] = []
    }

    const duplicate = roomUsers[room].some(_username => _username === username)
    if(duplicate) {
        return {error: 'Duplicate username!'}
    }

    users[id] = {username, room}
    roomUsers[room].push(username)

    return {user: users[id]}
}

const removeUser = (id) => {
    const user = getUser(id)
    if(user) {
        const idx = roomUsers[user.room].findIndex(username => username === user.username)
        roomUsers[user.room].splice(idx, 1)[0]
        return user
    }
}

const getUser = id => users[id]

const getRoomUsers = room => roomUsers[room]

module.exports = {
    addUser,
    removeUser,
    getUser,
    getRoomUsers
}


// addUser({id: 1, username: 'ali', room: 'chattt'})
// addUser({id: 2, username: 'hos', room: 'chattt'})
// addUser({id: 3, username: 'kk', room: 'chattt'})
// addUser({id: 3, username: 'kk', room: 'amamm'})
// console.log(removeUser({username: 'kk', room: 'chattt'}))
// console.log(roomUsers)