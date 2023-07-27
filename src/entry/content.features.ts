export interface IFeatures {
    init: () => void
    updated: (enabled: boolean) => void
    destroy: () => void
}

function findButtonByIconPath(elements: NodeList, iconPathData: string): HTMLElement | null {
    for (let i = 0; i < elements.length; i++) {
        const targetItem = elements[i] as HTMLElement;

        if (targetItem.getAttribute("d") === iconPathData) {
            let targetParentNode = targetItem.parentNode!;

            while (targetParentNode.nodeName !== "svg") {
                targetParentNode = targetParentNode.parentNode!;
            }
            return targetParentNode as HTMLElement;
        }
    }

    return null;
}

class TweetFilter implements IFeatures {
    get queryRoot() {
        return document.body.querySelector('#react-root')
    }

    watchNewTweet?: () => void
    mutationObserverNewTweet = new MutationObserver( () => this.watchNewTweet?.())

    init() {
        const tweetContent = this.queryRoot
        tweetContent && this.mutationObserverNewTweet.observe(tweetContent, {
            subtree: true,
            childList: true
        })
    }

    updated(enabled: boolean) {
        if (enabled) {
            this.init()
            this.watchNewTweet?.()
        }
        else {
            this.destroy()
        }
    }

    destroy() {
        this.mutationObserverNewTweet.disconnect()
    }
}

export class FoldCommentPornImage extends TweetFilter {
    INSET_BUTTON_FLAG = 'HIDDEN_RETWEET_REPLY_IMG_BUTTON'
    getIcon(el: HTMLElement) {
        return el.querySelectorAll('div[aria-haspopup="menu"][role="button"] svg path')
    }
    addButtonToggleImgVisible(el: HTMLElement, allImgLink: NodeListOf<HTMLElement>) {
        const sharedTweetIcon = `M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z`

        const sharedTweetIconEl = findButtonByIconPath(this.getIcon(el), sharedTweetIcon)

        const button = el.querySelector(`.${this.INSET_BUTTON_FLAG}`)

        if (!sharedTweetIconEl || button) return;

        sharedTweetIconEl.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.appendChild(this.createCustomMenuBottom(allImgLink))
    }
    createCustomMenuBottom(imgList: NodeListOf<HTMLElement>): HTMLElement {
        const button = document.createElement('div')
        button.setAttribute('role', 'button')
        button.title = 'Show Images'
        button.className = this.INSET_BUTTON_FLAG

        button.style.width = '33px'
        button.style.height = '33px'
        button.style.margin = '-8px 0'
        button.style.borderRadius = '50%'
        button.style.display = 'inline-grid'
        button.style.alignSelf = 'center'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        button.style.cursor = 'pointer'
        button.onmouseover = () => {
            button.style.background = 'rgba(255, 0, 0, 0.15)'
        }
        button.onmouseleave = () => {
            button.style.background = ""
        }

        const img = document.createElement('img')
        img.src = chrome.runtime.getURL("images/eyes.svg")
        img.width = 18
        img.height = 18

        button.appendChild(img)

        // Show image amount
        // const span = document.createElement('span')
        // span.innerText = imgList.length.toString()
        // button.appendChild(span)

        button.onclick = () => {
            imgList.forEach( linkItem => {
                linkItem.style.height === '0px' || !linkItem.style.height ? linkItem.style.height = '100%' : linkItem.style.height = '0'
            })
        }
        return button
    }

    watchNewTweet = () => {
        if (window.location.pathname === "/home") return

        const allTweets:NodeListOf<HTMLElement> = document.querySelectorAll(`article[data-testid="tweet"]`)

        allTweets.forEach( (tweetItem, idx) => {
            if (idx === 0) return;
            
            // Keep the userId query
            // const userId = tweetItem.querySelector('div[data-testid="User-Name"] a[tabindex="-1"][role="link"] span')
            const matchLanguage = tweetItem.querySelectorAll('div[lang="zh"]')
            if (matchLanguage.length === 0) return

            const matchRetweet = tweetItem.querySelector('div[role="link"][tabindex="0"]')
            if (!matchRetweet) return

            const PORN_IMG_FLAG = "PORN_IMG_FLAG"
            const photoContainer:NodeListOf<HTMLElement>= tweetItem.querySelectorAll(`a[href*="/photo/"]:not(.${PORN_IMG_FLAG})`)

            if (photoContainer.length == 0) return;

            photoContainer.forEach(linkItem => {
                linkItem.classList.add(PORN_IMG_FLAG)
                linkItem.style.height = "0"
            })
            this.addButtonToggleImgVisible(tweetItem, photoContainer)
        })
    }

