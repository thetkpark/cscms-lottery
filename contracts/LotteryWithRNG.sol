// pragma solidity >=0.4.22 <0.9.0;

// import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

// contract LotteryWithRNG is VRFConsumerBase {
//     address public manager;
//     address public prevWinner;
//     uint public prevPrize;
//     address[] public players;
    
//     bytes32 internal keyHash;
//     uint256 internal fee;
    
    
//     constructor() 
//         VRFConsumerBase(
//             0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9,
//             0xa36085F69e2889c224210F603D836748e7dC0088
//         ) public
//     {
//         manager = msg.sender;
//         keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
//         fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
//     }

    
//     function enter() public payable {
//         require(msg.value >= 0.01 ether);
//         // The money that send is in the balance of this contract
//         players.push(msg.sender);
//     }
    
//     function getPlayers() external view returns (address[] memory) {
//         return players;
//     }
    
//     function random() private view returns (uint) {
//         // pseudorandom of blockdifficulty, timestamp, and players
//         return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
//     }
    
//     modifier restricted() {
//         require(msg.sender == manager);
//         _;
//     }
    
    
//     function pickWinner() public restricted returns (bytes32 requestId) {
//         require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
//         uint seed = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
//         return requestRandomness(keyHash, fee, seed);
//     }
    
//     function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
//         uint index = randomness % players.length;
//         address payable winner = payable(players[index]);
//         prevPrize = address(this).balance;
//         winner.transfer(address(this).balance);
//         prevWinner = players[index];
//         players = new address[](0);
//     }
// }