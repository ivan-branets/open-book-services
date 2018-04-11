import Web3 from 'web3';
import contract from 'truffle-contract';
import fs from 'fs';

// const providerUrl = 'http://etherbokydum.westeurope.cloudapp.azure.com:8545';
const providerUrl = 'http://localhost:8545';

const provider = new Web3.providers.HttpProvider(providerUrl);
const web3 = new Web3(provider);

const AssetContractJson = JSON.parse(fs.readFileSync('build/contracts/AssetContract.json'));
const AssetRegistryJson = JSON.parse(fs.readFileSync('build/contracts/AssetRegistry.json'));

const AssetContract = contract(AssetContractJson);
const AssetRegistry = contract(AssetRegistryJson);

AssetContract.setProvider(provider);
AssetRegistry.setProvider(provider);

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

let registry = null;
AssetRegistry.new().then(instance => {
    registry = instance;
});

export function putContact(req, res) {
    const c = req.swagger.params.contract.value;

    registry.deployAssetContract(c.assetId, web3.toWei(c.assetPrise), c.authorWalletAddresses)
        .then(async txReceipt => {
            const txLogs = txReceipt.logs[0];
            const assetAddress = txLogs.args._asset;

            const assetContract = await AssetContract.at(assetAddress);
            await assetContract.setRevenueRate(c.authorWalletAddresses[0], 1000000);

            res.status(201).json({
                message: {
                    contactAddress: assetContract.address
                }
            });
        });
}
