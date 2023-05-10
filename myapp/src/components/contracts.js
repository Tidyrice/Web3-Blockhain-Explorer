import { useEffect, useState } from 'react'
import { ethers, utils } from 'ethers';
import { useEthers } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts';
import { formatEther } from '@ethersproject/units'

import zoomArtifactJson from '../resources/ZoomToken.json';
import zoombiesArtifactJson from '../resources/Zoombies.json';
import { SubscribeZoomTransfer, SubscribeZoombiesTransfer, SubscribeZoombiesCardMinted, SubscribeDailyReward, SubscribePackOpened } from './scripts/listeners.js';

export default function Contracts() {

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
        if (chainId === 1284 || chainId === 1285 || chainId === 1287) {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner(account);


            //zoom
            const zoomWethInterface = new utils.Interface(zoomArtifactJson.abi);
            const zoomContractAddress = zoomArtifactJson.networks[chainId].address;
            const zoomContract = new Contract(zoomContractAddress, zoomWethInterface, provider);

            UpdateZoomTotalSupply(zoomContract);
            SubscribeZoomTransfer(zoomContract); //TRANSFER ZOOM

    
            //zoombies
            const zoombiesWethInterface = new utils.Interface(zoombiesArtifactJson.abi);
            const zoombiesContractAddress = zoombiesArtifactJson.networks[chainId].address;
            const zoombiesContract = new Contract(zoombiesContractAddress, zoombiesWethInterface, signer);

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
    }, [chainId, account]);

    
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