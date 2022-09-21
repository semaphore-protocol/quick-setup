//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

/// @title Greeter contract.
/// @dev The following code is just a example to show how Semaphore con be used.
contract Greeter  {
    // A new greeting is published every time a user's proof is validated.
    event NewGreeting(bytes32 greeting);
    event NewUser(uint256 identityCommitment, bytes32 username);

    // The external verifier used to verify Semaphore proofs.
    ISemaphore public semaphore;

    uint256 groupId;
    mapping(uint256 => bytes32) users;

    constructor(address semaphoreAddress, uint256 _groupId) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = _groupId;

        semaphore.createGroup(groupId, 20, 0, address(this));
    }

    function registerUser(uint256 identityCommitment, bytes32 username) external {
        semaphore.addMember(groupId, identityCommitment);

        users[identityCommitment] = username;

        emit NewUser(identityCommitment, username);
    }

    // Only users who create valid proofs can greet.
    // The external nullifier is in this example the root of the Merkle tree.
    function greet(
        bytes32 greeting,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(groupId, merkleTreeRoot, greeting, nullifierHash, groupId, proof);

        emit NewGreeting(greeting);
    }
}
