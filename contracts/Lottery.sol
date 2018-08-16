pragma solidity ^0.4.0;

contract Lottery {

  address public manager;

  address[] public players;

  uint public ticketPrice;

  address private winner;

  uint private balance;

  modifier isManager() {
    require(msg.sender == manager);
    _;
  }

  constructor(uint _ticketPrice) public {
    require(_ticketPrice > 0);
    manager = msg.sender;
    ticketPrice = _ticketPrice;
  }

  function buyTicket() public payable {
    require( ticketPrice > 0 );
    require(msg.value == ticketPrice);
    require(winner == address(0));
    balance += ticketPrice;
    players.push(msg.sender);
  }

  function getTotalPlayers() public view returns(uint) {
      return players.length;
  }

  function getPlayers() public view isManager returns(address[]) {
    return players;
  }

  function generateRandomNumber() private view returns (uint) {
      return hash(block.difficulty, now, players);
  }

  function hash(uint v1, uint t, address[] p) private pure returns(uint) {
    return uint(keccak256(abi.encodePacked(v1, t, p)));
  }

  function chooseWinner() public isManager returns( address ) {
    require( players.length > 0 );
    if( winner == address(0) ) { // if winner is not set, pick one
        uint winnerIdx = generateRandomNumber() % players.length;
        winner = players[winnerIdx];
    }
    winner.transfer(balance);
    balance = 0;
    players = new address[](0);
    ticketPrice = 0;
    return winner;
  }

}
