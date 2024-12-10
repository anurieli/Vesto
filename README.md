# Vesting Wallet Project

This project is a decentralized token vesting wallet built on Ethereum, designed to allow owners to create token vesting schedules for beneficiaries. Beneficiaries can release vested tokens at specified intervals, ensuring secure and transparent distribution of tokens.

## Features

- **Owner Dashboard**: Create and manage vesting contracts.
- **Beneficiary Dashboard**: View and release tokens from active vesting contracts.
- **Multi-Beneficiary Support**: Multiple vesting schedules for different beneficiaries.
- **Customizable Timeframes**: Specify vesting duration in years, months, days, hours, and minutes.
- **Revocability**: Optionally revoke vesting schedules (if set as revocable).
- **Dynamic Interaction**: Real-time connection with the Ethereum blockchain via MetaMask.
- **Matrix Background Effect**: Visual enhancement for a futuristic interface.

## Technologies Used

- **Smart Contract Development**: Solidity
- **Frontend Development**: HTML, CSS, JavaScript
- **Ethereum Integration**: Ethers.js
- **Blockchain Interaction**: MetaMask
- **Development Framework**: Hardhat

## File Structure

```plaintext
project-directory/
├── contracts/
│   ├── VestingWallet.sol          # Smart contract for token vesting
│   ├── MyToken.sol                # Example ERC-20 token for testing
├── scripts/
│   ├── deploy.js                  # Deployment script for the smart contracts
│   ├── transferTokens.js          # Script to transfer tokens to the vesting contract
├── src/
│   ├── public/
│   │   ├── index.html             # Landing page for the app
│   │   ├── owner.html             # Owner dashboard
│   │   ├── beneficiary.html       # Beneficiary dashboard
│   │   ├── css/
│   │   │   └── styles.css         # Styling for the app
│   │   ├── js/
│   │   │   ├── app.js             # Common app initialization
│   │   │   ├── owner.js           # Owner-specific functionality
│   │   │   ├── beneficiary.js     # Beneficiary-specific functionality
│   │   │   └── matrix.js          # Matrix background effect
├── hardhat.config.js              # Hardhat configuration file
├── package.json                   # Project dependencies and scripts
├── README.md                      # Project documentation
```

## Installation

1. **Clone the Repository**
   ```
   git clone git@github.com:anurieli/Vesto.git
   cd <project-directory>
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Compile the Smart Contracts**
   ```
   npx hardhat compile
   ```

4. **Copy ABI Files**
   Ensure the ABI files are generated in `artifacts` and copy them to `src/public/js` if needed.


## Deployment

1. **Deploy the Smart Contracts**
-- Choose the network you want. By default we use a testnet

   ```
   npx hardhat run scripts/deploy.js --network sepolia
   ```

2. **Note the Contract Addresses**
   Record the deployed addresses of the `VestingWallet` and `MyToken` contracts. Update the `config.json` file in `src/public/`:
   ```json
   {
     "vestingWalletAddress": "<VestingWallet_Contract_Address>",
     "tokenAddress": "<MyToken_Contract_Address>"
   }
   ```


## Running the Application

1. **Start the Local Server**
   ```
   npm start
   ```

2. **Open in Browser**
   - Owner Dashboard: [http://localhost:3000/owner.html]
   - Beneficiary Dashboard: [http://localhost:3000/beneficiary.html]

## Usage

### Owner Dashboard
- **View Active Vesting Contracts**: Displays details of the current vesting schedule.
- **Create Vesting Contracts**: Specify beneficiary address, amount, and duration.
- **Revoke Contracts**: Terminate a revocable contract.

### Beneficiary Dashboard
- **View Vesting Contracts**: Displays information about active vesting schedules.
- **Release Tokens**: Withdraw tokens that have been vested.

## Testing

1. **Run Hardhat Tests**
   ```bash
   npx hardhat test
   ```

2. **Simulate Blockchain Interaction**
   Use a testnet like Sepolia or a local blockchain instance (e.g., Hardhat Network).

## Future Improvements

- **Multiple Vesting Contracts per Owner**: Allow owners to manage multiple schedules.
- **Advanced UI**: Enhance the dashboard with richer visuals and interaction.
- **Email Notifications**: Notify beneficiaries about vesting updates.
- **Support for Multiple Tokens**: Manage vesting across multiple ERC-20 tokens.
- **Off-chain Data Storage**: Use IPFS for storing large data associated with vesting schedules.

## Contributing

Feel free to contribute to this project. Fork the repository and submit pull requests with your proposed changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- **OpenZeppelin**: For reusable smart contract libraries.
- **Ethers.js**: For seamless Ethereum interaction.
- **MetaMask**: For blockchain wallet integration.

---

Happy building! 🚀
