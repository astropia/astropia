const ORIGIN = '0x2B158bf42f1E1c9909D66F789853d6fD07A68f11'
const ASTROPIA = '0xe5C26f8435ac53e976A42118DDA67C167d39d646'
const UNIVERSE = '0x11FE79Eb99e82dfeC828B1FfaE6AB99463787085'

const card = id => (`
<div class="col-lg-3 col-md-6 col-xs-12 collection-list">
  <div class="box-content collection-list-${id.substr(60, 2)}"></div>
  <div class="box-content collection-desc col-lg-12"><h1 class="col-lg-6">${
    ['CJ-D', 'Astro', 'CJ-D Plus', 'Astro Plus'][Number(id.substr(60, 2))]
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

  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(ASTROPIA_ABI, ASTROPIA)

  let lock = false
  const container = document.querySelector('#container')
  function update() {
    if (lock) {
      return
    }
    lock = true
    contract.methods.allCardsOf(account).call().then(res => {
      const cards = res.cards.map(id => web3.utils.toHex(id))
      
      const html = cards.map(c => card(c)).join('\n')
      container.innerHTML = html
    })
  }

  setInterval(() => {
    update()
  }, 2000)
})()