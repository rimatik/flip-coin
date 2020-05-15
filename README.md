### Install

- install  Ganache-2.1.1 version
- npm install -g truffle


### Setup Metamask in browser

- import account to metamask wallet in browser

### Build and set

- position yourself in folder root cmd
- type `truffle console`
- type `migrate --reset` to deploy contract
- paste contract address to main.js `contractInstance = new web3.eth.Contract(abi,"0xC0521E482dDc41cc9Df5a292F23392fe9dB52C28", {from: accounts[0]});`

### Server config
- install Python
- lunch app with `python -m http.server` for Python 3.x in cmd src folder

### Fix problems with ERR_INVALID_REPL_INPUT error

npm un -g truffle
npm i -g truffle@nodeLTS
rm build 
truffle console
migrate
