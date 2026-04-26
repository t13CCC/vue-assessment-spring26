<script setup>

</script>

<template>
    <div id="nav">
        <h1>萌宠小镇</h1>
    </div>
    <div class="page">
<div class="ff">
            <div class="title">
            <h2>立即注册</h2>
        </div>
        <div class="frame">
            <div class="input">
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 30H40V42C40 43.1046 39.1046 44 38 44H10C8.89543 44 8 43.1046 8 42V30Z" fill="none"
                        stroke="#000000" stroke-width="3" stroke-linejoin="round" />
                    <path d="M40 30V6C40 4.89543 39.1046 4 38 4H10C8.89543 4 8 4.89543 8 6V30" stroke="#000000"
                        stroke-width="3" stroke-linejoin="round" />
                    <path d="M22 37H26" stroke="#000000" stroke-width="3" stroke-linecap="round" />
                </svg>
                <input type="text" placeholder="请输入手机号/邮箱">
            </div>
            <div class="input">
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
                        fill="none" stroke="#000000" stroke-width="3" stroke-linejoin="round" />
                    <path d="M16 24L22 30L34 18" stroke="#000000" stroke-width="3" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
                <input type="text" placeholder="请输入验证码">
                <button id="ver">获取验证码</button>
            </div>
            <div class="input">
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="22" width="36" height="22" rx="2" fill="none" stroke="#000000" stroke-width="3"
                        stroke-linejoin="round" />
                    <path d="M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22" stroke="#000000"
                        stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M24 30V36" stroke="#000000" stroke-width="3" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
                <input type="text" placeholder="设置密码">
            </div>
            <div class="but">
                <button id="reg">注册账号</button>
                
            </div>
            <div>
                <button id="si">已有帐号？登录</button>

            </div>
        </div>

</div>
    </div>
</template>

<style scoped>
h1 {
    margin-left: 15px;
    font-size: 30px;
    color: white;
}

#nav {
    display: flex;
    position: fixed;
    background: linear-gradient(135deg, #7daaff,#ffa6c1);
    width: 100%;
    top: 0;
    left: 0;
    box-shadow: 0 1px 15px #efefef;
    margin: 0px;
    height: 58px;
    align-items: center;
    z-index: 10;
}

.page {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    /* 背景图 */
    background:url("../assets/picture/background.jpg");
    background-color: #ffffff9f;
    background-blend-mode: overlay;
    background-size: cover;
    /* 让图片铺满整个屏幕，不变形 */
    background-position: center;
    /* 图片居中显示，保证主体不被裁掉 */
    background-repeat: no-repeat;
    /* 禁止图片重复平铺 */


}
.ff{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column; 
    width:530px ;
    height: 500px;
    border-radius: 25px;
    border: 3px solid #d0dcfa;
    background:#f9fcff93;
    transition: all 0.1s;
    &:hover{
        box-shadow: inset 0 0 10px #fff7f7,
        0 0 15px #c2c6f0;
    }    
}
.frame {
    display: flex;
    width: 460px;
    margin-bottom: 0;
    background-color: #ffffffc6;
    height: 320px;
    flex-direction: column;
    border-radius: 25px;
    justify-content: center;
    align-items: center;
    
}

.title {
    font-size: 46px;
    /* 圆润又好看的系统自带字体组合 */
    font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
    color: #ffffff;
    text-align: center;

    /* 双层白边+蓝色外发光，超萌 */
    text-shadow:
        0 0 2px #7fbfff,
        0 0 4px #7fbfff,
        0 0 12px rgba(110, 170, 255, 0.4);

    margin-top: 20px;
    margin-bottom: 20px;
    letter-spacing: 2px;
}

@keyframes shine {
    to {
        background-position: 200% center;
    }
}

.input {
    margin: 7px;
    border-bottom:2px solid #b0e6ff;
    border-right:2px solid #b0e6ff;
    border-radius: 25px;
    padding: 8px 13px;
    width: 300px;

}

input {
    border: none;
    font-size: 20px;
    color: #888888;
    background: #00000000;
    margin-left: 5px;
    outline: none;
}

#ver {
    color: #0154e3;
    background-color: #ffffff00;
    border: none;
    cursor: pointer;
    font-size: 18px;
    margin-left: -70px;
}

#reg {
    width: 170px;
    height: 48px;
    border: 2px solid #ffffff;
    outline: 3px solid #6fabff;
    border-radius: 35px;
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    cursor: pointer;
    background: rgb(32, 152, 250);
    box-shadow: inset 0 0 10px #fff;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgb(80, 168, 250);
    }
}
#si {
    color: #0154e3;
    background-color: #ffffff00;
    border: none;
    cursor: pointer;
    font-size: 18px;
}

.but {
    padding: 12px;
    margin: 3px;
}
</style>