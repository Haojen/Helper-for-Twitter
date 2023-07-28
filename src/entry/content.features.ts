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

export class SwitchLogoToBlueBird extends TweetFilter {
  SWITCHED_LOGO_FLAG = "switch-logo-flag";
  watchNewTweet = () => {
    const titleEl = document.head.querySelector("title");
    if (titleEl && titleEl.innerText.match(/\s\/\sX$/s)) {
      titleEl.innerText = titleEl.innerText.replace(/\s\/\sX$/s, "");
    }

    const logoContainer = document.body.querySelector('a[href="/home"][aria-label="Twitter"]');
    if (logoContainer?.getAttribute(this.SWITCHED_LOGO_FLAG) === "1") return;
    logoContainer?.setAttribute(this.SWITCHED_LOGO_FLAG, "1");

    const favicon: HTMLLinkElement | null = document.querySelector('link[rel="shortcut icon"]');
    if (favicon) {
      favicon.href = "https://abs.twimg.com/favicons/twitter.2.ico";
    }

    const blueLogoSVG = document.createElementNS("http://www.w3.org/2000/svg","svg");
    blueLogoSVG.setAttribute("viewBox", "0 0 24 24");
    const blueLogoPath = document.createElementNS("http://www.w3.org/2000/svg","path");
    blueLogoPath.setAttribute(
      "d",
      "M22.2125 5.65605C21.4491 5.99375 20.6395 6.21555 19.8106 6.31411C20.6839 5.79132 21.3374 4.9689 21.6493 4.00005C20.8287 4.48761 19.9305 4.83077 18.9938 5.01461C18.2031 4.17106 17.098 3.69303 15.9418 3.69434C13.6326 3.69434 11.7597 5.56661 11.7597 7.87683C11.7597 8.20458 11.7973 8.52242 11.8676 8.82909C8.39047 8.65404 5.31007 6.99005 3.24678 4.45941C2.87529 5.09767 2.68005 5.82318 2.68104 6.56167C2.68104 8.01259 3.4196 9.29324 4.54149 10.043C3.87737 10.022 3.22788 9.84264 2.64718 9.51973C2.64654 9.5373 2.64654 9.55487 2.64654 9.57148C2.64654 11.5984 4.08819 13.2892 6.00199 13.6731C5.6428 13.7703 5.27232 13.8194 4.90022 13.8191C4.62997 13.8191 4.36771 13.7942 4.11279 13.7453C4.64531 15.4065 6.18886 16.6159 8.0196 16.6491C6.53813 17.8118 4.70869 18.4426 2.82543 18.4399C2.49212 18.4402 2.15909 18.4205 1.82812 18.3811C3.74004 19.6102 5.96552 20.2625 8.23842 20.2601C15.9316 20.2601 20.138 13.8875 20.138 8.36111C20.138 8.1803 20.1336 7.99886 20.1256 7.81997C20.9443 7.22845 21.651 6.49567 22.2125 5.65605Z"
    );
    blueLogoPath.setAttribute("fill", "rgba(29,161,242,1)");

    blueLogoSVG.appendChild(blueLogoPath);

    const xLogo = logoContainer?.querySelector("svg");
    xLogo?.parentElement?.appendChild(blueLogoSVG);
    xLogo?.remove();
  };
}

export class FoldCommentPornImage extends TweetFilter {
    INSET_BUTTON_FLAG = 'HIDDEN_RETWEET_REPLY_IMG_BUTTON'
    PORN_IMG_TWEET_FLAG = 'porn-img-tweet-falg'
    PORN_IMG_CONTAINER_FLAG = 'porn-img-container-flag'

    addButtonToggleImgVisible(tweetItem: HTMLElement) {
        const sharedTweetIcon = `M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z`

        const sharedTweetIconEl = findButtonByIconPath(this.getIcon(tweetItem), sharedTweetIcon)

        const hasButton = tweetItem.querySelector(`.${this.INSET_BUTTON_FLAG}`)

        if (!sharedTweetIconEl || hasButton) return;

        const button = this.createCustomMenuBottom(() => {
            (tweetItem.querySelectorAll(`[${this.PORN_IMG_CONTAINER_FLAG}="1"]`) as NodeListOf<HTMLElement>).forEach( containerItem => {
                containerItem.style.height === '0px' ?
                containerItem.style.height = '100%' :
                containerItem.style.height = '0'
            })
        })

        sharedTweetIconEl.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.appendChild(button)
    }

