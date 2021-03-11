const ORIGIN = '0x02Ad248E72F1443253e8C29B4ef4d394Bd859921'
const ASTROPIA = '0x466774a36a99941C99069Ad4F69c6845dF83d366'
const UNIVERSE = '0x6Caae7e411A2276c4aC6725914Ec06c3bD615d96'

const card = id => (`
<div class="col-lg-3 col-md-6 col-xs-12 collection-list">
  <div class="box-content collection-list-${id.substr(60, 2)}"></div>
  <div class="box-content collection-desc col-lg-12"><h1 class="col-lg-6">${
    ['CJ-D', 'Astro', 'CJ-D Plus', 'Astro Plus'][Number(id.substr(60, 2)) - 1]
  }</h1></div>
</div>
`)

;(async () => {
  let account
  let chainID
  if (typeof window.ethereum === 'undefined') {
    return
  }
  const accountDom = document.querySelector('#account')
  await window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(() => {
      account = window.ethereum.selectedAddress
      chainID = Number(window.ethereum.chainId)
      accountDom.innerHTML = account
      return true
    })
    .catch(() => false)
  
  window.ethereum.addListener('accountsChanged', updateAccount)
  window.ethereum.addListener('chainChanged', updateChain)

  function updateAccount(accounts) {
    account = accounts[0]
    accountDom.innerHTML = account
  }
  function updateChain(chainID) {
    chainID = Number(chainID)
  }

  const web3 = new Web3('https://data-seed-prebsc-2-s1.binance.org:8545/')
  const contract = new web3.eth.Contract(ASTROPIA_ABI, ASTROPIA)

  let lock = false
  const container = document.querySelector('#container')
  function update() {
    if (lock) {
      return
    }
    lock = true
    contract.methods.allCardsOf(account).call().then(res => {
      const cards = res.cards.map(id => '0x' + web3.utils.toHex(id).substr(2).padStart(64, '0'))
      
      const html = cards.map(c => card(c)).join('\n')
      container.innerHTML = html
    })
  }

  setInterval(() => {
    update()
  }, 2000)
})()