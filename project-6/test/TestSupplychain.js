// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain');


contract('SupplyChain', function(accounts) {
    const Test = require("./testValues")(accounts, web3);
    const helper = require("./testHelper");
    let instance;

    beforeEach(async ()=> {
        instance = await SupplyChain.new({from: Test.addressContractOwner});

        helper.instance = instance;
        helper.farmer.me = Test.addressFarmer;
        helper.distributor.me = Test.addressDistributor;
        helper.retailer.me = Test.addressRetailer;
        helper.consumer.me = Test.addressConsumer;

        await instance.registerFarm(Test.addressFarmer,
            Test.farmName,
            Test.farmInfo,
            Test.farmLat,
            Test.farmLog);
        await instance.addDistributor(Test.addressDistributor);
        await instance.addRetailer(Test.addressRetailer);
        await instance.addConsumer(Test.addressConsumer);
    });


    describe("Farm Tests", async function() {
        describe("Farm Creation - Successful", async function () {
            const harvestId = 0
            const skuId = 0

            it("Creating new Farm", async function () {
                const result = await instance.registerFarm(
                    accounts[7],
                    Test.farmName,
                    Test.farmInfo,
                    Test.farmLat,
                    Test.farmLog,
                );

                let event = result.logs[0].event;
                assert.equal(event, 'FarmerAdded', `Unexpected event "${event}"`);

                const farm = await instance.fetchFarm.call(Test.addressFarmer);

                assert.equal(farm.originFarmName, Test.farmName, "Unexpected originFarmName returned");
                assert.equal(farm.originFarmInformation, Test.farmInfo, "Unexpected originFarmInformation returned");
                assert.equal(farm.originFarmLatitude, Test.farmLat, "Unexpected originFarmLatitude returned");
                assert.equal(farm.originFarmLongitude, Test.farmLog, "Unexpected originFarmLongitude returned");
            })

        })

        describe("Farm Harvest - Successful", async function () {

            it("Plant Item", async function () {
                const result = await helper.farmer.plantItem()

                let event = result.logs[0].event;
                assert.equal(event, 'Planted', `Unexpected event "${event}"`);

                let harvestId = result.logs[0].args.id.toNumber();
                const item = await instance.fetchHarvest.call(harvestId);

                assert.equal(item.upc, 38, "Unexpected upc returned");
                assert.equal(item.productNotes, 'NEW PRODUCTION BEEN MADE', "Unexpected productNotes returned");
                assert.equal(item.state, 'Planted', "Unexpected state returned");
            })

            it("Harvest Item", async function () {
                let result = await helper.farmer.harvestItem();

                let event = result.logs[0].event;
                assert.equal(event, 'Harvested', `Unexpected event "${event}"`);
            })

            it("Process Item", async function () {
                result = await helper.farmer.processItem();

                let event = result.logs[0].event;
                assert.equal(event, 'Processed', `Unexpected event "${event}"`);
            })

            it("Pack Item", async function () {
                result = await helper.farmer.packItem();

                let event = result.logs[0].event;
                assert.equal(event, 'Packed', `Unexpected event "${event}"`);
            })
        })

        describe("Farm Selling - Successful", async function () {
            it("Put Item for sale", async function () {
                result = await helper.farmer.putForSale();

                let event = result.logs[0].event;
                assert.equal(event, 'ForSale', `Unexpected event "${event}"`);
            })

            it("Ship Item", async function () {
                result = await helper.farmer.ship();

                event = result.logs[0].event;
                assert.equal(event, 'Shipped', `Unexpected event "${event}"`);
            })
        })

    })

    describe("Distributor Tests", async function() {
        describe("Buying", async function () {
            it("Buy Item", async function () {
                result = await helper.distributor.buyItem();
                event = result.logs[0].event;
                assert.equal(event, 'Sold', `Unexpected event "${event}"`);
            })

            it("Receive Item", async function () {
                result = await helper.distributor.receiveItem();

                event = result.logs[0].event;
                assert.equal(event, 'Received', `Unexpected event "${event}"`);
            })
        })

        describe("Selling", async function () {
            it("Put Item for sale", async function () {
                result = await helper.distributor.putForSale();

                event = result.logs[0].event;
                assert.equal(event, 'ForSale', `Unexpected event "${event}"`);
            })


            it("Ship Item", async function () {
                result = await helper.distributor.ship();

                event = result.logs[0].event;
                assert.equal(event, 'Shipped', `Unexpected event "${event}"`);
            })
        })
    })

    describe("Retailer Tests", async function() {
        describe("Buying", async function () {
            it("Buy Item", async function () {
                result = await helper.retailer.buyItem();

                event = result.logs[0].event;
                assert.equal(event, 'Sold', `Unexpected event "${event}"`);
            })

            it("Receive Item", async function () {
                result = await helper.retailer.receiveItem();

                event = result.logs[0].event;
                assert.equal(event, 'Received', `Unexpected event "${event}"`);
            })
        })

        describe("Selling", async function () {
            it("Put Item for sale", async function () {
                result = await helper.retailer.putForSale();

                event = result.logs[0].event;
                assert.equal(event, 'ForSale', `Unexpected event "${event}"`);
            })


            it("Ship Item", async function () {
                result = await helper.retailer.ship();

                event = result.logs[0].event;
                assert.equal(event, 'Shipped', `Unexpected event "${event}"`);
            })
        })
    })

    describe("Consumer Tests", async function() {
        describe("Buying", async function () {
            it("Buy Item", async function () {
                result = await helper.consumer.buyItem();

                event = result.logs[0].event;
                assert.equal(event, 'Sold', `Unexpected event "${event}"`);
            })

            it("Receive Item", async function () {
                result = await helper.consumer.receiveItem();

                event = result.logs[0].event;
                assert.equal(event, 'Received', `Unexpected event "${event}"`);
            })
        })

    })
})

        // it("Process Item", async function () {
        //     await instance.processItem(
        //         harvestId,
        //         { from: Test.farmOwner }
        //     )s

        //     const item = await instance.fetchHarvest.call(harvestId);

        //     assert.equal(item.state, 'Processed', "Unexpected state returned");
        // })

        // it("Pack Item", async function () {
        //     await instance.packItem(
        //         harvestId,
        //         { from: Test.farmOwner }
        //     )

        //     const item = await instance.fetchHarvest.call(harvestId);

        //     assert.equal(item.state, 'Packed', "Unexpected state returned");
        // })

        // it("Sell Item", async function () {
        //     await instance.putForSaleByFarmer(
        //         harvestId,
        //         Test.defaultPrice,
        //         { from: Test.farmOwner }
        //     )

        //     const item = await instance.fetchBags.call(skuId);

        //     assert.equal(item.state, 'ForSale', "Unexpected state returned");
        // })
    // })

    // describe("Farm - Failure", async function () {
    //     it("Trying to create the same farm again", async function () {
    //         try {
    //             await instance.registerFarm(
    //                 Test.farmOwner,
    //                 Test.farmName,
    //                 Test.farmDescription,
    //                 Test.locationLat,
    //                 Test.locationLong,
    //                 { from: Test.contractOwner }
    //             )
    //         } catch (e) {
    //             return;
    //         }

    //         assert.equal(1, 2, "No error was thrown");
    //     })
    // })


    // // 1st Test
    // it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Declare and Initialize a variable for event
    //     var eventEmitted = false

    //     // Watch the emitted event Harvested()
    //     var event = supplyChain.Harvested()
    //     await event.watch((err, res) => {
    //         eventEmitted = true
    //     })

    //     // Mark an item as Harvested by calling function harvestItem()
    //     await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes)

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()
    //     const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
    //     const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

    //     // Verify the result set
    //     assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
    //     assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
    //     assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
    //     assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
    //     assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
    //     assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
    //     assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
    //     assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    //     assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
    //     assert.equal(eventEmitted, true, 'Invalid event emitted')
    // })

    // // 2nd Test
    // it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Declare and Initialize a variable for event


    //     // Watch the emitted event Processed()


    //     // Mark an item as Processed by calling function processtItem()


    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()


    //     // Verify the result set

    // })

    // // 3rd Test
    // it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Declare and Initialize a variable for event


    //     // Watch the emitted event Packed()


    //     // Mark an item as Packed by calling function packItem()


    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()


    //     // Verify the result set

    // })

    // // 4th Test
    // it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Declare and Initialize a variable for event


    //     // Watch the emitted event ForSale()


    //     // Mark an item as ForSale by calling function sellItem()


    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()


    //     // Verify the result set

    // })

    // // 5th Test
    // it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Declare and Initialize a variable for event


    //     // Watch the emitted event Sold()
    //     var event = supplyChain.Sold()


    //     // Mark an item as Sold by calling function buyItem()


    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()


    //     // Verify the result set

    // })

    // // 6th Test
    // it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Declare and Initialize a variable for event


    //     // Watch the emitted event Shipped()


    //     // Mark an item as Sold by calling function buyItem()


    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()


    //     // Verify the result set

    // })

    // // 7th Test
    // it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Declare and Initialize a variable for event


    //     // Watch the emitted event Received()


    //     // Mark an item as Sold by calling function buyItem()


    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()


    //     // Verify the result set

    // })

    // // 8th Test
    // it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Declare and Initialize a variable for event


    //     // Watch the emitted event Purchased()


    //     // Mark an item as Sold by calling function buyItem()


    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()


    //     // Verify the result set

    // })

    // // 9th Test
    // it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()


    //     // Verify the result set:

    // })

    // // 10th Test
    // it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
    //     const supplyChain = await SupplyChain.deployed()

    //     // Retrieve the just now saved item from blockchain by calling function fetchItem()


    //     // Verify the result set:

    // })

// });

