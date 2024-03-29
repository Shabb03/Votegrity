async function main() {
  // Load the compiled contract
  const Vote = await hre.ethers.getContractFactory("Vote");

  // Deploy the contract
  const vote = await Vote.deploy();

  console.log("Contract deployed to address:", vote.target);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });