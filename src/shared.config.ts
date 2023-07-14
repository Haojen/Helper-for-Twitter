export type IDefaultStaticConfigKeys = 'quickBlockTweet' | 'hiddenPromotedTweet' | 'hiddenAIBotTweet'
export const defaultStaticConfig:{[p in IDefaultStaticConfigKeys]: boolean } = {
    quickBlockTweet: true,
    hiddenAIBotTweet: false,
    hiddenPromotedTweet: false
}

export function getDefaultStaticConfig() {
    return JSON.parse(JSON.stringify(defaultStaticConfig)) as typeof defaultStaticConfig
}