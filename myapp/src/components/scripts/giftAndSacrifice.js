export async function GiftCard(zoombiesContract, token, account, targetAddress, DisplayError, DisplaySuccess) {
    zoombiesContract["safeTransferFrom(address,address,uint256)"](account, targetAddress, parseInt(token))
    .then((result) => { //success
        console.log("Card Gifted: ", result);
        DisplaySuccess();
    })
    .catch((error) => { //error
        if (error.code === "ACTION_REJECTED") {
            DisplayError("Transaction cancelled");
        }
        else if (error.code === -32603) { //insufficient GLMR
            DisplayError("Insufficient GLMR or Invalid Card");
        }
        else {
            DisplayError(error.message);
        }
    });
}

export async function SacrificeCard(zoombiesContract, token, tokenArr, DisplayError, DisplaySuccess) {
    zoombiesContract.sacrificeNFTs([token])
    .then((result) => { //success
        console.log("Card Sacrificed: ", result);
        tokenArr.splice(tokenArr.indexOf(token), 1); //remove sacrificed card from array
        DisplaySuccess();
    })
    .catch((error) => { //error
        if (error.code === "ACTION_REJECTED") {
            DisplayError("Transaction cancelled");
        }
        else if (error.code === -32603) { //insufficient GLMR
            DisplayError("Insufficient GLMR or Invalid Card");
        }
        else {
            DisplayError(error.message);
        }
    });
}