// src/public/js/owner.js

async function loadOwnerDashboard() {
  // Ensure contract is initialized
  if (typeof window.contract === 'undefined') {
    setTimeout(loadOwnerDashboard, 500); // Retry after delay
    return;
  }

  try {
    // display wallet address on owner dashboard
    const ownerAddress = await window.signer.getAddress();
    document.getElementById('wallet-address').innerText = ownerAddress;

    // Check if the connected account is the owner of the contract
    const contractOwner = await window.contract.owner();
    if (ownerAddress.toLowerCase() !== contractOwner.toLowerCase()) {
      alert('You are not the owner of this contract.');
      return;
    }

    // Check if there is an active vesting
    const active = await window.contract.vestingActive();

    if (active) {
      // Show vesting info, hide create vesting form
      document.getElementById('vesting-info').style.display = 'block';
      document.getElementById('create-vesting-form').style.display = 'none';

      // Fetch contract data
      const totalAmount = await window.contract.getTotalAmount(); // BigNumber
      const released = await window.contract.getReleased(); // BigNumber
      const start = await window.contract.getStart(); // BigNumber
      const duration = await window.contract.getDuration(); // BigNumber

      // Calculate amount vested
      const currentTime = ethers.BigNumber.from(Math.floor(Date.now() / 1000));
      let amountVested;
      if (currentTime.gte(start.add(duration))) {
        amountVested = totalAmount;
      } else if (currentTime.lt(start)) {
        amountVested = ethers.BigNumber.from('0');
      } else {
        amountVested = totalAmount.mul(currentTime.sub(start)).div(duration);
      }

      // Calculate time left
      const endTime = start.add(duration);
      const timeLeft = endTime.gt(currentTime) ? endTime.sub(currentTime) : ethers.BigNumber.from('0');

      // Update UI
      document.getElementById('total-amount').innerText = ethers.utils.formatEther(totalAmount) + ' Tokens';
      document.getElementById('amount-vested').innerText = ethers.utils.formatEther(amountVested) + ' Tokens';
      document.getElementById('time-left').innerText = formatDuration(timeLeft.toNumber());

    } else {
      // Hide vesting info, show create vesting form
      document.getElementById('vesting-info').style.display = 'none';
      document.getElementById('create-vesting-form').style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading owner dashboard:', error);
    alert('Error loading owner dashboard. Please check the console for details.');
  }
}

function formatDuration(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hrs}h ${mins}m`;
}

// Update slider value
function updateSliderValue(id, value) {
  document.getElementById(`${id}-output`).innerText = `Selected: ${value}`;
}


document.getElementById('revoke-button').addEventListener('click', async () => {
  try {
    const tx = await window.contract.revoke();
    await tx.wait();
    alert('Contract revoked successfully!');
    loadOwnerDashboard();
  } catch (error) {
    console.error('Error revoking contract:', error);
    alert('Error revoking contract. Please check the console for details.');
  }
});

document.getElementById('vesting-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const beneficiaryAddress = document.getElementById('beneficiary-address').value;
  const amountInput = document.getElementById('amount').value;
  const years = parseInt(document.getElementById('years').value) || 0;
  const months = parseInt(document.getElementById('months').value) || 0;
  const days = parseInt(document.getElementById('days').value) || 0;
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const revocableInput = document.getElementById('revocable').value;

  if (!beneficiaryAddress || !amountInput) {
    alert('Please fill in all required fields.');
    return;
  }

  const amount = ethers.utils.parseEther(amountInput);

  // Convert duration to seconds using BigNumber
  const durationInSeconds = ethers.BigNumber.from(years).mul(31536000)
    .add(ethers.BigNumber.from(months).mul(2592000))
    .add(ethers.BigNumber.from(days).mul(86400))
    .add(ethers.BigNumber.from(hours).mul(3600))
    .add(ethers.BigNumber.from(minutes).mul(60));

  if (durationInSeconds.lte(ethers.BigNumber.from('0'))) {
    alert('Duration must be greater than zero.');
    return;
  }

  const isRevocable = revocableInput === 'true';
  const startTimestamp = ethers.BigNumber.from(Math.floor(Date.now() / 1000)); // Start now

  try {
    const tx = await window.contract.createVesting(
      beneficiaryAddress,
      startTimestamp,
      durationInSeconds,
      amount,
      isRevocable
    );
    await tx.wait();
    alert('Vesting contract created successfully!');
    loadOwnerDashboard();
  } catch (error) {
    console.error('Error creating vesting contract:', error);
    alert('Error creating vesting contract. Please check the console for details.');
  }
});

// Load dashboard data
window.addEventListener('load', loadOwnerDashboard);
