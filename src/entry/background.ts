import {Message} from "@/shared.const";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('background message recive', message)
    if (message.type === Message.themeControl) {
        updateTweetTheme(message.value)
    }
})

function updateTweetTheme(value: string) {
    chrome.cookies.get({
        name: 'night_mode',
        url: 'https://twitter.com',
    }, res => {
        console.log(res, 'cookie')

        if (!res) return

        chrome.cookies.set({
            domain: res.domain,
            expirationDate: res.expirationDate,
            httpOnly: res.httpOnly,
            name: res.name,
            path: res.path,
            sameSite: res.sameSite,
            secure: res.secure,
            storeId: res.storeId,
            url: 'https://twitter.com',
            value: value
        })
    })
}