export type IDefaultStaticConfigKeys = 'quickBlock' | 'hiddenAutoBotCommit' | 'hiddenPromotedContent'
export const defaultStaticConfig = {
    quickBlock: true,
    hiddenAutoBotCommit: false,
    hiddenPromotedContent: false
}

export function getDefaultStaticConfig() {
    return JSON.parse(JSON.stringify(defaultStaticConfig)) as typeof defaultStaticConfig
}