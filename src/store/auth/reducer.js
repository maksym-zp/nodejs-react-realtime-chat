import {success, error} from 'redux-saga-requests';
import {axiosController} from '../../utils/axiosController';
import {
    AUTH_LOGIN,
    AUTH_REGISTER,
    FETCH_AUTH_USER,
    EDIT_USER_AVATAR,
    EDIT_USER,
    SIGN_OUT,
} from './actions';
import {STATE_STATUSES} from '../../utils/stateStatuses';

import {
    sendNameToServer,
} from '../../socket';

const initialState = {
    user: {},
    status: STATE_STATUSES.INIT,
    isAuthenticated: false,
    message: null,
    exception: {
        message: null,
        errors: {}
    }
};

function setUserForServer(user) {
    const newUser = {...user};
    delete newUser._id;
    return newUser;
}
export default (state = initialState, action) => {
    switch (action.type) {
        case AUTH_LOGIN: {
            return processReducer(state);
        }

        case success(AUTH_LOGIN): {
            axiosController.saveToken(action.data.token);
            sendNameToServer(setUserForServer(action.data.user));
            return authSuccess(action.data);
        }
        case error(AUTH_LOGIN): {
            return errorReducer(action, state);
        }
        case AUTH_REGISTER: {
            return processReducer(state);
        }

        case success(AUTH_REGISTER): {
            axiosController.saveToken(action.data.token);
            sendNameToServer(setUserForServer(action.data.user));
            return authSuccess(action.data);
        }
        case error(AUTH_REGISTER): {
            return errorReducer(action, state);
        }
        case FETCH_AUTH_USER: {
            return {
                ...state,
                status: STATE_STATUSES.INIT,
                user: {...state.result},
                exception: {...initialState.exception}
            };
        }
        case success(FETCH_AUTH_USER): {
            sendNameToServer(setUserForServer(action.data));
            return {
                ...state,
                status: STATE_STATUSES.READY,
                isAuthenticated: true,
                user: action.data,

            };
        }
        case error(FETCH_AUTH_USER): {
            return {
                ...state

            };
        }
        case EDIT_USER: {
            return {
                ...state,
                status: STATE_STATUSES.READY,
                isAuthenticated: true,
                message: null,
                exception: {...initialState.exception}
            };
        }
        case success(EDIT_USER): {
            return {
                ...state,
                user: action.data.user,
                message: action.data.message,
                isAuthenticated: true,
                status: STATE_STATUSES.READY,
            };
        }
        case error(EDIT_USER): {
            return errorReducer(action, state);
        }
        case EDIT_USER_AVATAR: {
            return {
                ...state,
                status: STATE_STATUSES.READY,
                isAuthenticated: true,
                message: null,
                exception: {...initialState.exception}
            };
        }
        case success(EDIT_USER_AVATAR): {
            let path = action.response.data.path;
            path = path.replace(/public/i, '');
            let user = state.user;
            user.avatar = path;
            return {...state, user: user};
        }
        case error(EDIT_USER_AVATAR): {
            return errorReducer(action, state);
        }
        case SIGN_OUT: {
            axiosController.deleteToken();
            return {
                ...state,
                user: {},
                isAuthenticated: false,
            };
        }
        default:
            return state;
    }

};

const errorReducer = (exception, state = initialState) => (
    {
        ...state,
        status: STATE_STATUSES.ERROR,
        exception: {
            errors: {...exception.error.response.data.error.errors},
            message: exception.error.response.data.message,
        }
    });

const processReducer = (state = initialState) => ({
    ...initialState,
    user: {...state.result},
    exception: {...initialState.exception}
});

const authSuccess = (state = initialState) => ({
    ...initialState,
    status: STATE_STATUSES.READY,
    isAuthenticated: true,
    user: {...state.user},
    exception: {...initialState.exception}
});
