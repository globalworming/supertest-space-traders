import assert from 'assert';
import request from 'supertest';
import {baseUrl, myAgent, requestAccount, waypoint} from "./steps";
import Waypoint from "../model/waypoint";

describe('Starting System', () => {
    let myAgentResponse
    let accessToken

    beforeAll(async () => {
        const requestAccountResponse = await requestAccount()
        accessToken = requestAccountResponse.body.data.token;
        myAgentResponse = await myAgent(accessToken);
    });


    describe('what we know about our starting location', () => {
        let waypointResponse

        beforeAll(async () => {
            await assert.ok(myAgentResponse.body.data.headquarters.length > 0, 'body contains account id:\n' + JSON.stringify(myAgentResponse.body));
            let headquartersWaypoint = new Waypoint(myAgentResponse.body.data.headquarters)
            waypointResponse = await request(baseUrl)
                .get(waypoint(headquartersWaypoint))
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)

        });

        it('gives us the headquaters waypoint', async () => {
            await assert.equal(waypointResponse.body.data.type, 'PLANET', 'we start on a planet:\n' + JSON.stringify(waypointResponse.body));
        });

        it('starting waypoint has traits', async () => {
            await assert.ok(waypointResponse.body.data.traits.length > 0, 'waypoint has trait:\n' + JSON.stringify(waypointResponse.body));
        });
    });


});
