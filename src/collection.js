const ORIGIN = '0x02Ad248E72F1443253e8C29B4ef4d394Bd859921'
const ASTROPIA = '0x466774a36a99941C99069Ad4F69c6845dF83d366'
const UNIVERSE = '0x6Caae7e411A2276c4aC6725914Ec06c3bD615d96'

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
  const queryWeb3 = new Web3('https://data-seed-prebsc-2-s1.binance.org:8545/')
  const contract = new web3.eth.Contract(ASTROPIA_ABI, ASTROPIA)
  const queryContract = new queryWeb3.eth.Contract(ASTROPIA_ABI, ASTROPIA)

  const ash = document.querySelector('#ash')
  const balance = document.querySelector('#balance')
  let lock = false
  function update() {
    if (lock) {
      return
    }
    lock = true
    queryContract.methods.crystalOf(account).call().then(res => {
      ash.innerHTML = (Number(res.amount) / 1e19).toFixed(2)
      balance.innerHTML = (Number(res.investment) / 1e18).toFixed(2)
      lock = false
    }).catch(() => {
      lock = false
    })
  }
  setInterval(() => {
    update()
  }, 1000)

  function invest(amount) {
    contract.methods.invest().send({
      from: account,
      value: web3.utils.toWei(amount)
    }).then(console.log)
  }
  function divest() {
    contract.methods.divest(web3.utils.toWei('1')).send({
      from: account
    }).then(console.log)
  }

  document.querySelector('#add-1').addEventListener('click', () => {
    invest('1')
  })
  document.querySelector('#add-2').addEventListener('click', () => {
    invest('2')
  })
  document.querySelector('#add-5').addEventListener('click', () => {
    invest('5')
  })
  document.querySelector('#unstake').addEventListener('click', () => {
    divest()
  })

  function mint(type) {
    contract.methods.mint(type).send({
      from: account
    }).then(res => {
      if (res.blockHash) {
        location.pathname = '/dashboard'
      }
    })
  }
  const summons = document.querySelectorAll('.summon')
  for (let i = 0; i < summons.length; i++) {
    summons[i].addEventListener('click', () => {
      mint(i + 1)
    })
  }
})()