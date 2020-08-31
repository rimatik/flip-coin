pragma solidity 0.5.12;
import "./Ownable.sol";
import "./provableAPI.sol";

contract CoinFlip is Ownable,usingProvable{
    
    struct Bet {
        address player;
        uint256 value;
        uint256 headsOrTails;
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

    modifier costs(uint cost){
      require(msg.value >= cost,"Error");
      _;
    }
  
   function flip(uint256 headsOrTails) payable costs(0.01 ether) public{
        require(msg.value * 3 < address(this).balance, "Not enough balance");
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 3000000;
        bytes32 queryId = provable_newRandomDSQuery(
          QUERY_EXECUTION_DELAY,
          NUM_RANDOM_BYTES_REQUESTED,
          GAS_FOR_CALLBACK
        );
        setBet(queryId,msg.sender,msg.value,headsOrTails);
        emit logQueryId(queryId);
        emit LogNewProvableQuery("Provable query was sent, standing by for the answer.");
    }
    
    function setBet(bytes32 queryId, address player, uint256 value, uint256 headsOrTails) public {
        Bet memory bet;
        bet.player = player;
        bet.value = value;
        bet.headsOrTails = headsOrTails;
        waiting[queryId] = bet;
    }
    
    function getResult(address player) public view returns(bool, uint256){
        return(results[player].isWin,results[player].value);
    }
    
     function getBet(bytes32 queryId) public view returns(address, uint256, uint256){
        return(waiting[queryId].player,waiting[queryId].value,waiting[queryId].headsOrTails);
    }
    
    function  __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public {
        require(msg.sender==provable_cbAddress()); //only the oracle can call this function
        emit logCallbackResult(_queryId,_result, _proof);
        uint256 randomNum = uint256(keccak256(abi.encodePacked(_result))) % 2;
    
       (address player, uint256 value, uint256 headsOrTails) = getBet(_queryId);
         bool isWin = randomNum == headsOrTails ? true : false;
        Result memory result;
        result.isWin = isWin;
        result.value = value;
        results[player] = result;
        emit placedBet(player, value, isWin);
        latestNumber = randomNum;
        delete waiting[_queryId];
        emit generatedRandomNumber(randomNum);
    }
  
  function withdraw() onlyOwner payable costs(0.01 ether) public{
        (bool isWin, uint256 value) = getResult(msg.sender);
        require(isWin == true, "Can't withdraw funds");
        msg.sender.transfer(value * 2);
  }

  function receive() payable public {}
}
