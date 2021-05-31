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
		await wait(1 * 1000)
		try {
			await lottery.enter({ from: alice, value: web3.utils.toWei('0.1', 'ether') })
		} catch (error) {
			return assert.isOk(error)
		}
		assert(false)
	})

	it('can pick the winner', async () => {
		const lottery = await Lottery.new(2, { from: manager })
		await lottery.enter({ from: alice, value: web3.utils.toWei('2', 'ether') })
		await lottery.enter({ from: alice, value: web3.utils.toWei('1', 'ether') })

		const aliceBeforeBalance = await web3.eth.getBalance(alice)
		const bobBeforeBalance = await web3.eth.getBalance(bob)
		await wait(2 * 1000)

		await lottery.pickWinner({ from: manager })

		const aliceAfterBalance = await web3.eth.getBalance(alice)
		const bobAfterBalance = await web3.eth.getBalance(bob)

		const aliceDiff = aliceAfterBalance - aliceBeforeBalance
		const bobDiff = bobAfterBalance - bobBeforeBalance

		const assert1 = aliceDiff == web3.utils.toWei('3', 'ether')
		const assert2 = bobDiff == web3.utils.toWei('3', 'ether')
		assert(assert1 ? !assert2 : assert2)
	})

	it('can not pick winner before endtime', async () => {
		const lottery = await Lottery.new(10, { from: manager })
		await lottery.enter({ from: alice, value: web3.utils.toWei('1', 'ether') })
		try {
			await lottery.pickWinner({ from: manager })
		} catch (error) {
			return assert.isOk(error)
		}
		assert(false)
	})

	it('can store previous winner and prize, clear the players', async () => {
		const amount = web3.utils.toWei('1', 'ether')
		const lottery = await Lottery.new(1, { from: manager })
		await lottery.enter({ from: alice, value: amount })
		await wait(1 * 1000)
		await lottery.pickWinner({ from: manager })

		const prevWinner = await lottery.prevWinner.call()
		const prevPrize = await lottery.prevPrize.call()
		const players = await lottery.getPlayers()

		assert.equal(prevWinner, alice)
		assert.equal(prevPrize, amount)
		assert.equal(players.length, 0)
	})
})
