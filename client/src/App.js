import React from 'react';
import './App.css';
import Round from './Round'
import { Button } from './styled'
import { useMetaMask } from "metamask-react";
import useContract from './hooks/useContract';

const ropsten = {
  chainId: "0x3",
  chainName: "Ropsten Testnet",
  nativeCurrency: {
    name: "ETHER",
    symbol: "ETH",
    decimals: 18
  }
}
function PlayGame({ contract }) {
  const [countDown, setCountDown] = React.useState(9);
  const [win, setWin] = React.useState(false);
  const [game, setGame] =React.useState(undefined);
  const [result, setResult] = React.useState([]);
  const [card, setCard] = React.useState(undefined);
  function array2str(arr){
    var str = "";
    for(let i = 0; i <arr.length; i++){
    str += arr[i];
    }
    return str;
  }
  const submit = async () => {
    try{
      await contract.submit(array2str(result));
    }
    catch(e){
      alert(e.message);
    }
 
  }
  const getGame = async() => {
    let _game = await contract?.play();
    setGame(JSON.parse(_game));
  }
  React.useEffect(() => {
    getGame();
  },[])
  const getCard = async() => {
    try{
      let card = await contract.getCard();
      setCard(card);
    }
    catch(e) {
      alert(e.message);
    }
  }
  return (
    <>
      {game && !card && <Round 
        challenge={game}
        countDown={() => setCountDown(countDown - 1)}
        countDownValue={countDown}
        setWin={setWin}
        getCard={getCard}
        submit={submit}
        setResult={setResult}
        result={result}
      />}
      {card && <span style={{ color: "#fddb3a" }}>{card}</span>}
      <div>
        {!win && <p style={{ maxWidth: "21rem" }}>
          You win (Viettel - 100.000 VND) if all the boxes turn <span style={{ color: "#fddb3a" }}>yellow</span><br />
          Number of presses remaining {countDown} <br />
          {countDown < 0 && <p>You Lose 🙂</p>}
          <a href="https://hoan-do.gitbook.io/whitepaper/" style={{ color: "white" }}>Whitepaper</a>
        </p>}
      </div>
    </>
  )
}
function Vote({ contract, minimal, player }) {
  const [loading, setLoading] = React.useState(false);
  const register = async() => {
    setLoading(true);
    try{
      await contract.applyNow();
      alert("Apply successed, please waiting for transaction complete");
      setLoading(false);
    }
    catch(e){
      alert(e.message);
      setLoading(false);
    }
   
  }
  return (
    <>
      <div>The winner will get a phone recharge card</div>
      <div style={{ marginBottom: "1rem" }}>Need <span style={{ fontWeight: "bold" }}>{minimal - player}</span> players to start</div>
      {!loading && <Button style={{ marginBottom: "1rem" }} onClick={register}>Apply Now 🤑 </Button>}
      {loading && <span>Loading...</span>}
      <a href="https://hoan-do.gitbook.io/whitepaper/" style={{ color: "white", fontSize: "14px" }}>Whitepaper</a>
    </>
  )
}
function App() {
  const { status, connect, account, chainId } = useMetaMask();
  const { data, contract } = useContract(status, account);
  const switchNetwork = async () => {
    try{
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${Number(3).toString(16)}` }],
      })
    }
    catch(e){
      alert(e.message);
      // if (switchError.code === 4902) {
      //   try {
      //     await ethereum.request({
      //       method: 'wallet_addEthereumChain',
      //       params: [{ chainId: '0xf00', rpcUrl: 'https://...' /* ... */ }],
      //     });
      //   } catch (addError) {
      //     alert(addError.message);
      //   }
      // }
    }
   
  }
  return (
    <div className="App">
      <header className="App-header">
        {chainId !== "0x3" && status === "connected" && <Button onClick={switchNetwork}>Switch to Rospten</Button>}
        {status === "unavailable" && <div>MetaMask not available 😰 please read <a href="https://hoan-do.gitbook.io/whitepaper/" style={{ color: "white" }}>Whitepaper</a></div>}
        {status === "notConnected" && chainId === "0x3" && <Button onClick={connect}>Connect</Button>}
        {status === "connecting" && <div>Connecting...</div>}
        {status === "connected" && !data.paused && chainId === "0x3" && <PlayGame contract={contract}/>}

        {status === "connected" && data.paused && chainId === "0x3" &&
          <Vote contract={contract} minimal={data?.minimal} player={data?.players} />}
        <footer style={{position: "fixed", bottom: 0, fontSize:13, paddingBottom: 10}}>Copyright by <a href="https://www.linkedin.com/in/hoan-do-73a7661a8" style={{color:"white"}}>Hoando.</a></footer>
      </header>
      
    </div>
  );
}
export default App;
