# Ethereum Lottery
**Contributors:** shaheer912  
**Tags:** crypto, ethereum, ether, smart contracts, solidity, lottery
**Requires at least:** Solidity ^0.4.0, Infura account, Node

A really simple lottery application on ethereum

## Description

A really simple lottery application Ethererum blockchain. Uses Solidity for smart contract logic.

Features:

* Simple.
* One user can buy multiple tickets
* Will automatically reset once a user has won
* Winner is chosen randomly when the manager (the person who deployed the lottery contract) calls the chooseWinner function
* User is awarded the amount equal to the number of lottery tickets sold.
* Ticket Price is configured at deploy time.

## Installation

Open credentials.js file and modify it to pass your mnemonic and infura API URL
```js
mnemonic : 'mnemonic here', 
apiUrl: 'infura api url here'
```

Open deploy.js file and modify the ticket price at line 23 (default is 0.01 ether).
```js
arguments: [web3.utils.toWei('YOUR TICKET PRICE IN ETHER', 'ether')]
```

Then on command line type:
```bash
node deploy
```

Done.

### Warning
Since a single user can buy a ticket multiple times, he can stack the chances of winning in his favor if he buys multiple tickets at the same time. Only use this application if you know what you are doing. I take no responsibility for any sort of damage if you choose to use this code. Its for demonstration only and is not meant to be used in production!.
