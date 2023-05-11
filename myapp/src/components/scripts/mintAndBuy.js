import { parseEther } from "ethers/lib/utils";

export async function MintBoosterNFT(zoombiesContract, DisplayError, DisplaySuccess) {
    zoombiesContract.mintBoosterNFT(0)
    .then((result) => {
        console.log("Minted Booster NFT: ", result);
        DisplaySuccess();
    })
    .catch((error) => {
        if (error.code === "ACTION_REJECTED") {
            DisplayError("Transaction cancelled");
        }
        else if (error.code === -32603) { //insufficient GLMR
            DisplayError("Insufficient GLMR or Booster Credits");
        }
        else {
            DisplayError(error.message);
        }
    });
}

export async function BuyBoosterCredits(zoombiesContract, amount, DisplayError, DisplaySuccess) {
    zoombiesContract.buyBoosterCredits(amount, {value: parseEther(amount.toString())})
    .then((result) => {
        console.log("Bought Booster Credits: ", result);
        DisplaySuccess();
    })
    .catch((error) => { //convert ether to wei
        if (error.code === "ACTION_REJECTED") {
            DisplayError("Transaction cancelled");
        }
        else if (error.code === -32603) { //insufficient GLMR
            DisplayError("Insufficient GLMR");
        }
        else {
            DisplayError(error.message);
        }
    });
}

export async function BuyAndMintBoosterNFT(zoombiesContract, DisplayError, DisplaySuccess) { //INOPERABLE
    zoombiesContract.buyBoosterAndMintNFT({value: parseEther("1")}).then((result) => {
        console.log("Bought Booster and Minted NFT: ", result);
        DisplaySuccess();
    })
    .catch((error) => {
        if (error.code === "ACTION_REJECTED") {
            DisplayError("Transaction cancelled");
        }
        else if (error.code === -32603) { //insufficient GLMR
            DisplayError("Insufficient GLMR");
        }
        else {
            DisplayError(error.message);
        }
    });
}