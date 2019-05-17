import {
    USER_LOGIN,
    USER_LOGOUT,
    CHANGE_USER_IMAGE
} from './type';


const initialState = {
    currentUser: null,
    token: '',
    tokenExp: 0
}


const loginReducer = (state = initialState, action) => {
    switch(action.type) {
        case USER_LOGIN: 
            return {
                currentUser: action.payload.currentUser,
                token: action.payload.token,
                tokenExp: action.payload.tokenExp
            };
        case USER_LOGOUT:
            return {
                currentUser: null,
                token: '',
                tokenExp: 0
            };
        case CHANGE_USER_IMAGE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    image: action.payload.image
                }
            };
        default: return state;
    }
}

export default loginReducer;