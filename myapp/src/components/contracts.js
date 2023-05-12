import LastCardsMinted from './LastCardsMinted.js';
import { SubscribeZoomTransfer, SubscribeZoombiesTransfer, SubscribeZoombiesCardMinted, SubscribeDailyReward, SubscribePackOpened } from './scripts/listeners.js';

import { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'

export default function Contracts({zoomContract, zoombiesContract}) {

    const { account, chainId } = useEthers();


    //contract variables (zoom)
    const [zoomTotalSupply, setZoomTotalSupply] = useState(null);

    async function UpdateZoomTotalSupply(zoomContract) {
        setZoomTotalSupply(await zoomContract.totalSupply());
    }


    //contract variables (zoombies)
    const [zoombiesTotalSupply, setZoombiesTotalSupply] = useState(null);
    const [boosterCredits, setBoosterCredits] = useState(null);
    const [tokenId, setTokenId] = useState([]); //SubscribeZoombiesCardMinted will push to tokenId array


    async function UpdateZoombiesTotalSupply(zoombiesContract) {
        setZoombiesTotalSupply(await zoombiesContract.totalSupply());
    }

    async function UpdateBoosterCredits(zoombiesContract, accountAddress) {
        setBoosterCredits(await zoombiesContract.boosterCreditsOwned(accountAddress));
    }


    //update contracts
    useEffect (() => {
        if (account && zoomContract && zoombiesContract && (chainId === 1284 || chainId === 1285 || chainId === 1287)) {

            //zoom
            UpdateZoomTotalSupply(zoomContract);
            SubscribeZoomTransfer(zoomContract); //TRANSFER ZOOM

    
            //zoombies
            UpdateZoombiesTotalSupply(zoombiesContract);
            UpdateBoosterCredits(zoombiesContract, account);
            SubscribeZoombiesTransfer(zoombiesContract); //TRANSFER ZOOMBIES
            SubscribeZoombiesCardMinted(zoombiesContract, tokenId); //NEW CARD MINTED (pushes ID to tokenId array)
            SubscribeDailyReward(zoombiesContract); //DAILY REWARD
            SubscribePackOpened(zoombiesContract); //PACK OPENED


            //clean up
            return () => {
                //remove active listeners
                zoomContract.removeAllListeners();
                zoombiesContract.removeAllListeners();
                
                //reset variables
                setZoomTotalSupply(null);
                setZoombiesTotalSupply(null);
                setBoosterCredits(null);
                setTokenId([]);
            }

        }

        else { //ex. connected to Ethereum Mainnet
            setZoomTotalSupply(null);
            setZoombiesTotalSupply(null);
            setBoosterCredits(null);
        }
    }, [chainId, account, zoomContract, zoombiesContract, tokenId]);

    
    return (
        <div>

            {account && zoomTotalSupply && (
                <div>
        
                    <b>Zoom token contract (total supply):</b>
                    <p>{zoomTotalSupply ? formatEther(zoomTotalSupply) : ""}</p>
            
                    <br />
            
                    <b>Zoombies token contract (total supply):</b>
                    <p>{zoombiesTotalSupply ? parseInt(zoombiesTotalSupply) : ""}</p>
            
                    <br />
            
                    <b>Booster credits owned:</b>
                    <p>{boosterCredits ? parseInt(boosterCredits) : ""}</p>
            
                    <br />
        
                </div>
            )}
            
            {LastCardsMinted(zoombiesContract, tokenId)}
            
        </div>
    )
}