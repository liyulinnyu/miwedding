import {postRequest} from './post';

export const signupAPI = async (args) => {
    const requestBody = {
        query: `
            mutation signupFunc($input: SignupInput){
                signup(input: $input)
            }
        `,
        variables: {
            input: args
        }
    }

    return await postRequest(requestBody);
}