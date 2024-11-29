// src/public/js/owner.js

async function loadOwnerDashboard() {
  // Ensure contract is initialized
  if (typeof contract === 'undefined') {
    setTimeout(loadOwnerDashboard, 500); // Retry after delay
    return;
  }

  // Check if there is an active vesting
  const active = await contract.vestingActive();

  if (active) {
    // Show vesting info, hide create vesting form
    document.getElementById('vesting-info').style.display = 'block';
    document.getElementById('create-vesting-form').style.display = 'none';

    // Fetch contract data
    const totalAmount = await contract.getTotalAmount(); // BigInt
    const released = await contract.getReleased(); // BigInt
    const start = await contract.getStart(); // BigInt
    const duration = await contract.getDuration(); // BigInt

    // Calculate amount vested
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    let amountVested;
    if (currentTime >= start + duration) {
      amountVested = totalAmount;
    } else if (currentTime < start) {
      amountVested = 0n;
    } else {
      amountVested = (totalAmount * (currentTime - start)) / duration;
    }

    // Calculate time left
    const timeLeft = currentTime < start + duration ? (start + duration) - currentTime : 0n;

    // Update UI
    document.getElementById('total-amount').innerText = ethers.formatEther(totalAmount) + ' Tokens';
    document.getElementById('amount-vested').innerText = ethers.formatEther(amountVested) + ' Tokens';
    document.getElementById('time-left').innerText = formatDuration(Number(timeLeft));

  } else {
    // Hide vesting info, show create vesting form
    document.getElementById('vesting-info').style.display = 'none';
    document.getElementById('create-vesting-form').style.display = 'block';
  }
}

function formatDuration(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hrs}h ${mins}m`;
}

document.getElementById('revoke-button').addEventListener('click', async () => {
  const confirmRevocation = confirm('Are you sure you want to revoke the vesting contract?');
  if (confirmRevocation) {
    try {
      const tx = await contract.revoke();
      await tx.wait();
      alert('Contract revoked successfully!');
      loadOwnerDashboard();
    } catch (error) {
      console.error(error);
      alert('Error revoking contract.');
    }
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

  const amount = ethers.parseEther(amountInput);

  // Convert duration to seconds
  const durationInSeconds =
    BigInt(years * 31536000) + // 365 days * 24h * 3600s
    BigInt(months * 2592000) + // 30 days * 24h * 3600s
    BigInt(days * 86400) +
    BigInt(hours * 3600) +
    BigInt(minutes * 60);

  if (durationInSeconds <= 0n) {
    alert('Duration must be greater than zero.');
    return;
  }

  const isRevocable = revocableInput === 'true';
  const startTimestamp = BigInt(Math.floor(Date.now() / 1000)); // Start now

  try {
    const tx = await contract.createVesting(
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
    console.error(error);
    alert('Error creating vesting contract.');
  }
});

// Load dashboard data
window.addEventListener('load', loadOwnerDashboard);
