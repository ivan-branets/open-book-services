module.exports = {
    put: put
};

const fs = require("fs");
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://etherbokydum.westeurope.cloudapp.azure.com:8545'));

// Fetch ABI
const source = fs.readFileSync("build/contracts/AssetContract.json");
const contractFile = JSON.parse(source);
const abi = contractFile.abi;

// Get a proxy on our contract
web3.eth.defaultAccount = web3.eth.accounts[0];
const AssetContract = web3.eth.contract(abi);

AssetContract.new('1', 10000, ['0x6949c4aac143c0d44def1e43dfb7737c17f4350303020d096b12ba7b413335ee'])
    then(function(ct){console.log(ct)});

// let contract = AssetContract.at('0x0d552d9fb2467551f299e1aaba09c7e9dc52bf0a');
// console.log(contract.getAuthors());
// var contact;
// AssetContract.new('1', 10000, ['0x6949c4aac143c0d44def1e43dfb7737c17f4350303020d096b12ba7b413335ee'])
//     .then(function(ct) {
//         contact = ct;
//         let authors = contact.getAuthors();
//         console.log(authors);
//     });

function put(req, res) {
    let contract = req.swagger.params.contract.value;

    res.status(201).json(
        {
            message: contract
        }
    );
}