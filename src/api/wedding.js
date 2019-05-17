import {postRequest} from './post';

export const createWeddingAPI = async (args) => {
    const requestBody = {
        query: `
            mutation createFunc($input: CreateWeddingInput){
                createWedding(input: $input) {
                    _id
                }
            }
        `,
        variables: {
            input: args
        }
    }
    return await postRequest(requestBody);
}

export const updateWeddingAPI = async (args) => {
    const requestBody = {
        query: `
            mutation updateFunc($input: UpdateWeddingInput){
                updateWedding(input: $input)
            }
        `,
        variables: {
            input: args
        }
    }
    return await postRequest(requestBody);
} 

export const getSingleWeddingAPI = async (args) => {
    const requestBody = {
        query: `
            query getFunc($id: String!){
                getOneWedding(weddingId: $id) {
                    _id,
                    creatorId {
                        _id,
                        username,
                        image
                    },
                    date,
                    country,
                    state,
                    city,
                    price,
                    backgroundImg,
                    weddingTitle,
                    weddingDate,
                    weddingYear,
                    weddingMonth,
                    weddingType,
                    designer,
                    customContent,
                    comments {
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
                    },
                    likeUsers {
                        _id
                    },
                    dislikeUsers {
                        _id
                    },
                    saveUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            id: args
        }
    }

    return await postRequest(requestBody);
}


export const doWeddingLikeAPI = async (args) => {
    const requestBody = {
        query: `
            mutation doLikeFunc($weddingId: String!, $userId: String!){
                doWeddingLike(weddingId: $weddingId, userId: $userId) {
                    likeUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            weddingId: args.weddingId,
            userId: args.userId
        }
    }
    return await postRequest(requestBody);
}

export const doWeddingDislikeAPI = async (args) => {
    const requestBody = {
        query: `
            mutation doDislikeFunc($weddingId: String!, $userId: String!){
                doWeddingDislike(weddingId: $weddingId, userId: $userId) {
                    dislikeUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            weddingId: args.weddingId,
            userId: args.userId
        }
    }
    return await postRequest(requestBody);
}

export const doWeddingSaveAPI = async (args) => {
    const requestBody = {
        query: `
            mutation doSaveFunc($weddingId: String!, $userId: String!){
                doWeddingSave(weddingId: $weddingId, userId: $userId) {
                    saveUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            weddingId: args.weddingId,
            userId: args.userId
        }
    }
    return await postRequest(requestBody);
}

export const removeWeddingLikeAPI = async (args) => {
    const requestBody = {
        query: `
            mutation removeLikeFunc($weddingId: String!, $userId: String!){
                removeWeddingLike(weddingId: $weddingId, userId: $userId) {
                    likeUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            weddingId: args.weddingId,
            userId: args.userId
        }
    }
    return await postRequest(requestBody);
}

export const removeWeddingDislikeAPI = async (args) => {
    const requestBody = {
        query: `
            mutation removeDislikeFunc($weddingId: String!, $userId: String!){
                removeWeddingDislike(weddingId: $weddingId, userId: $userId) {
                    dislikeUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            weddingId: args.weddingId,
            userId: args.userId
        }
    }
    return await postRequest(requestBody);
}

export const removeWeddingSaveAPI = async (args) => {
    const requestBody = {
        query: `
            mutation removeSaveFunc($weddingId: String!, $userId: String!){
                removeWeddingSave(weddingId: $weddingId, userId: $userId) {
                    saveUsers {
                        _id
                    }
                }
            }
        `,
        variables: {
            weddingId: args.weddingId,
            userId: args.userId
        }
    }
    return await postRequest(requestBody);
}


export const getSearchedWeddingAPI = async (args) => {
    const requestBody = {
        query: `
            query getWeddingFunc($input: GetSearchedWeddingInput){
                getSearchedWedding(input: $input) {
                    weddings {
                        _id,
                        creatorId {
                            _id,
                            username,
                            image
                        },
                        country,
                        price,
                        backgroundImg,
                        weddingTitle,
                        weddingDate,
                        city,
                        likeUsers {
                            _id
                        },
                        dislikeUsers {
                            _id
                        },
                        long,
                        lati
                    },
                    totalNum
                }
            }
        `,
        variables: {
            input: args
        }
    }
    return await postRequest(requestBody);
}

export const getCoordinateWeddingAPI = async () => {
    const requestBody = {
        query: `
            query {
                getCoordinateWedding {
                    _id,
                    price,
                    country,
                    city,
                    likeUsers {
                        _id
                    },
                    dislikeUsers {
                        _id
                    },
                    long,
                    lati
                }
            }
        `
    }
    return await postRequest(requestBody);
}