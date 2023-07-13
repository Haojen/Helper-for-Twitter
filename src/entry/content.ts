import {defaultStaticConfig, getDefaultStaticConfig} from "@/shared.config";
import {IFeatures, QuickBlock, ThemeControl} from "@/entry/content.features";

export class HelperKit {
    config: typeof defaultStaticConfig
    features: { [k in 'quickBlock' | 'themeControl']: IFeatures }
    constructor() {
        this.config = getDefaultStaticConfig()
        this.features = {
            quickBlock: new QuickBlock(this.config),
            themeControl: new ThemeControl(this.config)
        }
    }

    updateConfig(storageChange: { [p: string]: chrome.storage.StorageChange }) {
        const updateObject: { [p: string]: chrome.storage.StorageChange } = {}

        for (const key of Object.keys(storageChange)) {
            updateObject[key] = storageChange[key].newValue
        }

        const whichUpdated = updateObject as (typeof defaultStaticConfig)

        Object.assign(this.config, whichUpdated)

        if (whichUpdated.themeMode) {
            this.features.themeControl.updated()
            return
        }

        if (whichUpdated.quickBlock) {
            this.features.quickBlock.updated()
            return;
        }
    }
    init(config: typeof defaultStaticConfig) {
        Object.assign(this.config, config)

        this.features.quickBlock.init()
        this.features.themeControl.init()
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
