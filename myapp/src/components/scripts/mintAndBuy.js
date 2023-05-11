export async function MintBoosterNFT(zoombiesContract, DisplayError) {
    zoombiesContract.mintBoosterNFT(0).catch((error) => {
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

export async function BuyBoosterCredits(zoombiesContract, amount,DisplayError) {
    zoombiesContract.buyBoosterCredits(amount, {value: amount*(10**18).toString()}).catch((error) => { //convert ether to wei
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

export async function BuyAndMintBoosterNFT(zoombiesContract, DisplayError) { //INOPERABLE
    zoombiesContract.buyBoosterAndMintNFT({value: 1*(10**18).toString()}).catch((error) => {
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