const ORIGIN = '0x2B158bf42f1E1c9909D66F789853d6fD07A68f11'
const ASTROPIA = '0xFfe497dBAEA833cc61eB69dAa39eD114cA58B3ea'
const UNIVERSE = '0xa6C297d5bD79B503877882450559DB33e88D1F87'

;(async () => {
  let account
  let chainID
  if (typeof window.ethereum === 'undefined') {
    return
  }
  await window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(() => {
      account = window.ethereum.selectedAddress
      chainID = Number(window.ethereum.chainId)
      console.log('account', account)
      return true
    })
    .catch(() => false)
  
  window.ethereum.addListener('accountsChanged', updateAccount)
  window.ethereum.addListener('chainChanged', updateChain)

  function updateAccount(accounts) {
    account = accounts[0]
  }
  function updateChain(chainID) {
    chainID = Number(chainID)
  }

  const web3 = new Web3(window.ethereum)
  const astropia = new web3.eth.Contract(ASTROPIA_ABI, ASTROPIA)
  const universe = new web3.eth.Contract(UNIVERSE_ABI, UNIVERSE)

  let lock = false
  let cards = []
  function update() {
    if (lock) {
      return
    }
    lock = true
    Promise.all([
      universe.methods.allPendingExps().call(),
      astropia.methods.allCardsOf(account).call().then(res => {
        cards = res
        // TODO returns working IDs
        return []
      }).then(workIDs => {
        return Promise.all(workIDs.map(id => universe.methods.exploration(id).call()))
      }).then(es => {
        console.log('hi', es)
      })
    ]).then(() => {
      lock = false
    })
  }
  setInterval(() => {
    update()
  }, 1000)

  function createExploration(type) {
    universe.methods.createExploration(ASTROPIA, 'cardId', type * 3000 + 2000).send({
      from: account
    })
  }
})()