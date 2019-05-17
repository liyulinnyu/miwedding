import {
    createWeddingAPI,
    getSingleWeddingAPI,
    updateWeddingAPI,
    doWeddingLikeAPI,
    doWeddingDislikeAPI,
    doWeddingSaveAPI,
    removeWeddingLikeAPI,
    removeWeddingDislikeAPI,
    removeWeddingSaveAPI,
    getSearchedWeddingAPI,
    getCoordinateWeddingAPI
} from '../api/wedding';

export const createWeddingActionHandler = (args) => async (dispatch, getState) => {
    try {
        const res = await createWeddingAPI(args);

        return {
            weddingId: res.createWedding._id,
            signal: 1 
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0 
        };
    }
};

export const getSingleWeddingActionHandler = (args) => async (dispatch, getState) => {
    try {
        const wedding = await getSingleWeddingAPI(args);

        return wedding.getOneWedding;
    } catch (err) {
        console.log(err);
    }
}

export const updateWeddingActionHandler = (args) => async (dispatch, getState) => {
    try {
        const res = await updateWeddingAPI(args);
        if (res) {
            return { signal: 1 };
        }
        return { signal: 0 };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}


export const doWeddingLikeActionHandler = (args) => async (dispatch, getState) => {
    try {
        const wedding = await doWeddingLikeAPI(args);

        return {
            likeUsers: wedding.doWeddingLike.likeUsers,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const doWeddingDislikeActionHandler = (args) => async (dispatch, getState) => {
    try {
        const wedding = await doWeddingDislikeAPI(args);

        return {
            dislikeUsers: wedding.doWeddingDislike.dislikeUsers,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const doWeddingSaveActionHandler = (args) => async (dispatch, getState) => {
    try {
        const wedding = await doWeddingSaveAPI(args);

        return {
            saveUsers: wedding.doWeddingSave.saveUsers,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}


export const removeWeddingLikeActionHandler = (args) => async (dispatch, getState) => {
    try {
        const wedding = await removeWeddingLikeAPI(args);

        return {
            likeUsers: wedding.removeWeddingLike.likeUsers,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const removeWeddingDislikeActionHandler = (args) => async (dispatch, getState) => {
    try {
        const wedding = await removeWeddingDislikeAPI(args);

        return {
            dislikeUsers: wedding.removeWeddingDislike.dislikeUsers,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const removeWeddingSaveActionHandler = (args) => async (dispatch, getState) => {
    try {
        const wedding = await removeWeddingSaveAPI(args);

        return {
            saveUsers: wedding.removeWeddingSave.saveUsers,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const getSearchedWeddingActionHandler = (args) => async (dispatch, getState) => {
    try {
        const weddings = await getSearchedWeddingAPI(args);

        return {
            weddings: weddings.getSearchedWedding.weddings,
            totalNum: weddings.getSearchedWedding.totalNum,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}


export const getWeddingCitiesDataActionHandler = () => async (dispatch, getState) => {
    try {
        const weddings = await getCoordinateWeddingAPI();

        return {
            weddings: weddings.getCoordinateWedding,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}