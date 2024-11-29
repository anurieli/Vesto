// src/public/js/beneficiary.js

async function loadBeneficiaryDashboard() {
  // Ensure contract is initialized
  if (typeof window.contract === 'undefined') {
    setTimeout(loadBeneficiaryDashboard, 500); // Retry after delay
    return;
  }

  try {
    // Get the connected wallet address
    const beneficiaryAddress = await window.signer.getAddress();

    // Check if there is an active vesting
    const active = await window.contract.vestingActive();

    if (active) {
      // Fetch contract data
      const totalAmount = await window.contract.getTotalAmount(); // BigNumber
      const released = await window.contract.getReleased(); // BigNumber
      const start = await window.contract.getStart(); // BigNumber
      const duration = await window.contract.getDuration(); // BigNumber
      const contractBeneficiary = await window.contract.getBeneficiary();

      // Check if connected account is the beneficiary
      if (beneficiaryAddress.toLowerCase() !== contractBeneficiary.toLowerCase()) {
        alert('You are not the beneficiary.');
        return;
      }

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

      // Amount available to withdraw
      const availableToWithdraw = amountVested.sub(released);

      // Calculate percentage vested
      const percentageVested = amountVested.mul(100).div(totalAmount);

      // Update UI
      document.getElementById('total-amount').innerText = ethers.utils.formatEther(totalAmount) + ' Tokens';
      document.getElementById('amount-vested').innerText = ethers.utils.formatEther(amountVested) + ' Tokens';
      document.getElementById('percentage-vested').innerText = percentageVested.toString() + '%';
      document.getElementById('available-to-withdraw').innerText = ethers.utils.formatEther(availableToWithdraw) + ' Tokens';

      // Disable release button if nothing to withdraw
      if (availableToWithdraw.lte(ethers.BigNumber.from('0'))) {
        document.getElementById('release-button').disabled = true;
      } else {
        document.getElementById('release-button').disabled = false;
      }

    } else {
      // No active vesting
      document.getElementById('vesting-info').innerHTML = '<p>No active vesting contract.</p>';
      document.getElementById('release-button').style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading beneficiary dashboard:', error);
    alert('Error loading beneficiary dashboard. Please check the console for details.');
  }
}

document.getElementById('release-button').addEventListener('click', async () => {
  try {
    const tx = await window.contract.release();
    await tx.wait();
    alert('Tokens released successfully!');
    loadBeneficiaryDashboard();
  } catch (error) {
    console.error('Error releasing tokens:', error);
    alert('Error releasing tokens. Please check the console for details.');
  }
});

// Load dashboard data
window.addEventListener('load', loadBeneficiaryDashboard);
