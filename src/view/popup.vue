<template>
    <main class="app">
        <header style="margin-bottom: 24px;">
            <h2 style="margin: 0">Twitter Helper</h2>
            <span style="color: grey;">Version: 0.1.0</span>
        </header>
        <section>
            <span>主题颜色</span>
            <select v-model="config.themeMode">
                <option value="followSystem">Follow System</option>
                <option value="0">White</option>
                <option value="1">Blue</option>
                <option value="2">Dark</option>
            </select>
        </section>
        <Transition name="fade">
            <section v-if="config.themeMode === 'followSystem'">
                <span>暗色主题</span>
                <select v-model="config.darkMode">
                    <option value="1">Deep Blue</option>
                    <option value="2">Black</option>
                </select>
            </section>
        </Transition>
        <section>
            <span>显示一键 Block 按钮</span>
            <input type="checkbox" value="x">
        </section>
        <section>
            <span>隐藏机器人回复</span>
            <input type="checkbox" value="ss">
        </section>
        <section>
            <span>隐藏推广信息</span>
            <input type="checkbox" value="x">
        </section>
        <footer style="margin-top: 20px;">
            <a href="https://github.com/haojen">Github</a>
            <a style="margin: 0 8px;" href="https://github.com/haojen">Feedback</a>
            <a href="https://github.com/haojen">Privacy</a>
        </footer>
    </main>
</template>

<script lang="ts" setup>
import {reactive, watch} from "vue";

const config = reactive({
    themeMode: 'followSystem',
    darkMode: '1'
})

chrome.storage.sync.clear()

chrome.storage.sync.get(config, res => {
    Object.assign(config, res)
})

watch(config, (change) => {
    chrome.storage.sync.set(change)
})

</script>

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