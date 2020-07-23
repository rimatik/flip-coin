var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi,"0xEf69E19cf9A5De3C7bCFb5378c5547fb4367effe",{from: accounts[0]});
      web3.eth.net.getNetworkType()
        .then((val) =>   $("#walletNetworkId").text(val));
      var account = web3.currentProvider.selectedAddress;
      var firstPart = account.substr(0,6);
      var secondPart = "...";
      var thirdPart = account.substr(38,4);
      $("#walletAddrId").text(firstPart + secondPart + thirdPart);
        try {
          web3.eth.getAccounts(function(err, accounts) {
            web3.eth.getBalance(accounts[0], function(error, wei) {
              if (!error) {
                var balance = web3.utils.fromWei(wei, 'ether');
                $("#walletBalId").text(balance.substr(0,6) + " ETH");
              }
            })
          });
        } catch (err) {
          document.getElementById("output").innerHTML = err;
        }
    });
     $("#flip_coin_button").click(function() {

          $("#flip_coin_result").text("");
          var amount = parseFloat($("#amount_input").val());
          if(amount && amount > 0.099 && amount < 11)
          {
            $("#amount_input_error").hide();
            flipCoin();
            //$("#pendingModal").modal();
            
          }
          else showError();
				});

    $("#amount_input").on('input', function() {
         var amount = parseFloat($("#amount_input").val());
         if(amount && amount > 0.099 && amount < 11){ $("#amount_input_error").hide() }
         else showError();
       });
});

function flipCoin(){
  var amount = $("#amount_input").val();

  var config = {
    value: web3.utils.toWei(amount, "ether")
  }
    contractInstance.methods.flip().send(config)
    .on("transactionHash", function(hash){
      console.log("https://ropsten.etherscan.io/tx/" + hash);
      $("#transactionLinkId").attr('href', "https://ropsten.etherscan.io/tx/" + hash);
    })
    .on("receipt", function(receipt){
      console.log("tu sam!")
      var isWin = receipt.events.placedBet.returnValues['isWin'];
        //$("#pendingDialog").hide();
        if(isWin){
            $("#flip_coin_result").text("You won, congratulations!");
            $("#flip_coin_result").css("color", "green");
        }
        else{
          $("#flip_coin_result").text("You lose, we're sorry, play again!");
          $("#flip_coin_result").css("color", "red");
        }
    })
    .on("error", function(error){
      $("#pendingDialog").hide();
       $("#flip_coin_result").text("Something went wrong!");
       $("#flip_coin_result").css("color", "red");
    })
}

function showError(amount){
  if(amount <= 0.099){
     $("#amount_input_error").text("Amount must be greater than 1");
   }else if(amount > 10){
      $("#amount_input_error").text("Amount must be less than 11");
   }
   else {
       $("#amount_input_error").text("Amount is required");
   }
   $("#amount_input_error").show()
}
