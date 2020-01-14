module.exports = {
    socketIo: (server, serverNames) => {
        var io = require('socket.io')(server);

        io.on('connection', (socket) =>{
            console.log('connection', socket.id);

            socket.on('SEND_NAME_TO_SERVER', user => {

                serverNames = [...serverNames, { socketId: socket.id, user }];
                // names = [...names, name];
                socket.broadcast.emit('SEND_NAMES_TO_CLIENTS', serverNames);
                socket.emit('SEND_NAMES_TO_CLIENTS', serverNames);
                console.log('serverNames name', serverNames);
            });

            socket.on('SOCKET_NEW_MESSAGE', message => {
                socket.broadcast.emit('SEND_NEW_MESSAGE_TO_CLIENTS', message);
            });
            socket.on('SOCKET_EDIT_MESSAGE', message => {
                socket.broadcast.emit('SEND_EDIT_MESSAGE_TO_CLIENTS', message);
            });
            socket.on('SOCKET_DELETE_MESSAGE', messageId => {
                socket.broadcast.emit('SEND_DELETED_MESSAGE_TO_CLIENTS', messageId);
            });
            socket.on('disconnect', function () {

                serverNames = serverNames.filter(data => data.socketId !== socket.id);
                socket.broadcast.emit('SEND_NAMES_TO_CLIENTS', serverNames);
                socket.emit('SEND_NAMES_TO_CLIENTS', serverNames);
                console.log('user disconnected', socket.id);
            });
        });
        return serverNames;
    }
};
