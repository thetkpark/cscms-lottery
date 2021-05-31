const Lottery = artifacts.require('Lottery')

module.exports = function (deployer) {
	deployer.deploy(Lottery, 24 * 60 * 60)
}
