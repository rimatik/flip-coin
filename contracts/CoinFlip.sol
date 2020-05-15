import "./Ownable.sol";
pragma solidity 0.5.12;

contract CoinFlip is Ownable{

 uint public balance;

 constructor (uint initialSupply) public payable{
     balance = initialSupply;
 }

 event placedBet(address user, uint bet, bool);

  modifier costs(uint cost){
      require(msg.value >= cost);
      _;
  }

  function flipCoin() public payable costs(0.05 ether) returns(bool){
  require(address(this).balance >= msg.value, "Not enough funds!");

   bool success = false;

   if(now % 2 == 1)
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
