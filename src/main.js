var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi,"0x0bb6C78A667bd3CCBda20a0A54b51c3386F95156",{from: accounts[0]});
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
            $("#pendingModal").modal();
            
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
    value: web3.utils.toWei("0.05", "ether")
  }
    contractInstance.methods.getRandom().send(config)
    .on("transactionHash", function(hash){
      console.log(hash);
    })
    .on("receipt", function(receipt){
      console.log(receipt.events.error.returnValues[2]);
      console.log(receipt.events.lowLevelError.returnValues[2]);
      console.log(receipt.events.generatedRandomNumber.returnValues[2]);
      if(!isNaN(receipt.events.generatedRandomNumber.returnValues[2]));
      {
        var cnfg = {
          value: web3.utils.toWei(amount, "ether")
        }
        contractInstance.methods.flipCoin(receipt.events.generatedRandomNumber.returnValues[2]).send(cnfg)
        .on("transactionHash", function(hash){
          console.log(hash);
          $("#transactionLinkId").attr('href', "https://ropsten.etherscan.io/tx/" + hash);
        })
        .on("receipt", function(receipt){
          $("#pendingDialog").hide();
          if(receipt.events.placedBet.returnValues[2] === false){
            $("#flip_coin_result").text("You lose, we're sorry, play again!");
              $("#flip_coin_result").css("color", "red");
          }
          else if(receipt.events.placedBet.returnValues[2] === true){
            $("#flip_coin_result").text("You won, congratulations!");
              $("#flip_coin_result").css("color", "green");
          }
        })
       
      }
    })
    .on("error", function(error){
      console.log(error.events.error.returnValues[2]);
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
