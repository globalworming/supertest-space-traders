import assert from 'assert';
import request from 'supertest';
import {baseUrl, myAgent, myAgentEndpoint, requestNewAccount, requestNewAccountSuccessfully} from "./steps";


describe('Auth', () => {
    describe('new account creation', () => {
        it('gives access token on successful registration', async () => {
            const response = await requestNewAccountSuccessfully()
            await assert.ok(response.body.data.token.length > 0, 'body contains token');
        });

        it('should fail when symbol is above 14 chars length', async () => {
            await requestNewAccount("B".repeat(15)).expect(422)
        });

        it('should fail when symbol is already taken', async () => {
            const response = await requestNewAccountSuccessfully()
            const agentSymbol = response.body.data.agent.symbol
            await requestNewAccount(agentSymbol).expect(409)
        });

        it('should fail when the faction doesn\'t exist', async () => {
            await requestNewAccount(undefined ,"THIS_FACTION_IS_NOT_VALID").expect(422)
        });
    });

    describe('account info', () => {
        it('shows account info given an access token', async () => {
            const requestAccountResponse = await requestNewAccountSuccessfully()
            const accessToken = requestAccountResponse.body.data.token;
            const response = await myAgent(accessToken)
            await assert.ok(response.body.data.accountId.length > 0, 'body contains account id:\n' + JSON.stringify(response.body));
        })

        it('returns status 401 without access token', async () => {
            await request(baseUrl)
                .get(myAgentEndpoint)
                .set('Accept', 'application/json')
                .expect(401);
        })

        it('return status 401 with expired access token', async () => {
            const expiredToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiU09NRV9TWU1CT0wiLCJ2ZXJzaW9uIjoidjIiLCJyZXNldF9kYXRlIjoiMjAyMy0xMC0xNCIsImlhdCI6MTY5NzU2OTUyMywic3ViIjoiYWdlbnQtdG9rZW4ifQ.Ho3kjFAf05ucZG2eacPdGnYcKKQbyO0splW1foChjvAqUuo47LplDtKSx327hocjRS-lEyohAG7SXPw3yBG5jpfHBoPKaNJAxxB3_bF-IRNSXg-OeJnIgR28t4xnTVAYuQ6hLZ-rSHC5fEooj3pkAHgYMCTIx9MKRTy0jLJcF74Lk-lqQ3YWHpJIBuYGQEnjWaGgkHMYlvnJ7LHwKfj7Me6YZ_Tf5T8uPbNbp6lVOzGVL1u1nCMizJvTVjUp_UV4M2eTNIn63RwWp5uVlmbfqTGJbPgG8Y1745NeilYkhxnrZQcemYFJXjHW01FH-da66XaU1BpSiCEy6MEIl5sWRA";
            await request(baseUrl)
                .get(myAgentEndpoint)
                .set('Authorization', 'Bearer ' + expiredToken)
                .set('Accept', 'application/json')
                .expect(401);
        })

    })
});
