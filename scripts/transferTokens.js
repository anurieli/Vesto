////////////////////////////////////////////////////////////////
////UNUSED CODE///////////////////////////////////////////////
////////////////////////////////////////////////////////////////

// scripts/transferTokens.js

const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const tokenAddress = '0x...'; // MyToken's address
  const vestingWalletAddress = '0x...'; // VestingWallet's address

  const MyToken = await hre.ethers.getContractAt('MyToken', tokenAddress);
  const amount = hre.ethers.utils.parseEther('1000'); // Amount to transfer

  const tx = await MyToken.transfer(vestingWalletAddress, amount);
  await tx.wait();

  console.log('Transferred tokens to VestingWallet');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
