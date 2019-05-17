
export const logoutActionHandler = () => (dispatch, getState) => {
    try {
        dispatch({type: 'USER_LOGOUT'});
        return 1;
    } catch (err) {
        console.log(err);
        return 0;
    }
}