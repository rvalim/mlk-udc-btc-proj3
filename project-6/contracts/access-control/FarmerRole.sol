pragma solidity >=0.4.24;

import "../../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";

// Define a contract 'FarmerRole' to manage this role - add, remove, check
contract FarmerRole {
  using Roles for Roles.Role;

  // Define a struct 'farmers' by inheriting from 'Roles' library, struct Role
  Roles.Role private farmers;

  // Define 2 events, one for Adding, and other for Removing
  event FarmerAdded(address indexed account);
  event FarmerRemoved(address indexed account);

  // In the constructor make the address that deploys this contract the 1st farmer
  constructor() public {
    _addFarmer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyFarmer() {
    require(farmers.has(msg.sender), "Sender has no Farmer's Role");
    _;
  }

  // Define a modifier that checks to see if address has the appropriate role
  modifier isFarmer(address _address) {
    require(farmers.has(_address), "Address has no Farmer's Role");
    _;
  }

  //Define a function 'addFarmer' that adds this role
  function addFarmer(address account) public onlyFarmer {
    _addFarmer(account);
  }

  // Define a function 'renounceFarmer' to renounce this role
  function renounceFarmer() public {
    farmers.remove(msg.sender);
    emit FarmerRemoved(msg.sender);
  }

  // Define an internal function '_addFarmer' to add this role, called by 'addFarmer'
  function _addFarmer(address account) internal
  {
    farmers.add(account);
    emit FarmerAdded(account);
  }
}