import { createStore, applyMiddleware } from 'redux';
import saga from './saga';
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './store/index';
import {composeWithDevTools} from 'redux-devtools-extension';
import { requestsPromiseMiddleware } from 'redux-saga-requests';
import createSagaMiddleware from 'redux-saga'
const inititalState = undefined;
const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();

const middlewares = [
    requestsPromiseMiddleware({auto: true}),
    thunkMiddleware,
    sagaMiddleware,
];
if ( process.browser ) {
    middlewares.push(loggerMiddleware);
}
const store = createStore(rootReducer,
    inititalState,
    composeWithDevTools(applyMiddleware(...middlewares)));
sagaMiddleware.run(saga);
export default store;