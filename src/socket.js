import io from 'socket.io-client';

const connectionOptions = {
    "timeout": 10000,
    "transports": ['polling', 'websocket']
};

const socket = io(process.env.REACT_APP_URL, connectionOptions);

const configureSocket = dispatch => {

    socket.on('connect', () => {
        console.log('successful connection');
    });

    socket.on('SEND_NAMES_TO_CLIENTS', onLine =>
        dispatch({type: 'PUT_ON_LINE_USER', onLine})
    );

    socket.on('SEND_NEW_MESSAGE_TO_CLIENTS', message => {
            const data = {message: message, socket: true};
            dispatch({type: 'CREATE_MESSAGE_SUCCESS', data});
        }
    );
    socket.on('SEND_EDIT_MESSAGE_TO_CLIENTS', message => {
            const data = {message: message, socket: true};
            dispatch({type: 'EDIT_MESSAGE_SUCCESS', data})
        }
    );
    socket.on('SEND_DELETED_MESSAGE_TO_CLIENTS', messageId => {
            const data = {id: messageId, socket: true};
            dispatch({type: 'DELETE_MESSAGE_SUCCESS', data})
        }
    );
};
export const sendNameToServer = name =>
    socket.emit('SEND_NAME_TO_SERVER', name);

export const socketNewMessage = message =>
    socket.emit('SOCKET_NEW_MESSAGE', message);
export const socketEditMessage = message => {
    socket.emit('SOCKET_EDIT_MESSAGE', message);
};
export const socketDeleteMessage = messageId =>
    socket.emit('SOCKET_DELETE_MESSAGE', messageId);

export default configureSocket;