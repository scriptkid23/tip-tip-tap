import React from 'react'
import {Contract, ethers} from 'ethers'
import {abi} from '../abis/TipTipTap.json'
const contractAddress = "0x2BcAB2aBdE6cD81c3Fbd2709F256990f9e015e64";
export default function useContract() {
    const [contract, setContract] = React.useState();
    const [data, setData] = React.useState({
        address: "",
        paused: true,
        minimal: 0,
        players: 0, 
    })
    React.useEffect(async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi, signer);
        setContract(contract);
        let result = await contract.paused();
        let _minimal = await contract.minimalToPlay();    
        let _player = await contract.players();
        setData({
            address: contract.address,
            paused: result,
            minimal: _minimal,
            players: _player
        })
      
    },[])
   
    return {data, contract}
}