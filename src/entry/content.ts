import {defaultStaticConfig, getDefaultStaticConfig, IDefaultStaticConfigKeys} from "@/shared.config";
import {
    FoldCommentPornImage,
    HiddenAIBotTweet,
    HiddenPromotedTweet,
    IFeatures,
    QuickBlockTweet, SwitchLogoToBlueBird
} from "@/entry/content.features";

export class HelperKit {
    config: typeof defaultStaticConfig
    features: { [k in IDefaultStaticConfigKeys ]: IFeatures }
    constructor() {
        this.config = getDefaultStaticConfig()
        this.features = {
            quickBlockTweet: new QuickBlockTweet(),
            hiddenAIBotTweet: new HiddenAIBotTweet(),
            hiddenPromotedTweet: new HiddenPromotedTweet(),
            foldCommentPornImage: new FoldCommentPornImage(),
            switchLogoToBlueBird: new SwitchLogoToBlueBird(),
        }
    }

    updateConfig(storageChange: { [p in IDefaultStaticConfigKeys]: chrome.storage.StorageChange }) {
        const keys= Object.keys(storageChange) as IDefaultStaticConfigKeys[]

        keys.forEach( changeItem => {
            this.config[changeItem] = storageChange[changeItem].newValue
            this.features[changeItem].updated(this.config[changeItem])
        })

    }
    init(config: {[p in IDefaultStaticConfigKeys]: boolean}) {
        Object.assign(this.config, config);

        (Object.keys(this.config) as IDefaultStaticConfigKeys[]).forEach(featureKey => {
            this.config[featureKey] && this.features[featureKey].init()
        })
    }
}

const helperKit = new HelperKit()
chrome.storage.sync.get(getDefaultStaticConfig(), (storageData) => {
    helperKit.init(storageData as typeof defaultStaticConfig)
})

chrome.storage.onChanged.addListener((changes) => {
    helperKit.updateConfig(changes as { [p in IDefaultStaticConfigKeys]: chrome.storage.StorageChange } )
})