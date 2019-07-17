const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = "spirit supply whale amount human item harsh scare congress discover talent hamster";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/8bee1f39d1c04dd7ac2045a2b22a422e");
      },
      network_id: "*" // Match any network id
    }
  }
};