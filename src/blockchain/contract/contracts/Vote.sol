// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    struct Ballot {
        address voterAddress; // Address of the voter
        bytes32 encryptedVote; // Homomorphically encrypted ballot
        bytes32 blindSignature; // Blind signature of the ballot
        bool isCast; // Flag indicating if the ballot has been cast
    }

    mapping(address => Ballot) public ballots;

    // Event to log ballot submission
    event BallotSubmitted(address indexed voterAddress);

    // Modifier to restrict access to registered voters only
    modifier onlyRegisteredVoter() {
        require(ballots[msg.sender].voterAddress == msg.sender, "Only registered voters allowed");
        _;
    }

    // Function to register a voter
    //function registerVoter() external {
        // Perform voter registration logic here
        // Ensure only eligible voters are registered
        // For example: require(voterEligibility[msg.sender] == true, "Voter not eligible");
        
        // Set voter's address in the ballot mapping
        //ballots[msg.sender].voterAddress = msg.sender;
    //}

    // Function to submit a ballot
    function submitBallot(bytes32 _encryptedVote, bytes32 _blindSignature) external onlyRegisteredVoter {
        // Ensure the ballot has not been cast before
        require(!ballots[msg.sender].isCast, "Ballot already cast");

        // Store the encrypted ballot and blind signature
        ballots[msg.sender].encryptedVote = _encryptedVote;
        ballots[msg.sender].blindSignature = _blindSignature;

        // Mark the ballot as cast
        ballots[msg.sender].isCast = true;

        // Emit event for ballot submission
        emit BallotSubmitted(msg.sender);
    }

    // Function to retrieve the encrypted ballot for a voter
    function getEncryptedBallot(address _voterAddress) external view returns (bytes32) {
        return ballots[_voterAddress].encryptedVote;
    }

    // Function to retrieve the blind signature for a voter
    function getBlindSignature(address _voterAddress) external view returns (bytes32) {
        return ballots[_voterAddress].blindSignature;
    }
}