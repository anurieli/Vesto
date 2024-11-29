// src/public/js/beneficiary.js

async function loadBeneficiaryDashboard() {
  // Ensure contract is initialized
  if (typeof contract === 'undefined') {
    setTimeout(loadBeneficiaryDashboard, 500); // Retry after delay
    return;
  }

  // Check if there is an active vesting
  const active = await contract.vestingActive();

  if (active) {
    // Fetch contract data
    const totalAmount = await contract.getTotalAmount(); // BigInt
    const released = await contract.getReleased(); // BigInt
    const start = await contract.getStart(); // BigInt
    const duration = await contract.getDuration(); // BigInt
    const beneficiaryAddress = await contract.getBeneficiary();

    // Check if connected account is the beneficiary
    const signerAddress = await signer.getAddress();
    if (signerAddress.toLowerCase() !== beneficiaryAddress.toLowerCase()) {
      alert('You are not the beneficiary.');
      return;
    }

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

    // Amount available to withdraw
    const availableToWithdraw = amountVested - released;

    // Calculate percentage vested
    const percentageVested = (amountVested * 100n) / totalAmount;

    // Update UI
    document.getElementById('total-amount').innerText = ethers.formatEther(totalAmount) + ' Tokens';
    document.getElementById('amount-vested').innerText = ethers.formatEther(amountVested) + ' Tokens';
    document.getElementById('percentage-vested').innerText = percentageVested.toString() + '%';
    document.getElementById('available-to-withdraw').innerText = ethers.formatEther(availableToWithdraw) + ' Tokens';

    // Disable release button if nothing to withdraw
    if (availableToWithdraw <= 0n) {
      document.getElementById('release-button').disabled = true;
    } else {
      document.getElementById('release-button').disabled = false;
    }

  } else {
    // No active vesting
    document.getElementById('vesting-info').innerHTML = '<p>No active vesting contract.</p>';
    document.getElementById('release-button').style.display = 'none';
  }
}

document.getElementById('release-button').addEventListener('click', async () => {
  try {
    const tx = await contract.release();
    await tx.wait();
    alert('Tokens released successfully!');
    loadBeneficiaryDashboard();
  } catch (error) {
    console.error(error);
    alert('Error releasing tokens.');
  }
});

// Load dashboard data
window.addEventListener('load', loadBeneficiaryDashboard);
