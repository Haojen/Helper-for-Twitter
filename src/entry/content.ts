// Change the project to Twitter helper
function tweetThemeAutoSwitch() {
    const messageBody = {
        type: 'message.cookie.nightmode',
        value: 1
    }
    chrome.runtime.sendMessage(messageBody, response => {
        console.log(response)
    })
}
function injectMenu() {
    const allTweets = document.querySelectorAll(`article[data-testid="tweet"]`)
    
    if (!allTweets || allTweets.length === 0) {
        return []
    }
    
    (Array.from(allTweets) as HTMLElement[]).forEach(tweetItem => {
        appendCustomFooterMenuItem(tweetItem)
    })
    
    function appendCustomFooterMenuItem(tweetItem: HTMLElement) {
        const sharedTweetIcon = `M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z`
        
        const INSERT_STATUS_FLAG = 'twGreenInsertStatusFlag'
        const sharedTweetIconEl = findButtonByIconPath(tweetItem, sharedTweetIcon)
        
        if (!sharedTweetIconEl || sharedTweetIconEl.dataset[INSERT_STATUS_FLAG] === "yes") return;

        sharedTweetIconEl.dataset[INSERT_STATUS_FLAG] = "yes"
        
        sharedTweetIconEl.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.appendChild(createCustomMenuBottom(tweetItem))
    }
    
    function createCustomMenuBottom(tweetItem: HTMLElement): HTMLElement {
        const button = document.createElement('button')
        button.innerText = "Block"
        
        button.onclick = function () {
            tweetThemeAutoSwitch()
            return
            
            
            const moreIconButtonPathData = `M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z`
            const moreButton = findButtonByIconPath(tweetItem, moreIconButtonPathData)
            
            moreButton?.parentElement?.parentElement?.click()
            
            const blockButton: HTMLElement|null = document.body.querySelector('#layers div[role="menuitem"][data-testid="block"]')
            blockButton?.click()

            const doBlockButton: HTMLElement|null = document.body.querySelector('#layers div[role="button"][data-testid="confirmationSheetConfirm"]')
            doBlockButton?.click()
        }
        return button
    }
    
    return allTweets
}

const observeNewTweet = new MutationObserver(() => injectMenu())
const tweetContent = document.body.querySelector('#react-root')
tweetContent && observeNewTweet.observe(tweetContent, {
    childList: true,
    subtree: true
})

function findButtonByIconPath(el: HTMLElement,iconPathData: string): HTMLElement | null {
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