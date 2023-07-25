<style scoped>
.app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin: 14px;
}

section {
    margin: 12px 0;
    text-align: left;

    display: flex;
    justify-content: space-between;
    align-items: center;

}

span {
    font-size: 12px;
    font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

a {
    color: royalblue;
    text-decoration: none;
}
</style>
<template>
    <main class="app">
        <header style="margin-bottom: 24px;">
            <h2 style="margin: 0">Twitter Helper</h2>
            <span style="color: grey;">Version: 0.1.0</span>
        </header>
        <section>
            <span v-text="i18n_showQuickBlockButton"></span>
            <input type="checkbox" v-model="config.quickBlockTweet">
        </section>
        <section>
            <span v-text="i18n_hiddenAIRobotReply"></span>
            <input type="checkbox" v-model="config.hiddenAIBotTweet">
        </section>
        <section>
            <span v-text="i18n_hiddenPromotedInfo"></span>
            <input type="checkbox" v-model="config.hiddenPromotedTweet">
        </section>
        <section>
            <span v-text="i18n_foldScamImages"></span>
            <input type="checkbox" v-model="config.autoHiddenReTweetReplyImg">
        </section>
        <footer style="margin-top: 20px; font-size: 13px">
            <a href="https://github.com/haojen">Github</a>
            <a style="margin: 0 8px;" href="https://github.com/haojen">Feedback</a>
            <a href="https://github.com/haojen">Privacy</a>
        </footer>
    </main>
</template>

<script lang="ts">
import {defineComponent, reactive, watch} from "vue";
import {getDefaultStaticConfig} from "@/shared.config";

export default defineComponent({
    name: "PopupView",
    setup() {
        const config = reactive(getDefaultStaticConfig());

        chrome.storage.sync.get(config, res => {
            Object.assign(config, res)
        })

        watch(config, (change) => {
            chrome.storage.sync.set(change)
        })

        // console.log(chrome.i18n, 'i18n')

        return {
            config,
            i18n_showQuickBlockButton: chrome.i18n.getMessage('showQuickBlockButton'),
            i18n_hiddenAIRobotReply: chrome.i18n.getMessage('hiddenAIRobotReply'),
            i18n_hiddenPromotedInfo: chrome.i18n.getMessage('hiddenPromotedInfo'),
            i18n_foldScamImages: chrome.i18n.getMessage('foldScamImages'),
        }
    }
})

</script>