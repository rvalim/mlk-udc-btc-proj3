showHide = object => {
    if (object === 'dvFarm' || object === 'dvFetch')
        $("#dvProduct").hide();
    else
        $("#dvProduct").show();

    $("#dvFarm").hide();
    $("#dvDistributor").hide();
    $("#dvRetailer").hide();
    $("#dvConsumer").hide();
    $("#dvFetch").hide();

    $(`#${object}`).show();
}

App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        showHide('dvFarm');
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku");
        App.upc = $("#upc");
        App.harvestId = $("#harvestId");
        App.ownerID = $("#ownerID");
        App.originFarmerID = $("#originFarmerID");
        App.originFarmName = $("#originFarmName");
        App.originFarmInformation = $("#originFarmInformation");
        App.originFarmLatitude = $("#originFarmLatitude");
        App.originFarmLongitude = $("#originFarmLongitude");
        App.productNotes = $("#productNotes");
        App.productPrice = $("#productPrice");
        App.distributorID = $("#distributorID");
        App.retailerID = $("#retailerID");
        App.consumerID = $("#consumerID");
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function (err, res) {
            if (err) {
                console.log('Error:', err);
                return;
            }

            console.log('getMetaskID:', res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain = '../../build/contracts/SupplyChain.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function (data) {
            console.log('data', data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function (event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        var processFrom = $(event.target).data('from');

        console.log({ processId, processFrom });

        switch (processId) {
            case 11:
                return await App.registerFarm(event);
            case 12:
                return await App.getFarm(event);
            case 13:
                return await App.registerUser(event, processFrom);
            case 14:
                return await App.getByHarvestId(event);
            case 1:
                return await App.harvestItem(event);
            case 2:
                return await App.processItem(event);
            case 3:
                return await App.packItem(event);
            case 4:
                return await App.sellItem(event, processFrom);
            case 5:
                return await App.buyItem(event, processFrom);
            case 6:
                return await App.shipItem(event, processFrom);
            case 7:
                return await App.receiveItem(event, processFrom);
            case 8:
                return await App.toPlantItem(event);
            case 9:
                return await App.fetchItemBufferOne(event);
            case 10:
                return await App.fetchItemBufferTwo(event);
        }
    },

    toPlantItem: async function () {
        event.preventDefault();

        try {
            const instance = await App.contracts.SupplyChain.deployed()

            const result = await instance.toPlantItem(
                App.upc.val(),
                App.productNotes.val()
            )

            $("#ftc-item").text(result);
            console.log('toPlantItem', result);

            // instance.getSKUs.call(App.upc)
            //     .then(result => console.log(result))
            //     .catch(err => console.log('ricardo', err))

        }
        catch (err) {
            console.log(err.message);
        }
    },
    getByHarvestId:async function (event) {
        event.preventDefault();

        try {
            const instance = await App.contracts.SupplyChain.deployed()
            console.log(instance)

            const result = await instance.getByHarvestId(
                App.harvestId.val()
            )

            $("#ftc-item").text(result);
            console.log('getByHarvestId', result);

        }
        catch (err) {
            console.log(err.message);
        }
    },
    getFarm: async function (event) {
        event.preventDefault();

        try {
            const instance = await App.contracts.SupplyChain.deployed()
            console.log(instance)

            const result = await instance.fetchFarm(
                App.originFarmerID.val()
            )

            $("#ftc-item").text(result);
            console.log('getFarm', result);

        }
        catch (err) {
            console.log(err.message);
        }
    },

    registerFarm: async function (event) {
        event.preventDefault();

        try {
            const instance = await App.contracts.SupplyChain.deployed()
            console.log(instance)

            const result = await instance.addFarmer1(
                App.originFarmerID.val(),
                App.originFarmName.val(),
                App.originFarmInformation.val(),
                App.originFarmLatitude.val(),
                App.originFarmLongitude.val()
            )

            $("#ftc-item").text(result);
            console.log('registerFarm', result);

        }
        catch (err) {
            console.log(err.message);
        }
    },

    registerUser: async function (event, flFrom) {
        event.preventDefault();

        try {
            const instance = await App.contracts.SupplyChain.deployed()
            const result = null;
            console.log(instance)

            switch (flFrom) {
                case 'D':
                    result = await instance.addDistributor(App.distributorID.val());
                    break;
                case 'R':
                    result = await instance.addRetailer(App.retailerID.val());
                    break;
                case 'C':
                    result = await instance.addConsumer(App.consumerID.val());
                    break;
                default:
                    break;
            }

            $("#ftc-item").text(result);
            console.log('registerUser', result);

        }
        catch (err) {
            console.log(err.message);
        }
    },

    harvestItem: async function (event) {
        event.preventDefault();

        try {
            const instance = await App.contracts.SupplyChain.deployed()

            const result = await instance.harvestItem(
                App.upc.val(),
                App.metamaskAccountID,
                App.originFarmName.val(),
                App.originFarmInformation.val(),
                App.originFarmLatitude.val(),
                App.originFarmLongitude.val(),
                App.productNotes.val()
            )

            $("#ftc-item").text(result);
            console.log('harvestItem', result);

            // instance.getSKUs.call(App.upc)
            //     .then(result => console.log(result))
            //     .catch(err => console.log('ricardo', err))

        }
        catch (err) {
            console.log(err.message);
        }
    },

    processItem: function (event) {
        event.preventDefault();

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.processItem(
                App.sku.val(),
                { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            console.log('processItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    packItem: function (event) {
        event.preventDefault();

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.packItem(
                App.sku.val(),
                { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            console.log('packItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    sellItem: function (event, flFrom) {
        event.preventDefault();


        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.sellItem(
                App.sku.val(),
                getProductPrice(),
                { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            console.log('sellItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    getProductPrice: function () {
        return web3.toWei(App.productPrice.val(), "ether");
    },

    buyItem: function (event, flFrom) {
        event.preventDefault();


        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.buyItem(
                App.sku.val(),
                {
                    from: App.metamaskAccountID,
                    value: getProductPrice()
                });
        }).then(function (result) {
            $("#ftc-item").text(result);
            console.log('buyItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    shipItem: function (event, flFrom) {
        event.preventDefault();


        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.shipItem(
                App.sku.val(),
                { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            console.log('shipItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event, flFrom) {
        event.preventDefault();

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.receiveItem(
                App.sku.val(),
                { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            console.log('receiveItem', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
        event.preventDefault();

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.fetchItemBufferOne(App.sku);
        }).then(function (result) {
            $("#ftc-item").text(result);
            console.log('fetchItemBufferOne', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
        event.preventDefault();

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.fetchItemBufferTwo.call(App.sku);
        }).then(function (result) {
            $("#ftc-item").text(result);
            console.log('fetchItemBufferTwo', result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                    App.contracts.SupplyChain.currentProvider,
                    arguments
                );
            };
        }

        App.contracts.SupplyChain.deployed().then(function (instance) {
            var events = instance.allEvents(function (err, log) {
                if (!err)
                    $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
            });
        }).catch(function (err) {
            console.log(err.message);
        });

    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
