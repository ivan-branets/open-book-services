module.exports = {
    put: put
};

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://etherbokydum.westeurope.cloudapp.azure.com:8545");
const contract = require("truffle-contract");
const fs = require("fs");
const AssetContractJson = JSON.parse(fs.readFileSync("build/contracts/AssetContract.json"));

AssetContract = contract(AssetContractJson)
AssetContract.setProvider(provider);

AssetContract.defaults({
    from: '0x4ebf52e2c78eb8233bc5ddcc32c5acb8f47c5266',
    gas: 4712388
});

function put(req, res) {
    const contract = req.swagger.params.contract.value;
    AssetContract.new(contract.bookId, contract.bookPrise, contract.authorWalletAddresses).then((instance) => {
        res.status(201).json(
            {
                message: {
                    contactAddress: instance.address
                }
            }
        );    
    });
}