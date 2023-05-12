export function SubscribeZoomTransfer(zoomContract) {
    zoomContract.on("Transfer", (from, to, amount) => {
        console.log("Transfer event: ", from, to, amount);
    });
}

export function SubscribeZoombiesTransfer(zoombiesContract) {
    zoombiesContract.on("Transfer", (from, to, tokenId) => {
        console.log("Transfer event: ", from, to, tokenId);
    });
}

export function SubscribeZoombiesCardMinted(zoombiesContract, tokenIdArr) {
    zoombiesContract.on("LogCardMinted", (owner, tokenId, cardTypeId, editionNumber) => {
        console.log("CardMinted event: ", owner, tokenId, cardTypeId, editionNumber);
        tokenIdArr.shift(parseInt(tokenId));
    });
}

export function SubscribeDailyReward(zoombiesContract) {
    zoombiesContract.on("LogDailyReward", (owner, creditsRemaining) => {
        console.log("DailyReward event: ", owner, creditsRemaining);
    })
}

export function SubscribePackOpened(zoombiesContract) {
    zoombiesContract.on("LogPackOpened", (owner, rarity) => {
        console.log("PackOpened event: ", owner, rarity);
    })
}