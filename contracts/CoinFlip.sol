pragma solidity 0.6.2;
import "./Ownable.sol";
import "./provableAPI.sol";

contract CoinFlip is Ownable,usingProvable{
    
     struct Bet {
        address player;
        uint256 value;
    }
    
    struct Result {
        uint256 value;
        bool isWin;
    }
    
    
    mapping(address => Result) public results;
    mapping (bytes32 => Bet) public waiting;
     bytes32[] private bets;
    
    event LogNewProvableQuery(string description);
    event generatedRandomNumber(uint256 randomNumber);
    event logCallbackResult(bytes32 queryId,string res,bytes _proof);
    event placedBet(address player, uint256 value, bool isWin);
    event logQueryId(bytes32 queryId);
    event logWithdraw(bool success);
    event logMustWithdraw(bool withdraw);
    
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
    uint256 public latestNumber;
 
  //constructor() public{
    //update();
  //}

  modifier costs(uint cost){
      require(msg.value >= cost,"Error");
      _;
  }
  
  function flip() payable costs(0.01 ether) public{
    update();
  }
  
   function update()
      public
      payable
      //returns (bytes32)
    {
        require(msg.value * 3 < payable(address(this)).balance, "Not enough balance");
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
        bytes32 queryId = testRandom(msg.sender);
        //bytes32 queryId = provable_newRandomDSQuery(
          //QUERY_EXECUTION_DELAY,
          //NUM_RANDOM_BYTES_REQUESTED,
          //GAS_FOR_CALLBACK
        //);
         setBet(queryId,msg.sender,msg.value);
           __callback(queryId,"0",bytes("test"));
        emit logQueryId(queryId);
        emit LogNewProvableQuery("Provable query was sent, standing by for the answer.");
   }
   
    function testRandom(address player) public returns (bytes32){
        bytes32 queryId = bytes32(keccak256(abi.encodePacked(player)));
        //__callback(queryId,"1",bytes("test"));
        return queryId;
    }
    
    function setBet(bytes32 queryId, address player, uint256 value) public {
      Bet memory bet;
      bet.player = player;
      bet.value = value;
      waiting[queryId] = bet;
    }
    
    function getResult(address player) public returns(bool, uint256){
     emit logMustWithdraw(results[player].isWin);
      return(results[player].isWin,results[player].value);
    }
    
     function getBet(bytes32 queryId) public view returns(address, uint256){
      return(waiting[queryId].player,waiting[queryId].value);
    }
    
    function  __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public override(usingProvable){
        //require(msg.sender == provable_cbAddress(),"Error");
        emit logCallbackResult(_queryId,_result, _proof);
        uint256 randomNum = uint256(keccak256(abi.encodePacked(_result))) % 2;
    
        bool isWin = randomNum == 1 ? true : false;
       (address player, uint256 value) = getBet(_queryId);
        Result memory result;
        result.isWin = isWin;
        result.value = value;
        results[player] = result;
        if(isWin){
            (bool success, bytes memory data)  = (msg.sender).call{value: value * 2}(abi.encodeWithSignature("withdrawBet(string)", "CoinFlip"));
        }
        emit placedBet(player, value, isWin);
        latestNumber = randomNum;
        delete waiting[_queryId];
        emit generatedRandomNumber(randomNum);
    }
  
  
  function withdrawPlayerFunds() onlyOwner payable costs(0.01 ether) public returns(bool){
        (bool isWin, uint256 value) = getResult(msg.sender);
        require(isWin == true, "Can't withdraw funds");
        (bool success, bytes memory data)  = (msg.sender).call{value: value * 2}(abi.encodeWithSignature("withdrawBet(string)", "CoinFlip"));
        emit logWithdraw(success);
        return success;
  }
  
  receive() external payable { }
  
  fallback() external payable {}
}
