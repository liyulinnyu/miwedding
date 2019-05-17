import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import RootReducer from './reducers/index';

const store = createStore(
    RootReducer,
    {},
    applyMiddleware(thunk)
);

export default store;