// src/public/js/app.js

// Fetch the ABI and contract address dynamically
let abi;
let contractAddress;
let provider;
let signer;
let contract;

async function init() {
  try {
    // Fetch the ABI
    const abiResponse = await fetch('js/VestingWallet.json');
    const abiData = await abiResponse.json();
    abi = abiData.abi;

    // Fetch the contract address
    const configResponse = await fetch('/config.json');
    const configData = await configResponse.json();
    contractAddress = configData.vestingWalletAddress;

    // Initialize the Ethereum provider and contract
    if (typeof window.ethereum !== 'undefined') {
      console.log('Connecting to Ethereum via MetaMask...');
      // Check if MetaMask is already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        // No accounts connected, request access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);
      console.log('Contract initialized:', contract);
    } else {
      alert('Please install MetaMask!');
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

// Call init on window load
window.addEventListener('load', init);