const CoinFlip = artifacts.require("CoinFlip");

module.exports = function(deployer) {
 deployer.deploy(CoinFlip,1, { value: web3.utils.toWei("0.2", "ether") });
};
