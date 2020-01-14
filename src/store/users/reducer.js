import {success, error} from 'redux-saga-requests';
import {
    ALL_USERS
} from './actions';
import {STATE_STATUSES} from '../../utils/stateStatuses';

const initialState = {
    all: [],
    onLine: [],
    status: STATE_STATUSES.INIT,
    exception: {
        message: null,
        errors: {}
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ALL_USERS: {
            return processReducer(state);
        }

        case success(ALL_USERS): {
            return {
                ...state,
                status: STATE_STATUSES.READY,
                all: action.data.users,
                exception: {...initialState.exception}
            };
        }
        case error(ALL_USERS): {
            return errorReducer(action, state);
        }

        case 'PUT_ON_LINE_USER': {
            return {
                ...state,
                status: STATE_STATUSES.READY,
                onLine: action.onLine,
                exception: {...initialState.exception}
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
    exception: {...initialState.exception}
});


