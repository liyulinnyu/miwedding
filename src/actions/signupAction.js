import {signupAPI} from '../api/signup';


export const signupActionHandler = (args) => async (dispatch, getState) => {
    try {
        const res = await signupAPI(args);
        
        if (res.signup === 'success') {
            return 1;
        }

        return 0;
    } catch (err) {
        console.log(err);
        return 0;
    }
}