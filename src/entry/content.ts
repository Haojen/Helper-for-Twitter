import {defaultStaticConfig, getDefaultStaticConfig} from "@/shared.config";
import {IFeatures, QuickBlock} from "@/entry/content.features";

export class HelperKit {
    config: typeof defaultStaticConfig
    features: { [k in 'quickBlock']: IFeatures }
    constructor() {
        this.config = getDefaultStaticConfig()
        this.features = {
            quickBlock: new QuickBlock(this.config),
        }
    }

    updateConfig(storageChange: { [p: string]: chrome.storage.StorageChange }) {

        for (const [k,v] of Object.entries(storageChange)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.config[k] = v.newValue
        }

        if (storageChange.quickBlock) {
            this.features.quickBlock.updated()
            return;
        }
    }
    init(config: typeof defaultStaticConfig) {
        Object.assign(this.config, config)

        this.config.quickBlock && this.features.quickBlock.init()
    }
}

const helperKit = new HelperKit()
chrome.storage.sync.get(getDefaultStaticConfig(), (storageData) => {
    helperKit.init(storageData as typeof defaultStaticConfig)
})

chrome.storage.onChanged.addListener((changes) => {
    console.log(changes)
    helperKit.updateConfig(changes)
})
