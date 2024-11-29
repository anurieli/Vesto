// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VestingWallet is Ownable {
    // The ERC-20 token being vested
    IERC20 private immutable token;

    // Beneficiary of tokens after they are released
    address private beneficiary;

    // Timestamps and amounts
    uint256 private start;
    uint256 private duration;
    uint256 private totalAmount;
    uint256 private released;

    // Revocability status
    bool private revocable;

    // Active status
    bool private isActive;

    // Events
    event TokensReleased(uint256 amount);
    event VestingRevoked();
    event VestingCreated(
        address beneficiary,
        uint256 start,
        uint256 duration,
        uint256 totalAmount
    );

    constructor(address tokenAddress) Ownable(msg.sender) {
        require(tokenAddress != address(0), "Token address cannot be zero");
        token = IERC20(tokenAddress);
        isActive = false;
    }

    // Allows the owner to create a new vesting schedule if none exists
    function createVesting(
        address beneficiaryAddress,
        uint256 startTimestamp,
        uint256 vestingDuration,
        uint256 amount,
        bool isRevocable
    ) public onlyOwner {
        require(!isActive, "Vesting is already active");
        require(beneficiaryAddress != address(0), "Beneficiary address cannot be zero");
        require(vestingDuration > 0, "Duration must be greater than zero");
        require(amount > 0, "Amount must be greater than zero");
        require(token.balanceOf(address(this)) >= amount, "Insufficient tokens in contract");

        beneficiary = beneficiaryAddress;
        start = startTimestamp;
        duration = vestingDuration;
        totalAmount = amount;
        revocable = isRevocable;
        released = 0;
        isActive = true;

        emit VestingCreated(beneficiary, start, duration, totalAmount);
    }

    // Allows the beneficiary to release vested tokens
    function release() public {
        require(isActive, "No active vesting");
        uint256 unreleased = releasableAmount();

        require(unreleased > 0, "No tokens are due for release");
        require(msg.sender == beneficiary, "Only beneficiary can release tokens");

        released += unreleased;
        require(token.transfer(beneficiary, unreleased), "Token transfer failed");

        emit TokensReleased(unreleased);

        // If all tokens have been released, deactivate vesting
        if (released >= totalAmount) {
            isActive = false;
        }
    }

    // Calculates the amount of tokens that are releasable
    function releasableAmount() public view returns (uint256) {
        return vestedAmount() - released;
    }

    // Calculates the amount of tokens that have vested
    function vestedAmount() public view returns (uint256) {
        if (!isActive) {
            return 0;
        }
        uint256 totalBalance = totalAmount;

        if (block.timestamp < start) {
            return 0;
        } else if (block.timestamp >= start + duration) {
            return totalBalance;
        } else {
            return (totalBalance * (block.timestamp - start)) / duration;
        }
    }

    // Revokes the vesting contract if revocable
    function revoke() public onlyOwner {
        require(isActive, "No active vesting");
        require(revocable, "Vesting is not revocable");
        uint256 unreleased = token.balanceOf(address(this)) - released;

        require(token.transfer(owner(), unreleased), "Token transfer failed");

        isActive = false;

        emit VestingRevoked();
    }

    // Getter functions
    function getBeneficiary() external view returns (address) {
        return beneficiary;
    }

    function getStart() external view returns (uint256) {
        return start;
    }

    function getDuration() external view returns (uint256) {
        return duration;
    }

    function getTotalAmount() external view returns (uint256) {
        return totalAmount;
    }

    function getReleased() external view returns (uint256) {
        return released;
    }

    function contractRevocable() external view returns (bool) {
        return revocable;
    }

    function vestingActive() external view returns (bool) {
        return isActive;
    }
}
