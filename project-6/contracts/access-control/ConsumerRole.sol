pragma solidity >=0.4.24;

import "../../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";

// Define a contract 'ConsumerRole' to manage this role - add, remove, check
contract ConsumerRole {
  using Roles for Roles.Role;

  // Define a struct 'distributors' by inheriting from 'Roles' library, struct Role
  Roles.Role private consumers;

  // Define 2 events, one for Adding, and other for Removing
  event ConsumerAdded(address indexed account);
  event ConsumerRemoved(address indexed account);

  // In the constructor make the address that deploys this contract the 1st consumer
  constructor() public {
    _addConsumer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyConsumer() {
    require(consumers.has(msg.sender), "");
    _;
  }

  // Define a modifier that checks to see if address has the appropriate role
  modifier isConsumer(address _address) {
    require(consumers.has(_address), "");
    _;
  }

  // Define a function 'addConsumer' that adds this role
  function addConsumer(address account) public onlyConsumer {
    _addConsumer(account);
  }

  // Define a function 'renounceConsumer' to renounce this role
  function renounceConsumer() public {
    consumers.remove(msg.sender);
    emit ConsumerRemoved(msg.sender);
  }

  // Define an internal function '_addConsumer' to add this role, called by 'addConsumer'
  function _addConsumer(address account) internal {
    consumers.add(account);
    emit ConsumerAdded(account);
  }
}