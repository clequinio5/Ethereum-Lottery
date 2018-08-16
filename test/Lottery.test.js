const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile');

let accounts;
let lottery;
let ticketPrice;

beforeEach( async () => {
  // Get a list of all accounts
  // web3.eth.getAccounts()
  //   .then(fetchedAccounts => {
  //     console.log(fetchedAccounts);
  //   });
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deply contract
  ticketPrice = web3.utils.toWei('1', 'ether');
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
        data: bytecode,
        arguments: [ticketPrice]
      })
    .send({ from: accounts[0], gas: '1000000' })
    ;
});

describe('Lottery', () => {
  it('should deploy a contract', (done) => {
      assert.ok(lottery.options.address);
      done();
  });

  it('should have a ticket price of 1 ether', async () => {
    const ticketPrice = await lottery.methods.ticketPrice().call();
    assert.equal(ticketPrice, ticketPrice);
  });

  it('should let us buy a ticket', async () => {
    await lottery.methods.buyTicket().send(
      {
        'value' : ticketPrice,
        'from' : accounts[0]
      });

    const totalPlayers = await lottery.methods.getTotalPlayers().call();

    assert.equal(totalPlayers, 1);
  });

  it('should let us buy a ticket twice', async () => {
    await lottery.methods.buyTicket().send(
      {
        'value' : ticketPrice,
        'from' : accounts[0]
      });
    await lottery.methods.buyTicket().send(
      {
        'value' : ticketPrice,
        'from' : accounts[0]
      });

    const totalPlayers = await lottery.methods.getTotalPlayers().call();

    assert.equal(totalPlayers, 2);
  });

  it('should let multiple players to buy a ticket', async () => {
    await lottery.methods.buyTicket().send(
      {
        'value' : ticketPrice,
        'from' : accounts[0]
      });
    await lottery.methods.buyTicket().send(
      {
        'value' : ticketPrice,
        'from' : accounts[1]
      });
    await lottery.methods.buyTicket().send(
      {
        'value' : ticketPrice,
        'from' : accounts[2]
      });
    await lottery.methods.buyTicket().send(
      {
        'value' : ticketPrice,
        'from' : accounts[3]
      });

    const totalPlayers = await lottery.methods.getTotalPlayers().call();

    assert.equal(totalPlayers, 4);
  });

  it('should enfore a minimum ticket price', async () => {
    try {
      await lottery.methods.buyTicket().send(
      {
        'value' : 200, // 200 wei
        'from' : accounts[0]
      });
      assert(false);
    }
    catch(e) {
      assert.notEqual(e.message, 'false == true');
    }
  });

  it('should not let the non-manager pick a winner', async () => {
    try {
      await lottery.methods.chooseWinner().send(
      {
        'from' : accounts[1]
      });
      assert(false);
    }
    catch(e) {
      assert.notEqual(e.message, 'false == true');
    }
  });

  it('should only let the manager pick a winner', async () => {
    try {
      await lottery.methods.chooseWinner().send(
      {
        'from' : accounts[0]
      });
      assert(false);
    }
    catch(e) {
      assert.notEqual(e.message, 'false == true');
    }
  });

  it('should transfer lottery money to user', async () => {
    await lottery.methods.buyTicket().send(
      {
        'value' : ticketPrice,
        'from' : accounts[0]
      });
    await lottery.methods.buyTicket().send(
      {
        'value' : ticketPrice,
        'from' : accounts[0]
      });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.chooseWinner().send(
      {
        'from' : accounts[0]
      }
    );

    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('1.8', 'ether'));
  });
});
