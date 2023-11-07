import Waypoint from "./waypoint";

class Agent {
    accessToken
    details
    headquatersWaypoint

    constructor(accessToken, myAgentResponse) {
        this.accessToken = accessToken
        this.details = myAgentResponse.body.data
        this.headquatersWaypoint = new Waypoint(this.details.headquarters)
    }

}

export default Agent