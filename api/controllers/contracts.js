module.exports = {
    putContact: putContact
};

const Web3 = require('web3');
const contract = require("truffle-contract");
const fs = require("fs");

//const providerUrl = "http://etherbokydum.westeurope.cloudapp.azure.com:8545";
const providerUrl = "http://localhost:8545";

const provider = new Web3.providers.HttpProvider(providerUrl);
const web3 = new Web3(provider);

const AssetContractJson = JSON.parse(fs.readFileSync("build/contracts/AssetContract.json"));
const AssetRegistryJson = JSON.parse(fs.readFileSync("build/contracts/AssetRegistry.json"));

const AssetContract = contract(AssetContractJson);
const AssetRegistry = contract(AssetRegistryJson);

AssetContract.setProvider(provider);
AssetRegistry.setProvider(provider);

let registry = null;

web3.eth.getAccounts((error, accounts) => {
    AssetContract.defaults({
        from: accounts[0],
        gas: 4712388
    });

    AssetRegistry.defaults({
        from: accounts[0],
        gas: 4712388
    });
});

AssetRegistry.new().then(instance => {
    registry = instance;
});

function putContact(req, res) {
    const contract = req.swagger.params.contract.value;
    registry.deployAssetContract(contract.assetId, web3.toWei(contract.assetPrise), contract.authorWalletAddresses)
        .then(async txReceipt => {
            const txLogs = txReceipt.logs[0];
            const assetOwner = txLogs.args._owner;
            const assetAddress = txLogs.args._asset;

            const assetContract = await AssetContract.at(assetAddress);
            await assetContract.setRevenueRate(contract.authorWalletAddresses[0], 1000000);

            res.status(201).json({
                message: {
                    contactAddress: assetContract.address
                }
            });
        });
}