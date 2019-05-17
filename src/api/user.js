import {postRequest} from './post';

export const getUserDataAPI = async (args) => {
    const requestBody = {
        query: `
            query getUserFunc($id: String!){
                getUser(userId: $id) {
                    _id,
                    username,
                    email,
                    comments {
                        _id
                    },
                    createdWedding {
                        _id,
                        weddingTitle,
                        backgroundImg
                    },
                    image,
                    likeMessage {
                        _id
                    },
                    dislikeMessage {
                        _id
                    },
                    replyMessage {
                        _id
                    }
                }
            }
        `,
        variables: {
            id: args.userId
        }
    }

    return await postRequest(requestBody);
}

export const changeUserImageAPI = async (args) => {
    const requestBody = {
        query: `
            mutation changeImageFunc($id: String!, $image: String!){
                changeUserImage(userId: $id, image: $image) {
                    image
                }
            }
        `,
        variables: {
            id: args.userId,
            image: args.image
        }
    }

    return await postRequest(requestBody);
}

export const getSavedWeddingAPI = async (args) => {
    const requestBody = {
        query: `
            query getSavedWeddingFunc($id: String!){
                getSavedWedding(userId: $id) {
                    savedWedding {
                        _id,
                        weddingTitle,
                        backgroundImg
                    }
                }
            }
        `,
        variables: {
            id: args.userId
        }
    }

    return await postRequest(requestBody);
}

export const deleteSingleWeddingAPI = async (args) => {
    const requestBody = {
        query: `
            mutation deleteSingleWeddingFunc($id: String!, $weddingId: String!){
                deleteSingleWedding(userId: $id, weddingId: $weddingId) {
                    createdWedding {
                        _id,
                        weddingTitle,
                        backgroundImg
                    }
                }
            }
        `,
        variables: {
            id: args.userId,
            weddingId: args.weddingId
        }
    }

    return await postRequest(requestBody);
}