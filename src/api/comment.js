import {postRequest} from './post';

export const getWeddingCommentsAPI = async (args) => {
    const requestBody = {
        query: `
            query getCommentsFunc($weddingId: String!, $num: Int!, $offset: Int!){
                getWeddingComments(weddingId: $weddingId, num: $num, offset: $offset) {
                    _id,
                    weddingId,
                    creator {
                        _id,
                        username,
                        image
                    },
                    respondent {
                        _id,
                        username
                    },
                    date,
                    content,
                    likeUsers {
                        _id
                    },
                    dislikeUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            weddingId: args.weddingId, 
            num: args.num, 
            offset: args.offset
        }
    }

    return await postRequest(requestBody);
}



export const createWeddingCommentsAPI = async (args) => {
    const requestBody = {
        query: `
            mutation createCommentFunc($weddingId: String!, $content: String!, $creator: String!, $respondent: String!){
                createComment(weddingId: $weddingId, content: $content, creator: $creator, respondent: $respondent) {
                    _id,
                    creator {
                        _id,
                        username,
                        image
                    },
                    respondent {
                        _id,
                        username
                    },
                    date,
                    content,
                    likeUsers {
                        _id
                    },
                    dislikeUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            weddingId: args.weddingId, 
            content: args.content,
            creator: args.creator,
            respondent: args.respondent
        }
    }

    return await postRequest(requestBody);
}



export const doCommentLikeAPI = async (args) => {
    const requestBody = {
        query: `
            mutation doLikeFunc($commentId: String!, $userId: String!){
                doCommentLike(commentId: $commentId, userId: $userId) {
                    likeUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            commentId: args.commentId, 
            userId: args.userId
        }
    }

    return await postRequest(requestBody);
}

export const doCommentDislikeAPI = async (args) => {
    const requestBody = {
        query: `
            mutation doDislikeFunc($commentId: String!, $userId: String!){
                doCommentDislike(commentId: $commentId, userId: $userId) {
                    dislikeUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            commentId: args.commentId, 
            userId: args.userId
        }
    }

    return await postRequest(requestBody);
}

export const deleteCommentAPI = async (args) => {
    const requestBody = {
        query: `
            mutation deleteCommentFunc($commentId: String!){
                deleteComment(commentId: $commentId) 
            }
        `,
        variables: {
            commentId: args.commentId
        }
    }

    return await postRequest(requestBody);
}