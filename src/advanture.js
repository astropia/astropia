const ORIGIN = '0x02Ad248E72F1443253e8C29B4ef4d394Bd859921'
const ASTROPIA = '0x466774a36a99941C99069Ad4F69c6845dF83d366'
const UNIVERSE = '0x6Caae7e411A2276c4aC6725914Ec06c3bD615d96'

const team = t => (`
<div class="col-lg-12 team-list ">
  <div class="col-lg-2 ">
    <div id="team-photo-${t.e.substr(60, 2)}"></div>
  </div>
  <div class="col-lg-7 "><b>${
    ['CJ-D', 'Astro', 'CJ-D Plus', 'Astro Plus'][Number(t.leader.substr(60, 2)) - 1]
  }<span>(${t.leader.substr(0, 10)}...)</span></b><br><b>Aim:</b> ${t.aim} light year</div>
  <div class="col-lg-3"><a onclick="join('${t.e}')"><btn>JOIN</btn></a></div>
</div>
`)

const progress = t => (`
<div class="col-lg-12 ongoing" style="margin-bottom: 30px;">
  <div class="desc">Your
    <b>${['CJ-D', 'Astro', 'CJ-D Plus', 'Astro Plus'][Number(t.member.substr(60, 2)) - 1]}</b>
    is on an advanture with <b>${['CJ-D', 'Astro', 'CJ-D Plus', 'Astro Plus'][Number(t.leader.substr(60, 2)) - 1]}</b>
    <span>(${t.leader.substr(0, 10)})</span>
    <b>in Sirius.</b>
  </div>
  <div class="col-lg-12" style="padding-left:0;">
    <div class="meter animate col-lg-12 time">
      <span style="width: ${Math.floor(Number(t.progress) / Number(t.aim) * 100)}%"><span></span></span>
      <p>Reture in ...</p>
    </div>
  </div>
</div>
`)

const ended = t => (`
<div class="row row-inline-block advanture-back" style="margin-bottom: 50px;">
  <div class="desc col-lg-8 ">Team is back from
    <b>Sirius</b>
    <br>
    <div class="back">Your
    <b>${['CJ-D', 'Astro', 'CJ-D Plus', 'Astro Plus'][Number(t.member.substr(60, 2))]}</b>
    and
    <b>${['CJ-D', 'Astro', 'CJ-D Plus', 'Astro Plus'][Number(t.leader.substr(60, 2))]}</b>
    <span>(${t.leader.substr(0, 10)})</span></div></div>
  <div class="col-lg-4 " >
    <div class="gift">
      <div onclick="end('${t.e}')">🥟<br>Item Minted</div>
    </div>
  </div>
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
  const queryWeb3 = new Web3('https://data-seed-prebsc-2-s1.binance.org:8545/')
  const universe = new web3.eth.Contract(UNIVERSE_ABI, UNIVERSE)
  const queryAstropia = new queryWeb3.eth.Contract(ASTROPIA_ABI, ASTROPIA)
  const queryUniverse = new queryWeb3.eth.Contract(UNIVERSE_ABI, UNIVERSE)

  let lock = false
  let cards = []
  let working = []
  let wIDs
  const rooms = document.querySelector('#rooms')
  const progressDom = document.querySelector('#progress')
  const endedDom = document.querySelector('#end')
  function update() {
    if (lock) {
      return
    }
    lock = true
    Promise.all([
      queryUniverse.methods.allPendingExpsDetail().call().then(res => {
        const exps = []
        for (let i = 0; i < res.es.length; i++) {
          exps[i] = {
            e: '0x' + web3.utils.toHex(res.es[i]).substr(2).padStart(64, '0'),
            aim: res.aims[i],
            leader: '0x' + web3.utils.toHex(res.leaders[i]).substr(2).padStart(64, '0'),
          }
        }
        // console.log(exps)
        const html = exps.map(e => team(e)).join('\n')
        rooms.innerHTML = html
      }),
      queryAstropia.methods.allCardsOf(account).call().then(res => {
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
        wIDs = workIDs
        return Promise.all(workIDs.map(id => queryUniverse.methods.exploration(id).call()))
      }).then(es => {
        working = es.map((item, i)=> ({
          e: wIDs[i],
          aim: item.aim,
          leader: '0x' + web3.utils.toHex(item.leader).substr(2).padStart(64, '0'),
          member: '0x' + web3.utils.toHex(item.member).substr(2).padStart(64, '0'),
          progress: item.progress,
        }))

        let ps = []
        let endeds = []
        for (const w of working) {
          if (w.aim === w.progress) {
            endeds.push(w)
          } else {
            ps.push(w)
          }
        }

        progressDom.innerHTML = ps.map(w => progress(w)).join('\n')

        endedDom.innerHTML = endeds.map(w => ended(w)).join('\n')
      })
    ]).then(() => {
      lock = false
    })
  }
  setInterval(() => {
    update()
  }, 2000)

  function createExploration(type) {
    universe.methods.createExploration(ASTROPIA, cards[0], type * 30000 + 20000).send({
      from: account
    })
  }

  document.querySelector('#create-room').addEventListener('click', () => {
    createExploration(1)
  })

  window.join = (e) => {
    universe.methods.joinExploration(ASTROPIA, cards[0], e).send({
      from: account
    })
  }

  window.end = (e) => {
    universe.methods.end(e).send({
      from: account
    })
  }
})()