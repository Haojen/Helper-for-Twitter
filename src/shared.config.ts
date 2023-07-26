export type IDefaultStaticConfigKeys = 'quickBlockTweet' | 'hiddenPromotedTweet' | 'hiddenAIBotTweet' | 'foldCommentPornImage'
export const defaultStaticConfig:{[p in IDefaultStaticConfigKeys]: boolean } = {
    quickBlockTweet: true,
    hiddenAIBotTweet: false,
    hiddenPromotedTweet: false,
    foldCommentPornImage: true
}

export function getDefaultStaticConfig() {
    return JSON.parse(JSON.stringify(defaultStaticConfig)) as typeof defaultStaticConfig
}