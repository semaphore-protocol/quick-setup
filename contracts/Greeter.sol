//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@appliedzkp/semaphore-contracts/interfaces/IVerifier.sol";
import "@appliedzkp/semaphore-contracts/base/SemaphoreCore.sol";

/// @title Greeters contract.
/// @dev The following code is just a example to show how Semaphore con be used.
contract Greeters is SemaphoreCore {
    // A new greeting is published every time a user's proof is validated.
    event NewGreeting(string greeting);

    // Greeters are identified by a Merkle root.
    // The offchain Merkle tree contains the greeters' identity commitments.
    uint256 public greeters;

    IVerifier public verifier;

    constructor(uint256 _greeters, address _verifier) {
        greeters = _greeters;
        verifier = IVerifier(_verifier);
    }

    // Only users who create valid proofs can greet.
    // The external nullifier is in this example the root of the Merkle tree.
    function greet(
        string calldata _greeting,
        uint256 _nullifierHash,
        uint256[8] calldata _proof
    ) external {
        require(
            _isValidProof(_greeting, greeters, _nullifierHash, greeters, _proof, verifier),
            "Greeters: the proof is not valid"
        );

        // Prevent double-greeting (nullifierHash = hash(root + identityNullifier)).
        // Every user can greet once.
        _saveNullifierHash(_nullifierHash);

        emit NewGreeting(_greeting);
    }
}
