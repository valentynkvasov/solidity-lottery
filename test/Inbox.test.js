const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'})
    lottery.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });
    it('has a default message', async () => {
        const message = await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.2', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });
    it('multiple users', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.2', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.2', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(2, players.length);
    });

    it('modifier testing', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('1', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(2, players.length);

        const balance0 = await web3.eth.getBalance(accounts[0]);
        const balance1 = await web3.eth.getBalance(accounts[1]);

        await lottery.methods.pickWinner().call({
            from: accounts[0]
        })

        assert(balance0 === balance0+2 || balance1 === balance1+2)
    });
});
