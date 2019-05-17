import {
    getUserDataAPI,
    changeUserImageAPI,
    getSavedWeddingAPI,
    deleteSingleWeddingAPI
} from '../api/user';


export const getUserDataActionHander = (args) => async (dispatch, getState) => {
    try {
        const user = await getUserDataAPI(args);
        return {
            user: user.getUser,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const changeUserImageActionHandler = (args) => async (dispatch, getState) => {
    try {
        const user = await changeUserImageAPI(args);

        dispatch({type:'CHANGE_USER_IMAGE', payload: {image: user.changeUserImage.image}});

        return {
            image: user.changeUserImage.image,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const getSavedWeddingActionHandler = (args) => async (dispatch, getState) => {
    try {
        const user = await getSavedWeddingAPI(args);
        return {
            savedWedding: user.getSavedWedding.savedWedding,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const deleteSingleWeddingActionHandler = (args) => async (dispatch, getState) => {
    try {
        const user = await deleteSingleWeddingAPI(args);
        return {
            createdWedding: user.deleteSingleWedding.createdWedding,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}