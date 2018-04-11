import Web3 from 'web3';
import contract from 'truffle-contract';
import fs from 'fs';

// const providerUrl = 'http://etherbokydum.westeurope.cloudapp.azure.com:8545';
const providerUrl = 'http://localhost:8545';

const provider = new Web3.providers.HttpProvider(providerUrl);
const web3 = new Web3(provider);

const AssetContractJson = JSON.parse(fs.readFileSync('build/contracts/AssetContract.json'));

const AssetContract = contract(AssetContractJson);

AssetContract.setProvider(provider);

web3.eth.getAccounts((error, accounts) => {
    AssetContract.defaults({
        from: accounts[0],
        gas: 4712388
    });
});

export function putOrder(req, res) {
    const o = req.swagger.params.order.value;

    // assetAddress
    // buyerAddress

    AssetContract.at(o.assetAddress).then(async assetContract => {
        const assetId = await assetContract.assetId.call();
        const price = await assetContract.price.call();

        try {
            const tx = await web3.eth.sendTransaction({
                from: o.buyerAddress,
                to: o.assetAddress,
                value: price
            });

            res.status(201).json({
                message: {
                    url: `https://s3-us-west-2.amazonaws.com/ivan-bucket-1/${assetId}.pdf`,
                    transaction: tx
                }
            });
        } catch (error) {
            res.status(500).json({
                message: {
                    message: error
                }
            });
        }
    });
}
