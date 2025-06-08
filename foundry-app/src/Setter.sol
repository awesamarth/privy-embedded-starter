// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract Setter {
    uint256 public value;

    function setValue(uint _newValue) public {
        value = _newValue;
    }

}
