const { IncrementalMerkleTree } = require("@zk-kit/incremental-merkle-tree")
const { poseidon } = require("circomlibjs")
const identityCommitments = require("../static/identityCommitments.json")
const { task, types } = require("hardhat/config")

task("deploy", "Deploy a Greeters contract")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }) => {
        const VerifierContract = await ethers.getContractFactory("Verifier20")
        const verifier = await VerifierContract.deploy()

        await verifier.deployed()

        logs && console.log(`Verifier20 contract has been deployed to: ${verifier.address}`)

        const GreetersContract = await ethers.getContractFactory("Greeters")

        const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2)

        for (const identityCommitment of identityCommitments) {
            tree.insert(identityCommitment)
        }

        const greeters = await GreetersContract.deploy(tree.root, verifier.address)

        await greeters.deployed()

        logs && console.log(`Greeters contract has been deployed to: ${greeters.address}`)

        return greeters
    })
