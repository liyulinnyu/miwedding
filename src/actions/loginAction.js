import {loginAPI} from '../api/login';


const user_login_action = (args) => ({
    type: 'USER_LOGIN',
    payload: args
});


export const loginActionHandler = (args) => async (dispatch, getState) => {
    try {
        const user = await loginAPI(args);
        
        dispatch(user_login_action(user.login));

        return {
            user: user.login,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const checkLoginActionHandler = (args) => (dispatch, getState) => {
    try {
        dispatch(user_login_action(args));
        return 1;
    } catch (err) {
        console.log(err);
        return 0;
    }
}