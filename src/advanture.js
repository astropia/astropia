const ORIGIN = '0x2B158bf42f1E1c9909D66F789853d6fD07A68f11'
const ASTROPIA = '0xe5C26f8435ac53e976A42118DDA67C167d39d646'
const UNIVERSE = '0x11FE79Eb99e82dfeC828B1FfaE6AB99463787085'

const team = t => (`
<div class="col-lg-12 team-list ">
  <div class="col-lg-2 ">
    <div id="team-photo-${t.e.substr(60, 2)}"></div>
  </div>
  <div class="col-lg-7 "><b>${
    ['CJ-D', 'Astro', 'CJ-D Plus', 'Astro Plus'][Number(t.leader.substr(60, 2))]
  }<span>(${t.leader.substr(0, 10)}...)</span></b><br><b>Aim:</b> ${t.aim} light year</div>
  <div class="col-lg-3"><a href="/join-team?${t.e}"><btn>JOIN</btn></a></div>
</div>
`)

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
  let working = []
  const rooms = document.querySelector('#rooms')
  function update() {
    if (lock) {
      return
    }
    lock = true
    Promise.all([
      universe.methods.allPendingExpsDetail().call().then(res => {
        const exps = []
        for (let i = 0; i < res.es.length; i++) {
          exps[i] = {
            e: web3.utils.toHex(res.es[i]),
            aim: res.aims[i],
            leader: web3.utils.toHex(res.leaders[i]),
          }
        }
        // console.log(exps)
        const html = exps.map(e => team(e)).join('\n')
        rooms.innerHTML = html
      }),
      astropia.methods.allCardsOf(account).call().then(res => {
        const c = []
        const works = []
        for (let i = 0; i < res.cards.length; i++) {
          if (res.workIDs[i] !== '0') {
            works.push(res.workIDs[i])
          } else {
            c.push(res.cards[i])
          }
          cards = c
        }
        return works
      }).then(workIDs => {
        return Promise.all(workIDs.map(id => universe.methods.exploration(id).call()))
      }).then(es => {
        working = es.map(item => ({
          aim: item.aim,
          leader: item.leader
        }))
      })
    ]).then(() => {
      lock = false
    })
  }
  setInterval(() => {
    update()
  }, 2000)

  function createExploration(type) {
    universe.methods.createExploration(ASTROPIA, cards[0], type * 3000 + 2000).send({
      from: account
    })
  }

  document.querySelector('#create-room').addEventListener('click', () => {
    createExploration(1)
  })
})()