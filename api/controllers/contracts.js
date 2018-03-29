module.exports = {
    putContact: putContact
};

const Web3 = require('web3');
const contract = require("truffle-contract");
const fs = require("fs");

const provider = new Web3.providers.HttpProvider("http://etherbokydum.westeurope.cloudapp.azure.com:8545");
const web3 = new Web3(provider);
const AssetContractJson = JSON.parse(fs.readFileSync("build/contracts/AssetContract.json"));

AssetContract = contract(AssetContractJson)
AssetContract.setProvider(provider);

AssetContract.defaults({
    from: '0x4ebf52e2c78eb8233bc5ddcc32c5acb8f47c5266',
    gas: 4712388
});

function putContact(req, res) {
    const contract = req.swagger.params.contract.value;
    AssetContract.new(contract.assetId, web3.toWei(contract.assetPrise), contract.authorWalletAddresses)
        .then(async (instance) => {
            await instance.setRevenueRate(contract.authorWalletAddresses[0], 1000000);
            res.status(201).json({
                message: {
                    contactAddress: instance.address
                }
            });
        });
}