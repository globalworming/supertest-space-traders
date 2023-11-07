import assert from 'assert';
import request from 'supertest';
import {baseUrl, createAgent, waypoint, waypoints} from "./steps";
import Waypoint from "../model/waypoint";

describe('Starting System', () => {
    let agent

    beforeAll(async () => {
        agent = await createAgent()
    });


    describe('what we know about our starting location', () => {
        let waypointResponse

        beforeAll(async () => {
            await assert.ok(agent.details.headquarters.length > 0, 'body contains account id:\n' + JSON.stringify(agent.details));
            let headquartersWaypoint = new Waypoint(agent.details.headquarters)
            waypointResponse = await request(baseUrl)
                .get(waypoint(headquartersWaypoint))
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + agent.accessToken)
                .expect(200)

        });

        it('gives us the headquaters waypoint', async () => {
            await assert.equal(waypointResponse.body.data.type, 'PLANET', 'we start on a planet:\n' + JSON.stringify(waypointResponse.body));
        });

        it('starting waypoint has traits', async () => {
            await assert.ok(waypointResponse.body.data.traits.length > 0, 'waypoint has trait:\n' + JSON.stringify(waypointResponse.body));
        });
    });

    describe("a shipyard can be found", () => {
        it("should be one in the starting system", async () => {
            let headquartersWaypoint = new Waypoint(agent.details.headquarters)
            const waypointsResponse = await request(baseUrl)
                .get(waypoints(headquartersWaypoint, "SHIPYARD"))
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + agent.accessToken)
                .expect(200)

            const orbitalStation = waypointsResponse.body.data.find(it => it.type === "ORBITAL_STATION")
            const orbitalHasShipyardTrait = orbitalStation?.traits.some(it => it.symbol === "SHIPYARD")
            await assert.ok(orbitalStation && orbitalHasShipyardTrait, 'waypoints contains an orbital with the shipyard trait:\n' + JSON.stringify(waypointsResponse.body));
        })
    })


});
