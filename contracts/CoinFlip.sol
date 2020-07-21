pragma solidity 0.6.2;
import "./Ownable.sol";
import "./Random.sol";

// 1. Make multiple users play game

contract PlayerContr is Random{

  struct Player {
  uint id;
  bytes32 queryId;
  uint balance;
  bool exists;
}

uint private playerId;


mapping (address => Player) private players;
address[] private playerAddresses;

function getRandomNum() public
{
  bytes32 queryId = testRandom();
  Player memory player;
  if(!players[msg.sender].exists){
      player.id = getPlayerId();
      player.exists = true;
      player.queryId = queryId;
      insertPlayer(player);
      playerAddresses.push(msg.sender);
  }else
  {
    player = players[msg.sender];
    player.queryId = queryId;
    updatePlayer(player);
  }
}

  function getPlayerId() private returns (uint) {
    return playerId++;
  }

   function insertPlayer(Player memory player) private {
        address creator = msg.sender;
        players[creator] = player;
    }

     function updatePlayer(Player memory player) private {
        address creator = msg.sender;
        players[creator] = player;
    }
}

contract CoinFlip is Ownable, PlayerContr{
 PlayerContr playerContr;
 event placedBet(address user, uint bet, bool success);
 event error(string reason);
 event lowLevelError(bytes lowLevelData);

 uint public balance;

  constructor(uint initialSupply) public payable{
     balance = initialSupply;
        playerContr = new PlayerContr();
    }

  modifier costs(uint cost){
      require(msg.value >= cost,"Error");
      _;
  }

  function getRandom() public payable costs(0.05 ether) returns(bool){
    require(address(this).balance >= msg.value, "Not enough funds!");
    try playerContr.getRandomNum(){
      return true;
    }catch Error(string memory reason) {
        // This is executed in case
        // revert was called inside getData
        // and a reason string was provided.
        emit error(reason);
        return false;
    } catch (bytes memory lowLevelData) {
        // This is executed in case revert() was used
        // or there was a failing assertion, division
        // by zero, etc. inside getData.
        emit lowLevelError(lowLevelData);
        return false;
    }
  }

  

  function flipCoin(uint256 randomNum) public payable costs(0.05 ether)  returns(bool){
    bool success = false;
    if(randomNum % 2 == 1)
    {
      success = true;
      balance -= msg.value;
      msg.sender.transfer(msg.value * 2);
    }else {
      balance += msg.value;
    }

    emit placedBet(msg.sender, msg.value, success);

   return success;
  }

 
}
