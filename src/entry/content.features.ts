import {defaultStaticConfig} from "@/shared.config";
export interface IFeatures {
    config: typeof defaultStaticConfig
    init: () => void
    updated: () => void
    destroy: () => void
}

export class QuickBlock implements IFeatures {
    config: typeof defaultStaticConfig
    INSERT_STATUS_FLAG = 'TW_HELPER_INSERT_STATUS_FLAG'
    INSERT_BLOCK_BUTTON_FLAG = 'TW_HELPER_INSERT_BLOCK_BUTTON_FLAG'
    observeNewTweet = new MutationObserver( () => this.injectMenu())

    constructor(props: typeof defaultStaticConfig) {
        this.config = props
    }

    createCustomMenuBottom(tweetItem: HTMLElement): HTMLElement {
        const button = document.createElement('button')
        button.className = this.INSERT_BLOCK_BUTTON_FLAG
        button.innerText = "Block"

        button.onclick = () => {
            const moreIconButtonPathData = `M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z`
            const moreButton = this.findButtonByIconPath(tweetItem, moreIconButtonPathData)

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

        const sharedTweetIconEl = this.findButtonByIconPath(tweetItem, sharedTweetIcon)

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
    findButtonByIconPath(el: HTMLElement, iconPathData: string): HTMLElement | null {
        const targetList = el.querySelectorAll(
            'div[aria-haspopup="menu"][role="button"] svg path'
        );

        for (let i = 0; i < targetList.length; i++) {
            const targetItem = targetList[i];

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
    init() {
        const tweetContent = document.body.querySelector('#react-root')
        tweetContent && this.observeNewTweet.observe(tweetContent, {
            subtree: true,
            childList: true
        })
    }
    updated() {
        if (this.config.quickBlock) {
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