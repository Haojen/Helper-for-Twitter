import {defaultStaticConfig, getDefaultStaticConfig, IDefaultStaticConfigKeys} from "@/shared.config";
import {HiddenPromotedTweet, IFeatures, QuickBlockTweet} from "@/entry/content.features";

export class HelperKit {
    config: typeof defaultStaticConfig
    features: { [k in IDefaultStaticConfigKeys ]: IFeatures }
    constructor() {
        this.config = getDefaultStaticConfig()
        this.features = {
            quickBlockTweet: new QuickBlockTweet(this.config),
            hiddenPromotedTweet: new HiddenPromotedTweet(this.config)
        }
    }

    updateConfig(storageChange: { [p in IDefaultStaticConfigKeys]: chrome.storage.StorageChange }) {
        const keys= Object.keys(storageChange) as IDefaultStaticConfigKeys[]

        keys.forEach( changeItem => {
            this.config[changeItem] = storageChange[changeItem].newValue
            this.features[changeItem].updated()
        })

    }
    init(config: typeof defaultStaticConfig) {
        Object.assign(this.config, config)

        this.config.quickBlockTweet && this.features.quickBlockTweet.init()
        this.config.hiddenPromotedTweet && this.features.hiddenPromotedTweet.init()
    }
}

const helperKit = new HelperKit()
chrome.storage.sync.get(getDefaultStaticConfig(), (storageData) => {
    helperKit.init(storageData as typeof defaultStaticConfig)
})

chrome.storage.onChanged.addListener((changes) => {
    helperKit.updateConfig(changes as { [p in IDefaultStaticConfigKeys]: chrome.storage.StorageChange } )
})