    watchNewTweet = () => {
        if (window.location.pathname === "/home") return

        const allTweets:NodeListOf<HTMLElement> = document.querySelectorAll(`article[data-testid="tweet"]`)

        allTweets.forEach( (tweetItem, idx) => {
            if (idx === 0) return;

            if (tweetItem.getAttribute(this.PORN_IMG_TWEET_FLAG) === "1") return;
            tweetItem.setAttribute(this.PORN_IMG_TWEET_FLAG, "1")

            // Keep the userId query
            // const userId = tweetItem.querySelector('div[data-testid="User-Name"] a[tabindex="-1"][role="link"] span')
            const matchChineseLanguage = tweetItem.querySelector('div[lang="zh"]')
            const matchRetweet = tweetItem.querySelector('div[role="link"][tabindex="0"]')
            const photo1 = tweetItem.querySelector('a[href$="/photo/1"]')

            if (!matchChineseLanguage && matchRetweet && photo1 && matchRetweet.contains(photo1)) {
                return;
            }

            if (!matchRetweet) return

            const photos:NodeListOf<HTMLElement> = tweetItem.querySelectorAll('a[href$="/photo/1"]')

            if (photos.length === 0) return;

            const MAIN_IMG_PARENT_REPEAT = 3
            const RETWEET_IMG_PARENT_REPEAT = 5
            if (photos.length === 1) {
                const isRetweetImg = matchRetweet.contains(photos[0])
                this.hiddenImgFromContainer(photos[0], isRetweetImg ? RETWEET_IMG_PARENT_REPEAT: MAIN_IMG_PARENT_REPEAT)
            }
            else if (photos.length === 2) {
                this.hiddenImgFromContainer(photos[0], MAIN_IMG_PARENT_REPEAT)
                this.hiddenImgFromContainer(photos[1], RETWEET_IMG_PARENT_REPEAT)
            }

            this.addButtonToggleImgVisible(tweetItem)
        })
    }
    hiddenImgFromContainer(childEl: HTMLElement, searchLevel: number) {
        const container = this.getParentElementByRepeat(childEl, searchLevel)

        if (container) {
            container.style.height = "0"
            container.setAttribute(this.PORN_IMG_CONTAINER_FLAG, "1")
        }
    }

    destroy() {
        super.destroy();

        (document.body.querySelectorAll(`.${this.INSET_BUTTON_FLAG}`) as NodeListOf<HTMLElement>).forEach( (item) => {
            item.click()
            item.remove()
        })

        document.body.querySelectorAll(`[${this.PORN_IMG_TWEET_FLAG}="1"]`).forEach(item => {
            item.setAttribute(this.PORN_IMG_TWEET_FLAG, "0")

            item.querySelectorAll(`[${this.PORN_IMG_CONTAINER_FLAG}="1"]`).forEach(item => {
                item.setAttribute(this.PORN_IMG_CONTAINER_FLAG, "0")
            })
        })
    }

    getIcon(el: HTMLElement) {
        return el.querySelectorAll('div[aria-haspopup="menu"][role="button"] svg path')
    }

    getParentElementByRepeat(el: HTMLElement, count: number) {
        let target = el
        for (let i = 0; i < count; i++) {
            target = target.parentElement!
        }
        return target
    }

    createCustomMenuBottom(callback: () => void): HTMLElement {
        const button = document.createElement('div')
        button.setAttribute('role', 'button')
        button.title = 'Show Images'
        button.className = this.INSET_BUTTON_FLAG

        button.style.height = button.style.width = '33px'
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
        img.height = img.width = 18

        button.appendChild(img)

        // Show image amount
        // const span = document.createElement('span')
        // span.innerText = imgList.length.toString()
        // button.appendChild(span)

        button.onclick = () => callback()

        return button
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
