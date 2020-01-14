import {combineReducers} from 'redux';
import auth from './auth/reducer';
import messages from './messages/reducer';
import users from './users/reducer';
export default combineReducers({
    auth, messages, users
});