pragma solidity 0.6.2;
import "./provableAPI.sol";
import "./CoinFlip.sol";

contract Random is usingProvable{
    
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
       
    event LogNewProvableQuery(string description);
    event generatedRandomNumber(uint256 randomNumber);
    event SenderAddr(address addr);
    event LogCallbackResult(bytes32 queryId,string res,bytes _proof);
    event placedBet(address player, uint256 value, bool success);
    event LogWithdraw(bool success);
    event LogResult(bool isWinf, uint256 value);
    
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
    uint256 public latestNumber;

    //constructor()
      //  public
    //{
       // update();
    //}
   
  
    function update()
      public
      payable
      returns (bytes32)
    {
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
     
        bytes32 queryId = provable_newRandomDSQuery(
          QUERY_EXECUTION_DELAY,
          NUM_RANDOM_BYTES_REQUESTED,
          GAS_FOR_CALLBACK
        );
        emit LogNewProvableQuery("Provable query was sent, standing by for the answer.");
        return queryId;
   }
   
    function  __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public override(usingProvable){
        //require(bet.player == provable_cbAddress(),"Error");
        emit LogCallbackResult(_queryId,_result, _proof);
        uint256 randomNum = uint256(keccak256(abi.encodePacked(_result))) % 2;
        emit generatedRandomNumber(randomNum);
          bool isWin = randomNum % 2 == 1 ? true : false;
        Bet memory bet = waiting[_queryId];
        Result memory result;
        result.isWin = isWin;
        result.value = bet.value;
        results[bet.player] = result;
     
        emit placedBet(bet.player, bet.value, isWin);
        latestNumber = randomNum;
        delete waiting[_queryId];
    }

    function testRandom(address player) public returns (bytes32){
        bytes32 queryId = bytes32(keccak256(abi.encodePacked(player)));
        __callback(queryId,"1",bytes("test"));
        return queryId;
    }
    
    function setBet(bytes32 queryId, address player, uint256 value) public {
      Bet memory bet;
      bet.player = player;
      bet.value = value;
      waiting[queryId] = bet;
    }
    
     function getResult(address player) public returns(bool, uint256){
      return(results[player].isWin,results[player].value);
    }
    
    function withdrawBet() public payable returns (bool){
        (bool isWin, uint256 value) = getResult(msg.sender);
        emit LogResult(isWin, value);
        require(isWin == true, "Can't withdraw funds");
        (bool success, bytes memory data)  = (msg.sender).call{value: value * 2}(abi.encodeWithSignature("withdrawBet(string)", "CoinFlip"));
        emit LogWithdraw(success);
        return success;
    }
    
    
}