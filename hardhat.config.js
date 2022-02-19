require("@nomiclabs/hardhat-waffle")
require("hardhat-dependency-compiler")
require("./tasks/deploy")

module.exports = {
    solidity: "0.8.4",
    dependencyCompiler: {
        paths: ["@appliedzkp/semaphore-contracts/base/Verifier.sol"]
    }
}
