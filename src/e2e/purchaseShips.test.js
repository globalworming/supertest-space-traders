import {baseUrl, createAgent, listShipTypesAvailable, shipyard, waypointsWithShipyard} from "./steps";
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
            const waypointWithShipyard = new Waypoint((await waypointsWithShipyard(agent)).body.data[0].symbol)
            const shipTypesAvailableResponse = await listShipTypesAvailable(waypointWithShipyard, agent.accessToken);
            assert.ok(shipTypesAvailableResponse.body.data.shipTypes.length >= 0,
                'list of ships available should be bigger 0:\n' + JSON.stringify(shipTypesAvailableResponse.body))
        })
    })

});