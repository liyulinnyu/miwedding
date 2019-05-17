import {combineReducers} from 'redux';
import weddingReducer from './weddingReducer';
import loginReducer from './loginReducer';

const RootReducer = combineReducers({
    weddingReducer,
    login_data: loginReducer
});


export default RootReducer;