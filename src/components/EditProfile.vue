<script setup>

</script>

<template>
    <div class="edit-card">
    <div class="tit"><h3>编辑个人信息</h3></div>

    <div class="form-item">
      <label>昵称</label>
      <input type="text" value="">
    </div>

    <div class="form-item">
      <label>个人简介</label>
      <textarea></textarea>
    </div>

    <div class="form-item">
      <label>手机号</label>
      <input type="text" value="13800138000">
    </div>
    <div class="form-item">
      <label>邮箱</label>
      <input type="text" value="13800138000">
    </div>

    <button class="btn">保存修改</button>
  </div>
</template>

<style  scoped>
 .edit-card {
      max-width: 400px;
      margin: 0 auto;
      background: #fff;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    h3 {
      text-align: center;
      margin-bottom: 25px;
      color: #333;
    }
    .form-item {
        display: flex;
      margin-bottom: 18px;
    }
    label {
      display: block;
      margin-bottom: 6px;
      color: #555;
      font-size: 14px;
    }
    input, textarea {
      width: 70%;
      padding: 10px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
    }
    textarea {
      resize: none;
      height: 80px;
    }
    .btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #8ec5fc, #e0c3fc);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 15px;
      cursor: pointer;
    }
    </style>