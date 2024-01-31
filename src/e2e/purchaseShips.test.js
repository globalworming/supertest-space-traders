import {buyShip, buyShipSuccessfully, createAgent, findWaypointWithMiningDroneAvailable, getShips} from "./steps";
import {Agent} from "../model/agent";
import assert from "assert";


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

    describe("buying a ship without money", () => {
        it("should show an error", async () => {
            let waypointWhereMiningDroneIsAvailable = await findWaypointWithMiningDroneAvailable(agent);
            let buyShipResponse;
            for (let i = 0; i < 10; i++) {
                buyShipResponse = await buyShip("SHIP_MINING_DRONE", waypointWhereMiningDroneIsAvailable, agent);
                if (buyShipResponse.status !== 201) break;
            }
            assert.equal(buyShipResponse.status, 400, JSON.stringify(buyShipResponse))
            assert.ok(buyShipResponse.body.error.message.includes("insufficient funds"), "expect error message to include 'insufficient funds' but was " + buyShipResponse.body.error.message)
        }, 10000)
    })

});