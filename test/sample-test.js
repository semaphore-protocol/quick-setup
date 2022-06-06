const { Identity } = require("@semaphore-protocol/identity")
const {
    createMerkleProof,
    generateProof,
    packToSolidityProof,
    generateNullifierHash
} = require("@semaphore-protocol/proof")
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
            const message = await signers[0].signMessage("Sign this message to create your identity!")

            const identity = new Identity(message)
            const identityCommitment = identity.generateCommitment()
            const greeting = "Hello world"
            const bytes32Greeting = ethers.utils.formatBytes32String(greeting)

            const merkleProof = createMerkleProof(20, BigInt(0), identityCommitments, identityCommitment)

            const fullProof = await generateProof(identity, merkleProof, merkleProof.root, greeting, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const nullifierHash = generateNullifierHash(merkleProof.root, identity.getNullifier())

            const transaction = contract.greet(bytes32Greeting, nullifierHash, solidityProof)

            await expect(transaction).to.emit(contract, "NewGreeting").withArgs(bytes32Greeting)
        })
    })
})
