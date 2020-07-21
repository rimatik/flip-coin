pragma solidity 0.6.2;
import "./provableAPI.sol";

contract Random is usingProvable {

    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
    uint256 public latestNumber;

    event LogNewProvableQuery(string description);
    event generatedRandomNumber(uint256 randomNumber);

    constructor()
        public
    {
        update();
    }
    // try to map multiple games and multiple callbacks for multiple users playing games
    function  __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public override(usingProvable){
        require(msg.sender == provable_cbAddress(),"Error");
        //tide queryId to user
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
        latestNumber = randomNumber;
        emit generatedRandomNumber(randomNumber);
    }

    function update()
        public
        payable
    {
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
        //unique id save it
        bytes32 queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );
        emit LogNewProvableQuery("Provable query was sent, standing by for the answer.");
    }

    function testRandom() public returns (bytes32){
        //   bytes32 queryId = bytes32(keccak256(abi.encodePacked(msg.sender)));
        bytes32 queryId = bytes32(keccak256("test"));
        __callback(queryId, "1", bytes("test"));
        return queryId;
    }
}