export const postRequest = (requestBody) => {
    return (
        fetch('/graphql', {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(requestBody)
        }).then(res => res.json())
        .then(res => res.data)
        .catch(err => 0)
    )
}