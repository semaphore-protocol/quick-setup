const { Identity } = require("@semaphore-protocol/identity")
const { Group } = require("@semaphore-protocol/group")
const { generateProof, packToSolidityProof } = require("@semaphore-protocol/proof")
const identityCommitments = require("../static/identityCommitments.json")
const { expect } = require("chai")
const { run, ethers } = require("hardhat")

describe("Greeters", function () {
    let contract
    let signers

    before(async () => {
        contract = await run("deploy", { logs: false })

        signers = await ethers.getSigners()
    })

    describe("# greet", () => {
        const wasmFilePath = "./static/semaphore.wasm"
        const zkeyFilePath = "./static/semaphore.zkey"

        it("Should greet", async () => {
            const greeting = "Hello world"
            const bytes32Greeting = ethers.utils.formatBytes32String(greeting)

            const message = await signers[0].signMessage("Sign this message to create your identity!")
            const identity = new Identity(message)

            const group = new Group()

            group.addMembers(identityCommitments)

            const fullProof = await generateProof(identity, group, group.root, greeting, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = contract.greet(bytes32Greeting, fullProof.publicSignals.nullifierHash, solidityProof)

            await expect(transaction).to.emit(contract, "NewGreeting").withArgs(bytes32Greeting)
        })
    })
})
