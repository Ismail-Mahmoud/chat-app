const createMessage = ({sender, text}) => {
    return {
        sender,
        text,
        createdAt: new Date().getTime()
    }
}

const createLocation = ({sender, url}) => {
    return {
        sender,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {createMessage, createLocation}