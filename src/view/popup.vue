<style scoped>
.app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 20px;

    width: 200px;
}

section {
    margin: 12px 0;

    display: flex;
    justify-content: space-between;
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
            <span>显示一键 Block 按钮</span>
            <input type="checkbox" v-model="config.quickBlockTweet">
        </section>
        <section>
            <span>隐藏机器人回复</span>
            <input type="checkbox" v-model="config.hiddenAIBotTweet">
        </section>
        <section>
            <span>隐藏推广信息</span>
            <input type="checkbox" v-model="config.hiddenPromotedTweet">
        </section>
        <footer style="margin-top: 20px;">
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

        return {config}
    }
})

</script>