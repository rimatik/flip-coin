const CoinFlip = artifacts.require("CoinFlip");

module.exports = function(deployer) {
 deployer.deploy(CoinFlip,10, { value: web3.utils.toWei("10", "ether") });
};
