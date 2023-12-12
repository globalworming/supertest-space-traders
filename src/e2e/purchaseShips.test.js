import {
    buyShipSuccessfully,
    createAgent,
    findWaypointWithMiningDroneAvailable,
    getShips,
    listShipTypesAvailable,
    waypointsWithShipyard
} from "./steps";
import {Agent} from "../model/agent";
import assert from "assert";
import Waypoint from "../model/waypoint";


describe('Purchase Starter Ship', () => {
    let agent

    beforeAll(async () => {
        agent = await createAgent();
    });

    describe("find mining drone ship", () => {
        it("is available at some shipyard", async () => {
            const waypoint = await findWaypointWithMiningDroneAvailable(agent);
            assert.ok(waypoint !== undefined, "expect to find a waypoint");
        })
    })

    describe("buy mining drone", () => {
        it("can be bought successfully", async () => {
            let waypointWhereMiningDroneIsAvailable = await findWaypointWithMiningDroneAvailable(agent);
            await buyShipSuccessfully("SHIP_MINING_DRONE", waypointWhereMiningDroneIsAvailable, agent)
        })
        it("increases ship count", async () => {
            const numberOfShipsBefore = (await getShips(agent)).body.data.length;
            let waypointWhereMiningDroneIsAvailable = await findWaypointWithMiningDroneAvailable(agent);
            await buyShipSuccessfully("SHIP_MINING_DRONE", waypointWhereMiningDroneIsAvailable, agent)
            const numberOfShipsNow = (await getShips(agent)).body.data.length;
            assert.ok(numberOfShipsNow === (numberOfShipsBefore + 1), "expect number of ships to be one more than before")
        })
    })

});