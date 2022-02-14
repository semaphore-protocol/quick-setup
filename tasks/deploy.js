const { IncrementalMerkleTree } = require("@zk-kit/incremental-merkle-tree")
const { poseidon } = require("circomlibjs")
const identityCommitments = require("../static/identityCommitments.json")
const { task, types } = require("hardhat/config")

task("deploy", "Deploy a Greeters contract")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }) => {
        const ContractFactory = await ethers.getContractFactory("Greeters")
        const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2)

        for (const identityCommitment of identityCommitments) {
            tree.insert(identityCommitment)
        }

        const contract = await ContractFactory.deploy(tree.root)

        await contract.deployed()

        logs && console.log(`Greeters contract has been deployed to: ${contract.address}`)

        return contract
    })
