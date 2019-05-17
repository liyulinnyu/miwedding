

import {
    getWeddingCommentsAPI,
    createWeddingCommentsAPI,
    doCommentLikeAPI,
    doCommentDislikeAPI,
    deleteCommentAPI
} from '../api/comment';


export const getWeddingCommentsActionHandler = (args) => async (dispatch, getState) => {
    try {
        const comments = await getWeddingCommentsAPI(args);

        return {
            comments: comments.getWeddingComments,
            signal: 1
        };
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const createWeddingCommentsActionHandler = (args) => async (dispatch, getState) => {
    try {
        const res = await createWeddingCommentsAPI(args);
        if (res.createComment) {
            return {
                comment: res.createComment,
                signal: 1
            };
        }

        return {signal: 0};
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const doCommentLikeActionHandler = (args) => async (dispatch, getState) => {
    try {
        const res = await doCommentLikeAPI(args);
        console.log(res);
        if (res) {
            return {
                likeUsers: res.doCommentLike.likeUsers,
                signal: 1
            }
        } else {
            return {
                signal: 0
            };
        }
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}

export const doCommentDislikeActionHandler = (args) => async (dispatch, getState) => {
    try {
        const res = await doCommentDislikeAPI(args);
        if (res) {
            return {
                dislikeUsers: res.doCommentDislike.dislikeUsers,
                signal: 1
            }
        } else {
            return {
                signal: 0
            };
        }
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}


export const deleteCommentActionHandler = (args) => async (dispatch, getState) => {
    try {
        const res = await deleteCommentAPI(args);
        if (res.deleteComment) {
            return {
                signal: 1
            }
        } else {
            return {
                signal: 0
            };
        }
    } catch (err) {
        console.log(err);
        return {
            signal: 0
        };
    }
}