const ORIGIN = '0xC57742DA0C7b34EAaC31592Eb0f4643f73C51332'
const ASTROPIA = '0x56cB3e4027f93D9d04655FFB32db3770c997FA71'
const UNIVERSE = '0x0589572f17f6Bd1101448a49fd54fa1cddDDfa3D'

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

  const web3 = new Web3('http://127.0.0.1:8545')
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