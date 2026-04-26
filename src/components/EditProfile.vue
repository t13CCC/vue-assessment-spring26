<script setup>

</script>

<template>
  <div class="edit-box">
    <div class="tit">
      <h3>编辑个人信息</h3>
    </div>
    
    <div class="edit-card">

      <div class="form-item">
      <img src="" alt="">
      <input type="file" value="">
    </div>

      <div class="form-item">
      <label>昵称:</label>
      <input type="text" value="">
    </div>

    <div class="form-item">
      <label>手机号:</label>
      <input type="text" value="">
    </div>

    <div class="form-item">
      <label>邮箱:</label>
      <input type="text" value="">
    </div>

    <div class="sex">
      <label>性别</label>
      <div class="gender">
        <div class="gender-item">
          <input type="radio" name="gender" id="man">
          <label for="man"><svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M41.9517 15.0483V6.04834H32.9517" stroke="#8cafff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.4135 38.0007C15.8808 43.4681 24.7451 43.4681 30.2125 38.0007C32.9462 35.2671 34.313 31.6841 34.313 28.1012C34.313 24.5183 32.9462 20.9354 30.2125 18.2017C24.7451 12.7344 15.8808 12.7344 10.4135 18.2017C4.94615 23.6691 4.94615 32.5334 10.4135 38.0007Z" fill="none" stroke="#8cafff" stroke-width="4" stroke-linejoin="round"/><path d="M30.0002 17.9999L39.9517 8.04838" stroke="#8cafff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>男</label>
        </div>
        <div class="gender-item">
          <input type="radio" name="gender" id="woman">
          <label for="woman"><svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#icon-77eca05bbccbbd09)"><path d="M38.3785 9.85132C32.9112 4.38398 24.0468 4.38398 18.5795 9.85132C15.8458 12.585 14.479 16.1679 14.479 19.7508C14.479 23.3337 15.8458 26.9166 18.5795 29.6503C24.0468 35.1176 32.9112 35.1176 38.3785 29.6503C43.8458 24.183 43.8458 15.3187 38.3785 9.85132Z" fill="none" stroke="#ff8cec" stroke-width="4" stroke-linejoin="round"/><path d="M18.4642 29.5353L5.73633 42.2632" stroke="#ff8cec" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.1714 41.5562L6.44346 28.8282" stroke="#ff8cec" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="icon-77eca05bbccbbd09"><rect width="48" height="48" fill="#ff8cec"/></clipPath></defs></svg>女</label>
        </div>
      </div>
    </div>

    <div class="form-item">
      <label>个人简介</label>
      <textarea></textarea>
    </div>

    <button class="btn">保存修改</button>
  </div>


    </div>

</template>

<style scoped>
.edit-box {
    margin: 10px;
    width: 520px;
    height: 560px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 10px 1px #b6ceec;
    transition: 0.3s;
}
.edit-card {
  padding: 15px;
}
.tit{
    height: 55px;
    background: linear-gradient(to right, #65A3F0,#FDCBE6);
    display: flex;
    align-items: center;
    justify-content: center;

}
h3 {
  text-align: center;
  font-weight: 600;
  color: #ffffff;
}

.form-item{
  margin: 15px;
  width: 450px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
input[type="file"]{
  width: 80px;
  height: 80px;
  border-radius: 50%;     /* 圆形头像 */
  object-fit: cover;       /* 不变形 */
  border: 2px solid #e5e7eb;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: 0.2s;
}
.sex{
  margin: 16px;
  display: flex;
  align-items: center;
}

label {
  display: block;
  color: #555;
  font-size: 18px;
}

input,
textarea {
  width: 350px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  outline: none;
  border-radius: 8px;
  font-size: 16px;
}

textarea {
  resize: none;
  height: 55px;
}

.btn {
  margin-left:350px;
  padding: 5px 10px;
  background: #ffd7ee;
  border: 2px solid #ffc2f2;
  border-radius: 8px;
  color: rgb(255, 255, 255);
  font-size: 16px;
  cursor: pointer;
}

.gender {
  display: flex;
  gap: 20px;
  margin-left: 45px;
}

.gender-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
/* 1. 先隐藏原生 radio */
input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  width: 18px;
  height: 18px;
  border: 1px solid #ccc;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  background: #fff;
}

/* 2. 选中时的外框 + 内圆点 */
input[type="radio"]:checked {
  border-color: #8ec5fc;
}
input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: #8ec5fc;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>