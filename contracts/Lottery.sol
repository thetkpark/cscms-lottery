pragma solidity 0.8.4;

contract Lottery {
    address public manager;
    address public prevWinner;
    uint public prevPrize;
    address[] public players;
    
    constructor() {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value >= 0.01 ether);
        // The money that send is in the balance of this contract
        players.push(msg.sender);
    }
    
    function getPlayers() external view returns (address[] memory) {
        return players;
    }
    
    function random() private view returns (uint) {
        // pseudorandom of blockdifficulty, timestamp, and players
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        // Send all of ether in the balance of contract to the winner
        address payable winner = payable(players[index]);
        prevPrize = address(this).balance;
        winner.transfer(address(this).balance);
        prevWinner = players[index];
        players = new address[](0);
    }
}