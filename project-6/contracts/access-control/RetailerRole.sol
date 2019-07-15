pragma solidity >=0.4.24;

import "../../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";

// Define a contract 'RetailerRole' to manage this role - add, remove, check
contract RetailerRole {
  using Roles for Roles.Role;

  // Define a struct 'retailers' by inheriting from 'Roles' library, struct Role
  Roles.Role private retailers;

  // Define 2 events, one for Adding, and other for Removing
  event RetailerAdded(address indexed account);
  event RetailerRemoved(address indexed account);

  // In the constructor make the address that deploys this contract the 1st retailer
  constructor() public {
    _addRetailer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyRetailer() {
    require(retailers.has(msg.sender), "");
    _;
  }

  // Define a modifier that checks to see if address has the appropriate role
  modifier isRetailer(address _address) {
    require(retailers.has(_address), "");
    _;
  }

  // Define a function 'addRetailer' that adds this role
  function addRetailer(address account) public onlyRetailer {
    _addRetailer(account);
  }

  // Define a function 'renounceRetailer' to renounce this role
  function renounceRetailer() public {
    retailers.remove(msg.sender);
    emit RetailerRemoved(msg.sender);
  }

  // Define an internal function '_addRetailer' to add this role, called by 'addRetailer'
  function _addRetailer(address account) internal {
    retailers.add(account);
    emit RetailerAdded(account);
  }
}