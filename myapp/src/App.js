import React, { useEffect } from 'react'
import {  useBlockNumber, useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { Button } from '@mui/material';
import { formatCurrency } from '@usedapp/core/dist/esm/src/model';

function chainName(chainId) {
  if (chainId == 1)  {
    return "Ethereum Mainnet"
  }
  else if (chainId == 1287) {
    return "Moonbase Alpha"
  }
  else {
    return "Unconfigured chain"
  }
}

export default function App() {
  const { account, deactivate, activateBrowserWallet, chainId, error } = useEthers()
  const etherBalance = useEtherBalance(account)
  const blockNumber = useBlockNumber();

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

        </div>
      )}

    </div>
  )
}