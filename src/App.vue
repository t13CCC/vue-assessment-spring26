<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script setup>
import Register from './components/register.vue';
import File from './components/file.vue';

// 路由组件已在 router.js 中注册，无需在此导入
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

body {
    font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}
</style>