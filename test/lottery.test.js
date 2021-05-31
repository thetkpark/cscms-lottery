const Lottery = artifacts.require('Lottery')

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

contract('Lottery Test', async ([manager, alice, bob]) => {
	it('deployed', async () => {
		const lottery = await Lottery.new(100, { from: manager })
		const duration = await lottery.duration.call()
		const mng = await lottery.manager.call()
		assert.equal(duration.toNumber(), 100)
		assert.equal(mng, manager)
	})

	it('can be entered', async () => {
		const lottery = await Lottery.new(10, { from: manager })
		await lottery.enter({ from: alice, value: web3.utils.toWei('0.1', 'ether') })
		const players = await lottery.getPlayers.call()
		assert.equal(players.length, 1)
		assert.equal(players[0], alice)
	})

	it('can not be enter after ending time', async () => {
		const lottery = await Lottery.new(1, { from: manager })
		await wait(10)
		try {
			await lottery.enter({ from: alice, value: web3.utils.toWei('0.1', 'ether') })
		} catch (error) {
			return assert.isOk(error)
		}
		assert(false)
	})
})
