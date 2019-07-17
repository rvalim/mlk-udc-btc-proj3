
const helper = {
    instance: null,
    toWei: (value) => {
        return web3.utils.toWei(value.toString(), 'ether');
    },
    getId: (result) => {
        return result.logs[0].args.id.toNumber();
    },
    formatPayable: (from, value) => {
        return { from, value: helper.toWei(value) }
    },
    farmer: {
        me: null,
        plantItem: function () {
            const upc = 38
            const note = 'NEW PRODUCTION BEEN MADE'

            return helper.instance.toPlantItem(
                upc,
                note,
                { from: this.me })
        },
        harvestItem: async function () {
            let result = await this.plantItem();
            const harvestId = helper.getId(result);

            return helper.instance.harvestItem(
                harvestId,
                { from: this.me });
        },
        processItem: async function () {
            let result = await this.harvestItem();
            const harvestId = helper.getId(result);

            return helper.instance.processItem(
                harvestId,
                { from: this.me });
        },
        packItem: async function () {
            let result = await this.processItem();
            harvestId = helper.getId(result);

            return helper.instance.packItem(
                harvestId,
                { from: this.me });
        },
        putForSale: async function () {
            let result = await this.packItem();
            const harvestId = helper.getId(result);

            return helper.instance.putForSaleByFarmer(
                harvestId,
                1,
                { from: this.me })
        },
        ship: async function () {
            let result = await this.buyer.buyItem();
            let sku = helper.getId(result);

            return helper.instance.shipItem(
                sku,
                { from: this.me })
        }
    },
    distributor: {
        me: null,
        owner: null,
        buyItem: async function () {
            result = await this.owner.putForSale();
            let sku = helper.getId(result);
            return helper.instance.buyFromFarmer(sku, helper.formatPayable(this.me, 1));
        },
        receiveItem: async function () {
            let result = await this.buyItem();
            let sku = helper.getId(result);

            return helper.instance.receiveItem(sku, { from: this.me });
        },
        putForSale: async function () {
            let result = await this.receiveItem();
            let sku = helper.getId(result);

            return helper.instance.putForSaleByDistributor(sku, 1, { from: this.me })
        },
        ship: async function () {
            let result = await this.buyer.buyItem();
            let sku = helper.getId(result);

            return helper.instance.shipItem(sku, { from: this.me })
        }
    },
    retailer: {
        me: null,
        owner: null,
        buyItem: async function () {
            result = await this.owner.putForSale();
            let sku = helper.getId(result);

            return helper.instance.buyFromDistributor(sku, helper.formatPayable(this.me, 1));
        },
        receiveItem: async function () {
            let result = await this.buyItem();
            let sku = helper.getId(result);

            return helper.instance.receiveItem(sku, { from: this.me });
        },
        putForSale: async function () {
            let result = await this.receiveItem();
            let sku = helper.getId(result);

            return helper.instance.putForSaleByRetailer(sku, 1, { from: this.me })
        },
        ship: async function () {
            let result = await this.buyer.buyItem();
            let sku = helper.getId(result);

            return helper.instance.shipItem(sku, { from: this.me })
        }
    },
    consumer: {
        owner: null,
        me: null,
        buyItem: async function () {
            result = await this.owner.putForSale();
            let sku = helper.getId(result);

            return helper.instance.buyFromRetailer(sku, helper.formatPayable(this.me, 1));
        },
        receiveItem: async function () {
            let result = await this.buyItem();
            let sku = helper.getId(result);

            return helper.instance.receiveItem(sku, { from: this.me });
        }
    }
}


helper.distributor.owner = helper.farmer;
helper.retailer.owner = helper.distributor;
helper.consumer.owner = helper.retailer;

helper.farmer.buyer = helper.distributor;
helper.distributor.buyer = helper.retailer;
helper.retailer.buyer = helper.consumer;

module.exports = helper;