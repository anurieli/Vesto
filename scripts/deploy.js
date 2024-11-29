// scripts/deploy.js

const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deploy MyToken (optional)
  const MyToken = await hre.ethers.getContractFactory('MyToken');
  const initialSupply = hre.ethers.parseEther('1000000'); // 1 million tokens
  const myToken = await MyToken.deploy(initialSupply);
  await myToken.waitForDeployment();
  const tokenAddress = await myToken.getAddress();

  console.log('MyToken deployed to:', tokenAddress);

  // Deploy VestingWallet
  //////MAKE FIELDS DYNAMIC INPUTS FOR EACH VESTING CONTRACT/////
  //const beneficiaryAddress = ''; 
  //const startTimestamp = Math.floor(Date.now() / 1000) + 60; // Starts in 1 minute
  //const vestingDuration = 60 * 60 * 24 * 30; // 30 days
  //const amount = hre.ethers.parseEther('1000'); // 1000 tokens
  //const isRevocable = true;

  const VestingWallet = await hre.ethers.getContractFactory('VestingWallet');
  const vestingWallet = await VestingWallet.deploy(tokenAddress,);
  await vestingWallet.waitForDeployment();
  const vestingWalletAddress = await vestingWallet.getAddress();

  console.log('VestingWallet deployed to:', vestingWalletAddress);

  // Transfer tokens to VestingWallet
  const amount = hre.ethers.parseEther('10000'); // 10,000 tokens
  const tx = await myToken.transfer(vestingWalletAddress, amount);
  await tx.wait();

  console.log('Transferred tokens to VestingWallet');

  // save the contract address to config.json for frontend access (inside of src/public)
  const fs = require('fs');
  const config = {
    vestingWalletAddress: vestingWalletAddress,
  };
  fs.writeFileSync('src/public/config.json', JSON.stringify(config, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
