import {defaultStaticConfig} from "@/shared.config";
export interface IFeatures {
    config: typeof defaultStaticConfig
    init: () => void
    updated: () => void
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

export class QuickBlockTweet implements IFeatures {
    config: typeof defaultStaticConfig
    INSERT_BLOCK_BUTTON_FLAG = 'TW_HELPER_INSERT_BLOCK_BUTTON_FLAG'
    observeNewTweet = new MutationObserver( () => this.injectMenu())
    constructor(props: typeof defaultStaticConfig) {
        this.config = props
    }

    getIcon(el: HTMLElement) {
        return el.querySelectorAll('div[aria-haspopup="menu"][role="button"] svg path')
    }
    createCustomMenuBottom(tweetItem: HTMLElement): HTMLElement {
        const button = document.createElement('button')
        button.className = this.INSERT_BLOCK_BUTTON_FLAG
        button.innerText = "Block"

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
    injectMenu() {
        const allTweets = document.querySelectorAll(`article[data-testid="tweet"]`)

        if (!allTweets || allTweets.length === 0) {
            return []
        }

        (Array.from(allTweets) as HTMLElement[]).forEach(tweetItem => {
            this.appendCustomFooterMenuItem(tweetItem)
        })


        return allTweets
    }

    init() {
        const tweetContent = document.body.querySelector('#react-root')
        tweetContent && this.observeNewTweet.observe(tweetContent, {
            subtree: true,
            childList: true
        })
    }
    updated() {
        if (this.config.quickBlockTweet) {
            this.init()
            this.injectMenu()
        }
        else {
            this.destroy()
        }
    }
    destroy() {
        this.observeNewTweet.disconnect()

        document.body.querySelectorAll(`.${this.INSERT_BLOCK_BUTTON_FLAG}`).forEach(buttonItem => buttonItem.remove())
    }
}

export class HiddenPromotedTweet implements IFeatures {
    config
    observeNewTweet = new MutationObserver( () => this.removePromotedTweet())
    constructor(props: typeof defaultStaticConfig) {
        this.config = props
    }

    removePromotedTweet() {
        const iconPath = "M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z"
        const allTweets:NodeListOf<HTMLElement> = document.querySelectorAll(`article[data-testid="tweet"]`)
        allTweets.forEach( tweetItem => {
            const isPromotedTweet1 = findButtonByIconPath(tweetItem.querySelectorAll('svg path'), iconPath)
            if (isPromotedTweet1) {
                tweetItem.style.width = "0"
                tweetItem.style.height = "0"
            }

            /*
            Hidden promoted when click content
            const isPromotedTweet2 = tweetItem.querySelector('div[data-testid="promotedIndicator"]') as HTMLElement
            if (isPromotedTweet2) {
                tweetItem.remove()
            }*/
        })
    }

    init() {
        const tweetContent = document.body.querySelector('#react-root')
        tweetContent && this.observeNewTweet.observe(tweetContent, {
            subtree: true,
            childList: true
        })
    }

    updated() {
        if (this.config.hiddenPromotedTweet) {
            this.init()
            this.removePromotedTweet()
        }
        else {
            this.destroy()
        }
    }

    destroy() {
        this.observeNewTweet.disconnect()
    }
}