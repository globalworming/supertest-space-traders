class Agent {
    accessToken
    details

    constructor(accessToken, myAgentResponse) {
        this.accessToken = accessToken
        this.details = myAgentResponse.body.data
    }

}

export default Agent