import {
    CREATE_MESSAGE,
    DELETE_MESSAGE,
    GET_ALL_MESSAGES,
    EDIT_MESSAGE
} from './actions';
import {STATE_STATUSES} from '../../utils/stateStatuses';

import {
    socketNewMessage, socketEditMessage, socketDeleteMessage
} from '../../socket';

import {error, success} from "redux-saga-requests";

const initialState = {
    all: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CREATE_MESSAGE: {
            return {
                ...state,
                status: STATE_STATUSES.INIT
            };
        }
        case success(CREATE_MESSAGE): {
            let messages = state.all;
            if (!action.data.socket) {
                socketNewMessage(action.data.message);
            }
            return {
                ...state,
                status: STATE_STATUSES.READY,
                all: [action.data.message, ...messages]

            };
        }
        case error(CREATE_MESSAGE): {
            console.log('error CREATE_MESSAGE', action);
            return state;
        }

        case DELETE_MESSAGE: {
            console.log('DELETE_MESSAGE', action);
            return {
                ...state,
                status: STATE_STATUSES.INIT
            };
        }
        case success(DELETE_MESSAGE): {
            console.log('success DELETE_MESSAGE', action);
            let messages = state.all;
            if(!action.data.socket){
                socketDeleteMessage(action.data.id);
            }
            return {
                ...state,
                status: STATE_STATUSES.READY,
                all: messages.filter(message => message._id !== action.data.id)
            };
        }
        case error(DELETE_MESSAGE): {
            console.log('error DELETE_MESSAGE', action);
            return state;
        }
        case EDIT_MESSAGE: {
            console.log('EDIT_MESSAGE', action);
            return {
                ...state,
                status: STATE_STATUSES.INIT
            };
        }
        case success(EDIT_MESSAGE): {
            let messages = state.all;
            if(!action.data.socket){
                socketEditMessage(action.data.message);
            }
            return {
                ...state,
                status: STATE_STATUSES.READY,
                all: messages.map(message =>
                {
                    if(message._id === action.data.message._id)  {
                        let editMess = {...message};
                        editMess.content = action.data.message.content;
                        return editMess;
                    }
                    return message;
                })
            };
        }
        case error(EDIT_MESSAGE): {
            console.log('error EDIT_MESSAGE', action);
            return state;
        }
        case GET_ALL_MESSAGES: {
            console.log('GET_ALL_MESSAGES', action);
            return {
                ...state,
                status: STATE_STATUSES.INIT
            };
        }
        case success(GET_ALL_MESSAGES): {
            console.log('success GET_ALL_MESSAGES', action);
            return {
                ...state,
                status: STATE_STATUSES.READY,
                all: action.data.messages

            };
        }
        case error(GET_ALL_MESSAGES): {
            console.log('error GET_ALL_MESSAGES', action);
            return state;
        }
        default:
            return state;
    }
}
