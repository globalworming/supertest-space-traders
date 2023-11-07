import request from "supertest";
import {v4 as uuidv4} from "uuid";
import Agent from "../model/agent";

export const baseUrl = 'https://api.spacetraders.io/v2'
const register = `/register`
export const myAgentEndpoint = `/my/agent`
export const myContractsEndpoint = `/my/contracts`

export const acceptContractEndpoint = (contractId) => `/my/contracts/${contractId}/accept`

/**
 * @param {Waypoint} waypoint
 */
export const waypoint = (waypoint) => `/systems/${waypoint.system}/waypoints/${waypoint.id}`
export const waypoints = (waypoint, traitFilter) => `/systems/${waypoint.system}/waypoints?traits=${traitFilter}`


/**
 * @returns {Promise<Agent>}
 */
export async function createAgent() {
    const requestAccountResponse = await requestNewAccount()
    const accessToken = requestAccountResponse.body.data.token;
    const myAgentResponse = await myAgent(accessToken);
    return new Agent(accessToken, myAgentResponse)
}


export const requestNewAccount = async () => await request(baseUrl)
    .post(register)
    .send({
        "faction": "COSMIC",
        "symbol": uuidv4().replaceAll("-", "").substring(0, 14)
    })
    .set('Accept', 'application/json')
    .expect(201);


export const myAgent = async accessToken => {
    await new Sleep(200)
    return await request(baseUrl)
        .get(myAgentEndpoint)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200);
};

export const listContracts = async accessToken => {
    await new Sleep(200)
    return await request(baseUrl)
        .get(myContractsEndpoint)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200);
};

export const acceptContract = async (contractId, accessToken) => {
    await new Sleep(200)
    return await request(baseUrl)
        .post(acceptContractEndpoint(contractId))
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200);
};

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}