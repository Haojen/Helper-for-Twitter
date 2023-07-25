export type IDefaultStaticConfigKeys = 'quickBlockTweet' | 'hiddenPromotedTweet' | 'hiddenAIBotTweet' | 'autoHiddenReTweetReplyImg'
export const defaultStaticConfig:{[p in IDefaultStaticConfigKeys]: boolean } = {
    quickBlockTweet: true,
    hiddenAIBotTweet: false,
    hiddenPromotedTweet: false,
    autoHiddenReTweetReplyImg: true
}

export function getDefaultStaticConfig() {
    return JSON.parse(JSON.stringify(defaultStaticConfig)) as typeof defaultStaticConfig
}