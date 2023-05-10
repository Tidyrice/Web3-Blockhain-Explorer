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

export async function BuyBoosterCredits(zoombiesContract, DisplayError) {
    zoombiesContract.buyBoosterCredits(1, {value:"1000000000000000000"}).catch((error) => {
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
    console.log(zoombiesContract);
    zoombiesContract.buyBoosterAndMintNFT().catch((error) => {
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