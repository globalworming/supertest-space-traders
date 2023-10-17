import request from "supertest";
import {v4 as uuidv4} from "uuid";

export const baseUrl = 'https://api.spacetraders.io/v2'
const register = `/register`
export const myAgentEndpoint = `/my/agent`
/**
 * @param {Waypoint} waypoint
 */
export const waypoint = (waypoint) => `/systems/${waypoint.system}/waypoints/${waypoint.id}`

export const requestAccount = async () => await request(baseUrl)
    .post(register)
    .send({
        "faction": "COSMIC",
        "symbol": uuidv4().replaceAll("-", "").substring(0, 14)
    })
    .set('Accept', 'application/json')
    .expect(201);


export const myAgent = async accessToken =>
    await request(baseUrl)
        .get(myAgentEndpoint)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200);