import {postRequest} from './post';

export const loginAPI = async (args) => {
    const requestBody = {
        query: `
            query loginFunc($email: String!, $password: String!){
                login(email: $email, password: $password) {
                    currentUser {
                        _id,
                        username,
                        email,
                        comments {_id},
                        savedWedding{_id},
                        createdWedding{_id},
                        likeWedding{_id},
                        dislikeWedding{_id},
                        image,
                        clickedWedding{_id},
                        likeMessage{_id},
                        dislikeMessage{_id},
                        replyMessage{_id}
                    },
                    token,
                    tokenExp
                }
            }
        `,
        variables: {
            email: args.email,
            password: args.password
        }
    }
    return await postRequest(requestBody);
}