var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi,"0xC0521E482dDc41cc9Df5a292F23392fe9dB52C28", {from: accounts[0]});
    });
     $("#flip_coin_button").click(function() {

          $("#flip_coin_result").text("");
          var amount = parseInt($("#amount_input").val());
          if(amount && amount > 0 && amount < 11)
          {
            $("#amount_input_error").hide();
              flipCoin();
          }
          else showError();
				});

    $("#amount_input").on('input', function() {
         var amount = parseInt($("#amount_input").val());
         if(amount && amount > 0 && amount < 11){ $("#amount_input_error").hide() }
         else showError();
       });
});

function flipCoin(){
  var amount = $("#amount_input").val();

   var config = {
     value: web3.utils.toWei(amount, "ether")
   }
    contractInstance.methods.flipCoin().send(config)
    .on("transactionHash", function(hash){
      console.log(hash);
    })
    .on("receipt", function(receipt){
        console.log(receipt);
        if(receipt.events.placedBet.returnValues[2] === false){
          $("#flip_coin_result").text("You lose, we're sorry, play again!")
            $("#flip_coin_result").css("color", "red");
        }
        else if(receipt.events.placedBet.returnValues[2] === true){
          $("#flip_coin_result").text("You won, congratulations!")
            $("#flip_coin_result").css("color", "green");
        }
    })
    .on("error", function(error){
       $("#flip_coin_result").text("Something went wrong!");
       $("#flip_coin_result").css("color", "red");
    })
}

function showError(amount){
  if(amount <= 0){
     $("#amount_input_error").text("Amount must be greater than 1");
   }else if(amount > 10){
      $("#amount_input_error").text("Amount must be less than 11");
   }
   else {
       $("#amount_input_error").text("Amount is required");
   }
   $("#amount_input_error").show()
}
