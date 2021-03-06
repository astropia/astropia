window.UNIVERSE_ABI = [
  {
    "inputs": [
      {
        "internalType": "contract Origin",
        "name": "_o",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "allPendingExps",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "es",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "allPendingExpsDetail",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "es",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "aims",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "leaders",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract Astropia",
        "name": "_astropia",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_cardID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_aim",
        "type": "uint256"
      }
    ],
    "name": "createExploration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_eID",
        "type": "uint256"
      }
    ],
    "name": "end",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_eID",
        "type": "uint256"
      }
    ],
    "name": "exploration",
    "outputs": [
      {
        "internalType": "bool",
        "name": "ongoing",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "salt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leader",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "member",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "aim",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "progress",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "god",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "itemCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_player",
        "type": "address"
      }
    ],
    "name": "itemsOf",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract Astropia",
        "name": "_astropia",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_cardID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_eID",
        "type": "uint256"
      }
    ],
    "name": "joinExploration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "origin",
    "outputs": [
      {
        "internalType": "contract Origin",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_eID",
        "type": "uint256"
      }
    ],
    "name": "rageEnd",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract Astropia",
        "name": "_addr",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_states",
        "type": "bool"
      }
    ],
    "name": "setTrustContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalItemCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract Astropia",
        "name": "",
        "type": "address"
      }
    ],
    "name": "whitelist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]