pragma solidity 0.6.2;
import "./Ownable.sol";
import "./Random.sol";

contract CoinFlip is Ownable{
    
    struct Bet {
        address player;
        uint256 value;
    }
    
    Random random;
   
    event error(string description);
    event lowLevelError(bytes description);
    event LogQueryId(bytes32 queryId);
    event LogBalance(uint256 balance);
    event LogWithdraw(bool success);
 
  constructor() public payable{
     random = new Random();
  }

  modifier costs(uint cost){
      require(msg.value >= cost,"Error");
      _;
  }
  
  function flip() payable costs(0.01 ether) public{
  require(msg.value * 3 < payable(address(this)).balance, "Not enough balance");
   (bool isWin, uint256 value) = random.getResult(msg.sender);
  require(isWin == false, "Withdraw your funds before next play");
    try random.update{value: msg.value}() returns (bytes32 queryId){
       emit LogQueryId(queryId);
       random.setBet(queryId,msg.sender,msg.value);
    }catch Error(string memory reason) {
        // This is executed in case
        // revert was called inside getData
        // and a reason string was provided.
        emit error(reason);
    } catch (bytes memory lowLevelData) {
        // This is executed in case revert() was used
        // or there was a failing assertion, division
        // by zero, etc. inside getData.
        emit lowLevelError(lowLevelData);
    }
  }
  
  
  function withdrawPlayerFunds() onlyOwner payable costs(0.01 ether) public{
    try random.withdrawBet{value: msg.value}() returns(bool success){
    }catch Error(string memory reason) {
        // This is executed in case
        // revert was called inside getData
        // and a reason string was provided.
        emit error(reason);
    } catch (bytes memory lowLevelData) {
        // This is executed in case revert() was used
        // or there was a failing assertion, division
        // by zero, etc. inside getData.
        emit lowLevelError(lowLevelData);
    }
  }
  
  receive() external payable { }
  
  fallback() external payable {}
}
