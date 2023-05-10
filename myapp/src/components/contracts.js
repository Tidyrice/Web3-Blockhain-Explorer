import { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'

import { SubscribeZoomTransfer, SubscribeZoombiesTransfer, SubscribeZoombiesCardMinted, SubscribeDailyReward, SubscribePackOpened } from './scripts/listeners.js';

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
    const [tokenId, setTokenId] = useState(null); //setTokenId is passed by reference to SubscribeZoombiesCardMinted


    async function UpdateZoombiesTotalSupply(zoombiesContract) {
        setZoombiesTotalSupply(await zoombiesContract.totalSupply());
    }

    async function UpdateBoosterCredits(zoombiesContract, accountAddress) {
        setBoosterCredits(await zoombiesContract.boosterCreditsOwned(accountAddress));
    }


    //update contracts
    useEffect (() => {
        if ((chainId === 1284 || chainId === 1285 || chainId === 1287) && zoomContract && zoombiesContract) {

            //zoom
            UpdateZoomTotalSupply(zoomContract);
            SubscribeZoomTransfer(zoomContract); //TRANSFER ZOOM

    
            //zoombies
            UpdateZoombiesTotalSupply(zoombiesContract);
            UpdateBoosterCredits(zoombiesContract, account);
            SubscribeZoombiesTransfer(zoombiesContract); //TRANSFER ZOOMBIES
            SubscribeZoombiesCardMinted(zoombiesContract, setTokenId); //MINT ZOOMBIES
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
                setTokenId(null);
            }

        }

        else { //ex. connected to Ethereum Mainnet
            setZoomTotalSupply(null);
            setZoombiesTotalSupply(null);
            setBoosterCredits(null);
        }
    }, [chainId, account, zoomContract, zoombiesContract]);

    
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

                    <b>Last card minted:</b>
                    <br />
                    <div style={{width: "190.3px", height: "306.933px"}}> {/*Image placeholder*/}
                        <img src={`https://zoombies.world/nft-image/moonbeam/${tokenId}`} alt="" width= "190.3px" height= "306.933px" />
                    </div>

                    <br />
        
                </div>
            )}
            
        </div>
    )
}