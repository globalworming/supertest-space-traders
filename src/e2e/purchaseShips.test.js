import {baseUrl, createAgent, myAgent, requestNewAccountSuccessfully, shipyard, waypoint, waypointsWithShipyard} from "./steps";
import {Agent} from "../model/agent";
import request from "supertest";
import assert from "assert";
import Waypoint from "../model/waypoint";

describe('Purchase Ships', () => {
    let agent

    beforeAll(async () => {
        agent = await createAgent();
    });

    describe("list ships available", () => {
        it("shipyard list of ships is not empty", async () => {
            const waypointsWithShipyardResponse = await waypointsWithShipyard(agent);
            const orbitalWithShipyard = waypointsWithShipyardResponse.body.data.find(it => it.type === "ORBITAL_STATION")
            let url = shipyard(new Waypoint(orbitalWithShipyard.symbol));
            const shipyardResponse = await request(baseUrl)
                .get(url)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + agent.accessToken)

            assert.ok(shipyardResponse !== undefined)
        })
    })

});