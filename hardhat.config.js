require("@nomiclabs/hardhat-waffle")
require("hardhat-dependency-compiler")
require("./tasks/deploy") // Your deploy task.

module.exports = {
    solidity: "0.8.4",
    dependencyCompiler: {
        // It allows Hardhat to compile the external Verifier.sol contract.
        paths: ["@semaphore-protocol/contracts/base/Verifier.sol"]
    }
}
