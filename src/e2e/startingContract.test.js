import {acceptContract, listContracts, myAgent, requestNewAccountSuccessfully} from "./steps";
import assert from "assert";

describe("starting contract", () => {

    describe("attributes", () => {
        let accessToken;
        let contractsResponse
        beforeAll(async () => {
            accessToken = (await requestNewAccountSuccessfully()).body.data.token;
            contractsResponse = await listContracts(accessToken)
        });


        it("one should exist", async () => {
            await assert.equal(contractsResponse.body.meta.total, 1, JSON.stringify(contractsResponse.body));
        })

        it("should not be fulfilled yet", async () => {
            await assert.equal(contractsResponse.body.data[0].accepted, false, JSON.stringify(contractsResponse.body));
        })

        it("should not be accepted yet", async () => {
            await assert.equal(contractsResponse.body.data[0].fulfilled, false, JSON.stringify(contractsResponse.body));
        })
    })

    describe("accepting it", () => {
        let accessToken;
        let contractsResponse
        beforeEach(async () => {
            accessToken = (await requestNewAccountSuccessfully()).body.data.token;
            contractsResponse = await listContracts(accessToken)
        })

        it("works", async () => {
            const contractId = contractsResponse.body.data[0].id;
            await acceptContract(contractId, accessToken)
            const contractsResponseAfterAccepting = await listContracts(accessToken)
            await assert.equal(contractsResponseAfterAccepting.body.data[0].accepted, true, JSON.stringify(contractsResponseAfterAccepting.body));
        })

        it("increases credits", async () => {
            const creditsBeforeAccepting = (await myAgent(accessToken)).body.data.credits
            const contractId = contractsResponse.body.data[0].id;
            await acceptContract(contractId, accessToken)
            const creditsAfterAccepting = (await myAgent(accessToken)).body.data.credits
            assert.ok(creditsAfterAccepting > creditsBeforeAccepting, `expect ${creditsAfterAccepting} to be higher than ${creditsBeforeAccepting}`)
        })
    })
})