module.exports = function (accounts, web3){
    return {
        farmName: "Yury's Farm",
        farmInfo: "Awesome wine farm in the middle of nowhere",
        farmLat: "-38.239770",
        farmLog: "144.341490",
        defaultPrice: 0.5,
        addressFarmer:accounts[1],
        addressDistributor:accounts[2],
        addressRetailer:accounts[3],
        addressConsumer:accounts[4],
        addressContractOwner: accounts[0],
        addressNull: "0x0000000000000000000000000000000000000000",

    }
};
