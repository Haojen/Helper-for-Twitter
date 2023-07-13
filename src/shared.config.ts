export enum ThemeType {
    FollowSystem = 'FollowSystem',
    White = '0',
    Dim = '1',
    LightsOut = '2'
}

export type IDefaultStaticConfigKeys = 'themeMode' | 'darkMode' | 'quickBlock' | 'hiddenAutoBotCommit' | 'hiddenPromotedContent'
export const defaultStaticConfig = {
    themeMode: ThemeType.FollowSystem,
    darkMode: ThemeType.Dim,
    quickBlock: true,
    hiddenAutoBotCommit: false,
    hiddenPromotedContent: false
}

export function getDefaultStaticConfig() {
    return JSON.parse(JSON.stringify(defaultStaticConfig)) as typeof defaultStaticConfig
}