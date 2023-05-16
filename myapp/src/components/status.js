import {  useBlockNumber, useEtherBalance, useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import { Button } from '@mui/material';

export default function Status() {

    //connect to wallet and blockchain details
    const { account, activateBrowserWallet, chainId } = useEthers();
    const etherBalance = useEtherBalance(account);
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

                  <b>Balance (GLMR):</b>
                  <p>{formatEther(etherBalance)}</p>

                  <br />

                  <b>Current block number:</b>
                  <p>{blockNumber}</p>

                  <br />

              </div>
            )}

        </div>
    )
}

function chainName(chainId) {
    if (chainId === 1)  {
      return "Ethereum Mainnet";
    }
    else if (chainId === 1284) {
      return "Moonbeam";
    }
    else if (chainId === 1285) {
      return "Moonriver";
    }
    else if (chainId === 1287) {
      return "Moonbase Alpha";
    }
    else {
      return "Unconfigured chain";
    }
  }