    destroy() {
        super.destroy();

        (document.body.querySelectorAll(`.${this.INSET_BUTTON_FLAG}`) as NodeListOf<HTMLElement>).forEach( (item) => {
            item.click()
            item.remove()
        })
    }
}

export class QuickBlockTweet extends TweetFilter {
    INSERT_BLOCK_BUTTON_FLAG = 'TW_HELPER_INSERT_BLOCK_BUTTON_FLAG'
    getIcon(el: HTMLElement) {
        return el.querySelectorAll('div[aria-haspopup="menu"][role="button"] svg path')
    }
    createCustomMenuBottom(tweetItem: HTMLElement): HTMLElement {
        const button = document.createElement('div')
        button.setAttribute('role', 'button')
        button.className = this.INSERT_BLOCK_BUTTON_FLAG
        button.title = 'Block'

        button.style.width = '33px'
        button.style.height = '33px'
        button.style.margin = '-8px 0'
        button.style.borderRadius = '50%'
        button.style.display = 'inline-grid'
        button.style.alignSelf = 'center'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        button.style.cursor = 'pointer'
        button.onmouseover = () => {
            button.style.background = 'rgba(255, 0, 0, 0.15)'
        }
        button.onmouseleave = () => {
            button.style.background = ""
        }

        const img = document.createElement('img')
        img.src = chrome.runtime.getURL("images/block.svg")
        img.width = 18
        img.height = 18

        button.appendChild(img)

        button.onclick = () => {
            const moreIconButtonPathData = `M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z`
            const moreButton = findButtonByIconPath(this.getIcon(tweetItem), moreIconButtonPathData)

            moreButton?.parentElement?.parentElement?.click()

            const blockButton: HTMLElement | null = document.body.querySelector('#layers div[role="menuitem"][data-testid="block"]')
            blockButton?.click()

            const doBlockButton: HTMLElement | null = document.body.querySelector('#layers div[role="button"][data-testid="confirmationSheetConfirm"]')
            doBlockButton?.click()
        }
        return button
    }
    appendCustomFooterMenuItem(tweetItem: HTMLElement) {
        const sharedTweetIcon = `M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z`

        const sharedTweetIconEl = findButtonByIconPath(this.getIcon(tweetItem), sharedTweetIcon)

        const button = tweetItem.querySelector(`.${this.INSERT_BLOCK_BUTTON_FLAG}`)

        if (!sharedTweetIconEl || button) return;

        sharedTweetIconEl.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.appendChild(this.createCustomMenuBottom(tweetItem))
    }
    watchNewTweet = ()=> {
        const allTweets = document.querySelectorAll(`article[data-testid="tweet"]`)

        if (!allTweets || allTweets.length === 0) {
            return []
        }

        (Array.from(allTweets) as HTMLElement[]).forEach(tweetItem => {
            this.appendCustomFooterMenuItem(tweetItem)
        })


        return allTweets
    }
    destroy() {
        super.destroy();
        document.body.querySelectorAll(`.${this.INSERT_BLOCK_BUTTON_FLAG}`).forEach(buttonItem => buttonItem.remove())
    }
}

export class HiddenPromotedTweet extends TweetFilter {
    watchNewTweet = () => {
        const iconPath = "M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z"
        const allTweets:NodeListOf<HTMLElement> = document.querySelectorAll(`article[data-testid="tweet"]`)
        allTweets.forEach( tweetItem => {
            const isPromotedTweet1 = findButtonByIconPath(tweetItem.querySelectorAll('svg path'), iconPath)
            if (isPromotedTweet1) {
                tweetItem.style.width = "0"
                tweetItem.style.height = "0"
            }

           /* Hidden promoted when click content
            const isPromotedTweet2 = tweetItem.querySelector('div[data-testid="promotedIndicator"]') as HTMLElement
            if (isPromotedTweet2) {
                tweetItem.remove()
            }*/
        })
    }
}

export class HiddenAIBotTweet extends TweetFilter {
    watchNewTweet = () => {
        const iconPath = 'M.998 15V9h2v6h-2zm22 0V9h-2v6h2zM12 2c-4.418 0-8 3.58-8 8v7c0 2.76 2.239 5 5 5h6c2.761 0 5-2.24 5-5v-7c0-4.42-3.582-8-8-8zM8.998 14c-1.105 0-2-.9-2-2s.895-2 2-2 2 .9 2 2-.895 2-2 2zm6 0c-1.104 0-2-.9-2-2s.895-2 2-2 2 .9 2 2-.896 2-2 2z'
        const allTweets:NodeListOf<HTMLElement> = document.querySelectorAll(`article[data-testid="tweet"]`)
        allTweets.forEach( tweetItem => {
            const isAIBotTweet = findButtonByIconPath(tweetItem.querySelectorAll('svg path'), iconPath)
            isAIBotTweet && tweetItem.remove()
        })
    }
}
