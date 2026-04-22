<script setup>

</script>

<template>
    <div id="nav">
        <h1>萌宠小镇</h1>
    </div>
    <div class="page">
        <div class="frame">
            <div>
                <h2>用户注册</h2>
            </div>
            <div>
                <input type="text" placeholder="请输入手机号/邮箱">
            </div>
            <div>
                <input type="text" placeholder="请输入验证码">
                <button id="ver">获取验证码</button>
            </div>
            <div>
                <input type="text" placeholder="设置密码">
            </div>
            <div>
                <button id="reg">注册</button>
                
            </div>
        </div>

    </div>
</template>

<style scoped>
h1{
    margin-left: 10px;
    font-size: 30px;
    color: white;
}
#nav {
    display: flex;
    position: fixed;
    background: #69b1ff;
    width: 100%;
    top: 0;
    left: 0;
    box-shadow: 0 1px 15px #efefef;
    margin: 0px;
    height: 53px;
    align-items: center;
    z-index: 10;
}

.page {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    
}
.frame{
    display: flex;
    width: 550px;
    height: 360px;
    flex-direction: column;
    border-radius: 25px;
    border: 3px solid #a7c2ff;
    box-shadow: 0 10px 15px #69b1ff;
    padding: auto;
    justify-content: center;
    align-items: center;

}
.frame div{
    margin: 10px;
}
input {
    font-size: 22px;
    border: 0.5px solid #aaa;
    border-radius: 5px;
    color: #000000;
    padding: 6px 13px;
}
input:focus{
    outline: 0.3px solid #1677ff;
    border: 0.2px solid #1677ff;
}
#ver {
    color: #0154e3;
    background-color: #ffffff00;
    border: none;
    cursor: pointer;
    font-size: 20px;
    margin-left: -120px;
}
#reg{
    color: #ffffff;
    background-color: #2f5df5;
    border: none;
    cursor: pointer;
    border-radius: 20px;
    font-size: 20px;
    padding: 3px 42px;
}
</style>