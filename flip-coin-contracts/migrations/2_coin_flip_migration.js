const CoinFlip = artifacts.require("CoinFlip");

module.exports = function(deployer) {
 deployer.deploy(CoinFlip,0.1, { value: web3.utils.toWei("0.1", "ether") });
};