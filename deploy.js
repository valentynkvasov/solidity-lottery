const hdwallet = require("truffle-hdwallet-provider");
const Web3 = require('web3');
const {interface, bytecode} = require('./compile')

const provider = new hdwallet(
    'away involve situate joy torch label twice benefit lazy neglect garden excess',
    'https://ropsten.infura.io/v3/2fca6639eaa446e8a3a23cf23feb42c6'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await  web3.eth.getAccounts();

    console.log("Deploying... " + accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({gas: '1000000', from: accounts[0]});

    console.log("ABI ", interface)
    console.log("Contract deployed to", result.options.address)
}

deploy();
