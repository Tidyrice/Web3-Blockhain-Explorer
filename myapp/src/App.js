import React, { useEffect, useState } from 'react'
import {  useBlockNumber, useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { Button } from '@mui/material';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';

import zoomArtifactJson from './resources/ZoomToken.json';
import zoombiesArtifactJson from './resources/Zoombies.json';

function chainName(chainId) {
  if (chainId == 1)  {
    return "Ethereum Mainnet";
  }
  else if (chainId == 1284) {
    return "Moonbeam";
  }
  else if (chainId == 1285) {
    return "Moonriver";
  }
  else if (chainId == 1287) {
    return "Moonbase Alpha";
  }
  else {
    return "Unconfigured chain";
  }
}

export default function App() {
  
  //connect to wallet and blockchain details
  const { account, deactivate, activateBrowserWallet, chainId, library } = useEthers()
  const etherBalance = useEtherBalance(account)
  const blockNumber = useBlockNumber();

  //contract variables (zoom)
  let zoomContract;
  const [zoomTotalSupply, setZoomTotalSupply] = useState(null);
  async function UpdateZoomTotalSupply() {
    setZoomTotalSupply(await zoomContract.totalSupply());
  }

  //contract variables (zoombies)
  let zoombiesContract;
  const [zoombiesTotalSupply, setZoombiesTotalSupply] = useState(null);
  const [boosterCredits, setBoosterCredits] = useState(null);
  async function UpdateZoombiesTotalSupply() {
    setZoombiesTotalSupply(await zoombiesContract.totalSupply());
  }
  async function UpdateBoosterCredits(zoombiesContractAddress) {
    setBoosterCredits(await zoombiesContract.boosterCreditsOwned(zoombiesContractAddress));
  }

  //update contracts
  useEffect (() => {
    if (chainId == 1284 || chainId == 1285 || chainId == 1287) {
      const zoomWethInterface = new utils.Interface(zoomArtifactJson.abi);
      const zoomContractAddress = zoomArtifactJson.networks[chainId].address;
      zoomContract = new Contract(zoomContractAddress, zoomWethInterface, library);
      UpdateZoomTotalSupply();

      const zoombiesWethInterface = new utils.Interface(zoombiesArtifactJson.abi);
      const zoombiesContractAddress = zoombiesArtifactJson.networks[chainId].address;
      zoombiesContract = new Contract(zoombiesContractAddress, zoombiesWethInterface, library);
      UpdateZoombiesTotalSupply();
      UpdateBoosterCredits(zoombiesContractAddress);
    }
  }, [chainId]);

  return (
    <div>

      {!account && <Button variant="contained" onClick={() => activateBrowserWallet()}>Connect</Button> /*only displays when not connected*/}
      
      {account && etherBalance && (
        <div>

          <h1>CONNECTED - {chainName(chainId)}</h1>

          <br />

          <b>Wallet Address:</b>
          <p>{account}</p>

          <br />

          <b>ChainID:</b>
          <p>{chainId}</p>

          <br />

          <b>Balance (ETH):</b>
          <p>{formatEther(etherBalance)}</p>

          <br />

          <b>Current block number:</b>
          <p>{blockNumber}</p>

          <br />

        </div>
      )}

      {zoomTotalSupply && (
        <div>

          <b>Zoom token contract (total supply):</b>
          <p>{zoomTotalSupply ? formatEther(zoomTotalSupply) : ""}</p>

          <br />

          <b>Zoombies token contract (total supply):</b>
          <p>{zoombiesTotalSupply ? formatEther(zoombiesTotalSupply) : ""}</p>

          <br />

          <b>Zoombies token contract (credits owned):</b>
          <p>{boosterCredits ? formatEther(boosterCredits) : ""}</p>

          <br />

        </div>
      )}

    </div>
  )
}

// <b>Last card minted:</b>
// <img src="https://zoombies.world/nft-image/295508" width="10%"/>