export async function GiftCard(zoombiesContract, token, account, recipient, setUserOwnsCard, DisplayError, DisplaySuccess) {
    zoombiesContract["safeTransferFrom(address,address,uint256)"](account, recipient, token)
    .then((result) => { //success
        console.log("Card Gifted: ", result);
        setUserOwnsCard(false);
        DisplaySuccess();
    })
    .catch((error) => { //error
        if (error.code === "ACTION_REJECTED") {
            DisplayError("Transaction cancelled");
        }
        else if (error.code === -32603) { //insufficient GLMR
            DisplayError("Insufficient GLMR or invalid card");
        }
        else {
            console.log(error);
            DisplayError("Invalid address"); //this is the most likely error
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
            DisplayError("Insufficient GLMR or invalid card");
        }
        else {
            DisplayError(error.message);
        }
    });
}