<script setup>

</script>

<template>
<div class="edit-box">
    <h3>编辑信息</h3>

    <div class="item">
      <label>昵称</label>
      <input v-model="info.name" type="text" />
    </div>

    <div class="item">
      <label>简介</label>
      <textarea v-model="info.desc"></textarea>
    </div>

    <button class="save-btn" @click="save">保存</button>
  </div>
</template>

<style  scoped>
.edit-box {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}
.item {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.save-btn {
  background: #409eff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  margin-top: 10px;
}
</style>