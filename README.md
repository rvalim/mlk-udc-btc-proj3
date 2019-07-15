# Coffee Suply Chain

## Getting Started
The proposal of this document is to guide you over this project.

### Technical References

* [OpenZeppelin](https://www.npmjs.com/package/openzeppelin-solidity): v2.3.0 - A library for secure smart contract development
* [LiteServer](https://www.npmjs.com/package/lite-server): v2.4.0 - _Development only_ node server that serves a web app
* [Truffle](https://www.npmjs.com/package/truffle): v5.0.22 - Development environment, testing framework and asset pipeline for Ethereum
* [Ganacha CLI](https://www.npmjs.com/package/ganache-cli): v6.4.4 - Uses ethereumjs to simulate full client behavior and make developing Ethereum applications faster, easier, and safer
* [Metamask](https://metamask.io/): v6.7.2 - It allows you to run Ethereum dApps right in your browser without running a full Ethereum node
* [Solidity](https://solidity.readthedocs.io):  >=0.4.24 - Ethereum language for writing Smart Contracts
* [Node](https://nodejs.org): v12.6.0 - JavaScript runtime
* [Web3.js](https://web3js.readthedocs.io): v1.0.0-beta.37 - A collection of libraries which allow you to interact with a local or remote Ethereum node, using an HTTP, WebSocket or IPC connection

### Folder Structure

```
..
├── ...
├── project-6
|	├── contracts
|	|	|── access-control				# The RBAC is implemented here
|	|	|── coffeebase					# Where the contract code for our SupplyChain is located
|	|	└── ...
|	├── ...
|	├── src
|	|	|── js
|	|	|   |── app.js					# Where the front-end calls the Contract methods
|	|	|   └── truffle-contract.js
|	|── test
|	|   └── TestSupplychain.js			# Where the truffle tests are implemented
|	|── bs-config.json					# Configuration for Lite-Server
|	|── index.html						# The main page, where the front-end is located
|	|── ...
|	|── truffle-config.js				# Configuration for truffle commands, the address of ganache server goes here
|	|── ...
|── ...
|── 0_ganache-cli.txt					# Address created when running commented bellow
|── 1_start_ganache-cli.sh				# Command to start Ganache with a predefined Wallet
└── ...
```

### Running Solution

You will nedd three terminals:

 - Terminal 1:
	 - `npm run dev`: to start the litea-server
 - Terminal 2:
	 - `ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"`: To start Ganache with specific Wallets
 - Terminal 3
	 - `truffle compile`: To compile the contracts
	 - `truffle migrate`: To apply the contrats to the network


### Running Tests

## Diagrams

### Activity
![Activity Diagram](./images/uml_activity.png)

### Sequence
![Sequence Diagram](./images/uml_sequence.png)

### State
![State Diagram](./images/uml_state.png)

### Classes
![Class Diagram](./images/uml_class.png)


