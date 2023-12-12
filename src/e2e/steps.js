import request from "supertest";
import {v4 as uuidv4} from "uuid";
import Agent from "../model/agent";
import Waypoint from "../model/waypoint";

export const baseUrl = 'https://api.spacetraders.io/v2'
const register = `/register`
export const myAgentEndpoint = `/my/agent`
export const myContractsEndpoint = `/my/contracts`
export const myShipsEndpoint = `/my/ships`

export const acceptContractEndpoint = (contractId) => `/my/contracts/${contractId}/accept`

/**
 * @param {Waypoint} waypoint
 */
export const waypoint = (waypoint) => `/systems/${waypoint.system}/waypoints/${waypoint.id}`
/**
 * @param {Waypoint} waypoint
 * @param {String} traitFilter
 */
export const waypoints = (waypoint, traitFilter) => `/systems/${waypoint.system}/waypoints?traits=${traitFilter}`
/**
 * @param {Waypoint} waypoint
 */
export const shipyard = (waypoint) => `/systems/${waypoint.system}/waypoints/${waypoint.id}/shipyard`

const expectStatus = (res, number) => {
    if (res.status !== number) {
        console.error(JSON.stringify(res.body, undefined, 2))
        return new Error("expected status code to be 200 but was " + res.status);
    }
};

let status200 = function (res) {
    return expectStatus(res, 200);
};

let status201 = function (res) {
    return expectStatus(res, 201);
};

/**
 * @returns {Promise<Agent>}
 */
export async function createAgent() {
    const requestAccountResponse = await requestNewAccountSuccessfully()
    const accessToken = requestAccountResponse.body.data.token;
    const myAgentResponse = await myAgent(accessToken);
    return new Agent(accessToken, myAgentResponse)
}


export const requestNewAccount = (
    symbol = uuidv4().replaceAll("-", "").substring(0, 14),
    faction = "COSMIC"
) =>
    request(baseUrl)
        .post(register)
        .send({
            "faction": faction,
            "symbol": symbol
        })
        .set('Accept', 'application/json');

export const requestNewAccountSuccessfully = async (symbol) =>
    await requestNewAccount(symbol).expect(status201);


export const myAgent = async accessToken => {
    await new Sleep(200)
    return await request(baseUrl)
        .get(myAgentEndpoint)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(status200);
};

export const listContracts = async accessToken => {
    await new Sleep(200)
    return await request(baseUrl)
        .get(myContractsEndpoint)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(status200);
};

export const acceptContract = async (contractId, accessToken) => {
    await new Sleep(200)
    return await request(baseUrl)
        .post(acceptContractEndpoint(contractId))
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(status200);
};

export const waypointsWithShipyard = async (agent) => {
    await new Sleep(200)
    return await request(baseUrl)
        .get(waypoints(agent.headquatersWaypoint, "SHIPYARD"))
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + agent.accessToken)
        .expect(status200)
}

export const getShips = async (agent) => {
    await new Sleep(200)
    return await request(baseUrl)
        .get(myShipsEndpoint)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + agent.accessToken)

}

export const buyShipSuccessfully = async (type, waypoint, agent) => {
    await new Sleep(200)
    return await request(baseUrl)
        .post(myShipsEndpoint)
        .send({"shipType": type,"waypointSymbol": waypoint.id})
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + agent.accessToken)
        .expect(status201)
}

/**
 * @param {Waypoint} waypoint
 * @param {String} accessToken
 * @returns {Promise<*>}
 */
export async function listShipTypesAvailable(waypoint, accessToken) {
    await new Sleep(200)
    return await request(baseUrl)
        .get(shipyard(waypoint))
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken);
}


export const findWaypointWithMiningDroneAvailable = async agent => {
    let waypointWhereMiningDroneIsAvailable;
    const shipyards = (await waypointsWithShipyard(agent)).body.data;
    for (let i = 0; i < shipyards.length; i++) {
        const shipyard = shipyards[i];
        const waypointWithShipyard = new Waypoint(shipyard.symbol)
        const shipTypesAvailableResponse = await listShipTypesAvailable(waypointWithShipyard, agent.accessToken);
        if (shipTypesAvailableResponse.body.data.shipTypes.some(it => it.type === "SHIP_MINING_DRONE")) {
            waypointWhereMiningDroneIsAvailable = waypointWithShipyard;
            break;
        }
    }
    return waypointWhereMiningDroneIsAvailable;
};

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}