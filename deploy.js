const HDWalletProvider = require('truffle-hdWallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');
const {mnemonic, apiUrl} = require('./credentials');

console.log(mnemonic, apiUrl);

const provider = new HDWalletProvider(
  mnemonic,
  apiUrl
);
/*
const web3 = new Web3(provider);

const deploy = async (done) => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);
  console.log(interface);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy(
      {
        data:'0x' + bytecode,  // this is a bug fix, see https://github.com/trufflesuite/truffle/issues/558#issuecomment-392344663
        arguments: [web3.utils.toWei('0.01', 'ether')]
      }
    )
    .send({ gas: '1000000', from: accounts[0] })
    ;
  console.log('Contract deployed to address', result.options.address);

  //done();
};

deploy();
*/