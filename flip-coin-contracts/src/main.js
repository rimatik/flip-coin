var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi,"0x9D31B96E5ABB23f1fab41cc2533B1416A58e155C",{from: accounts[0]});
      var event = contractInstance.events.placedBet(function(error, result) {
        console.log(result); 
        if(error){
          console.log(error); 
        }
        
         var isWin = result.returnValues['isWin'];
          $("#pendingModal").modal('hide');
          if(isWin){
              $("#flip_coin_result").text("You won, congratulations!");
              $("#flip_coin_result").css("color", "green");
          }
          else{
            $("#flip_coin_result").text("You lose, we're sorry, play again!");
            $("#flip_coin_result").css("color", "red");
          }
     });

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
          }
          else showError();
				});

    $("#amount_input").on('input', function() {
         var amount = parseFloat($("#amount_input").val());
         if(amount && amount > 0.099 && amount < 11){ $("#amount_input_error").hide() }
         else showError();
       });

       $("#withdraw_funds_button").click(function() {
         console.log("tu sam!")
          withdraw();
      });


      

      // var eventBetResolved=contractInstance.events.placedBet(function(err, result){
      //   if (err){
      //     console.log(err);
      //   }
      //   else{
      //     console.log(result);
          
        // }
      // })
});

function getLastResult(){
  contractInstance.methods.getResult(web3.currentProvider.selectedAddress).call().then((result) => {
    var isWin = result['0'];
    console.log(isWin)
    if(isWin)
    {
      $("#withdraw_funds_button").css("visibility", "visible");
    }else {
      $("#withdraw_funds_button").css("visibility", "hidden");
      flipCoin();
    }
  });
}
function flipCoin(){
  var amount = $("#amount_input").val();
  $("#pendingModal").modal();
  var config = {
    value: web3.utils.toWei(amount, "ether")
  }
    contractInstance.methods.flip().send(config)
    .on("transactionHash", function(hash){
      console.log("https://ropsten.etherscan.io/tx/" + hash);
      $("#transactionLinkId").attr('href', "https://ropsten.etherscan.io/tx/" + hash);
    })
    .on("receipt", function(receipt){
      console.log(receipt)
      // var isWin = receipt.events.placedBet.returnValues['isWin'];
      //   $("#pendingModal").modal('hide');
      //   if(isWin){
      //       $("#flip_coin_result").text("You won, congratulations!");
      //       $("#flip_coin_result").css("color", "green");
      //   }
      //   else{
      //     $("#flip_coin_result").text("You lose, we're sorry, play again!");
      //     $("#flip_coin_result").css("color", "red");
      //   }
    })
    .on("error", function(error){
      $("#pendingModal").hide();
       $("#flip_coin_result").text("Something went wrong!");
       $("#flip_coin_result").css("color", "red");
    })
}

function withdraw(){
  var config = {
    value: web3.utils.toWei("0.01", "ether")
  }
    contractInstance.methods.withdrawPlayerFunds().send(config)
    .on("transactionHash", function(hash){
      console.log(hash)
    })
    .on("receipt", function(receipt){
      console.log(receipt)
      var withdraw = receipt.events.logWithdraw.returnValues['withdraw'];
      if(withdraw){
        $("#withdraw_funds_result").css("visibility", " visible");
      }else {
        $("#withdraw_funds_result").css("visibility", " hidden");
      }
    })
    .on("error", function(error){
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
