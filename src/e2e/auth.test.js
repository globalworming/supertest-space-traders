import assert from 'assert';
import request from 'supertest';
import {baseUrl, myAgent, myAgentEndpoint, requestAccount} from "./steps";


describe('Auth', () => {
    describe('new account creation', () => {
        it('gives access token on successful registration', async () => {
            const response = await requestAccount()
            await assert.ok(response.body.data.token.length > 0, 'body contains token');
        });
    });

    describe('account info', () => {
        it('shows account info given an access token', async () => {
            const requestAccountResponse = await requestAccount()
            const accessToken = requestAccountResponse.body.data.token;
            const response = await myAgent(accessToken)
            await assert.ok(response.body.data.accountId.length > 0, 'body contains account id:\n' + JSON.stringify(response.body));
        })

        it('throws error without access token', async () => {
            await request(baseUrl)
                .get(myAgentEndpoint)
                .set('Accept', 'application/json')
                .expect(401);
        })

    })
});
