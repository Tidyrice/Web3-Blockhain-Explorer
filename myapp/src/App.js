//components
import Status from './components/Status.js';
import Contracts from './components/Contracts.js';
import Transactions from './components/Transactions.js';

//dependencies
import { useEffect, useState } from 'react'
import { ethers, utils } from 'ethers';
import { useEthers } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts';
import zoomArtifactJson from './resources/ZoomToken.json';
import zoombiesArtifactJson from './resources/Zoombies.json';

export default function App() {

  const { account, chainId } = useEthers();

  const [zoomContract, setZoomContract] = useState(null);
  const [zoombiesContract, setZoombiesContract] = useState(null);

  //update contract variables
  useEffect (() => {
    if (account && (chainId === 1284 || chainId === 1285 || chainId === 1287)) {

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner(account);

        //reload page on network change
        provider.on("network", (newNetwork, oldNetwork) => { //https://docs.ethers.org/v5/concepts/best-practices/
          if (oldNetwork) {
              window.location.reload();
          }
        });

        //reload page on account change
        window.ethereum.on("accountsChanged", (accounts) => {window.location.reload()});

        //zoom
        const zoomWethInterface = new utils.Interface(zoomArtifactJson.abi);
        const zoomContractAddress = zoomArtifactJson.networks[chainId].address;
        setZoomContract(new Contract(zoomContractAddress, zoomWethInterface, provider));

        //zoombies
        const zoombiesWethInterface = new utils.Interface(zoombiesArtifactJson.abi);
        const zoombiesContractAddress = zoombiesArtifactJson.networks[chainId].address;
        setZoombiesContract(new Contract(zoombiesContractAddress, zoombiesWethInterface, signer));

    }
  }, [chainId, account]);

  return (

    <div>

      {Status()}

      {Contracts({zoomContract: zoomContract, zoombiesContract: zoombiesContract})}

      {Transactions({zoombiesContract: zoombiesContract})}

    </div>

  )
}