export type IDefaultStaticConfigKeys = 'quickBlockTweet' | 'hiddenPromotedTweet' //'hiddenAutoBotTweet'
export const defaultStaticConfig = {
    quickBlockTweet: true,
    hiddenAutoBotTweet: false,
    hiddenPromotedTweet: false
}

export function getDefaultStaticConfig() {
    return JSON.parse(JSON.stringify(defaultStaticConfig)) as typeof defaultStaticConfig
}