<template>
    <div class="window">
        <div class="top">
            <p class="topP">--登录--</p>
            <button class="btn-register" @click="goToRegister">去注册</button>
        </div>
        <div class="section">
            <div class="section1">
                <div class="message">
                    <div class="message1 username">
                        <input class="messageInput" type="text" :placeholder="placeholderText"
                            v-model="signinBack.username">
                    </div>
                    <div class="message1 password">
                        <input class="messageInput" id="passwordInput" type="password" placeholder="请输入密码/验证码"
                            v-model="signinBack.password">
                    </div>
                </div>
                <div class="method">
                    <span class="methodContent"><input type="radio" name="signinMethod" :value="1"
                            v-model="signinBack.choice">手机号</span>
                    <span class="methodContent"><input type="radio" name="signinMethod" :value="2"
                            v-model="signinBack.choice" :checked="signinBack.choice === 3">邮箱</span>
                    <button class="btn-verify" :class="{ 'btn-verify-active': signinBack.choice === 3 }"
                        @click="toggleVerifyMode">使用验证码登录</button>
                </div>
                <button class="btn1" @click="login">登录</button>
            </div>
            <div class="section2">
                <div class="section2p">{{ signinBack.content }}</div>
                <img class="img1" :src="signinBack.img" alt="">
            </div>
        </div>
    </div>

</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { loginByEmail, loginByPhone, loginByEmailCode, sendVerifyCode } from '@/api/user';

//登录方式
let placeholderText = ref("")

// 验证码发送状态
const isSendingCode = ref(false)

// 定义自定义事件，通知父组件登录成功
const emit = defineEmits(['login-success']);

// 获取路由实例
const router = useRouter();

// 跳转到注册页面
const goToRegister = () => {
    router.push('/register');
};
//登录输入反馈
let signinBack = reactive({
    img: "src/assets/banMa/IMG_4021.PNG",
    content: "欢迎来到萌宠小镇！",
    username: "",
    password: "",
    choice: 0,
    judge: true,
    verifyMode: false,
    check(x) {
        if (x == 1) {
            if (this.username.length >= 11) {
                this.judge = /^1[3-9]\d{9}$/.test(this.username);
            }
            else {
                this.judge = true;
            }
        }
        if (x == 2 && this.username.length >= 6) {
            this.judge = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.username);
        }
        if (x == 2 && this.username.length < 6) {
            this.judge = true;
        }


    }
})
watchEffect(() => {
    signinBack.check(signinBack.choice);
    if (signinBack.judge == false) {
        signinBack.content = "输入格式有误！"
        signinBack.img = "src/assets/banMa/IMG_3982.PNG"
    }
    else {
        signinBack.content = "欢迎来到萌宠小镇！"
        signinBack.img = "src/assets/banMa/IMG_4021.PNG";
    }

    if (signinBack.choice == 0 && signinBack.username.length) {
        signinBack.content = "选择登录方式！";
        signinBack.img = "src/assets/banMa/IMG_3974.PNG";
    }

    // 如果选择手机号登录，取消验证码模式
    if (signinBack.choice === 1) {
        signinBack.verifyMode = false;
    }

    switch (signinBack.choice) {
        case 1:
            placeholderText.value = "请输入手机号"
            break;
        case 2:
            placeholderText.value = "请输入邮箱"
            break;
        case 3:
            placeholderText.value = "请输入邮箱"
            break;
        default:
            placeholderText.value = "请选择登录方式"
    }
})

//邮箱密码登录
const emailLogin = async () => {
    try {
        const res = await loginByEmail(signinBack.username, signinBack.password);
        if (res.code === "100000" || true) {
            alert("登录成功！");
            emit('login-success', res.data);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }

            router.push('/');
        } else {
            alert(res.message || "登录失败，请检查邮箱或密码是否正确");
        }
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "出错了");
    }
}
// 发送验证码
async function handleSendVerifyCode() {
    if (isSendingCode.value) return;

    isSendingCode.value = true;
    try {
        const res = await sendVerifyCode(signinBack.username);
        if (res.code === "100000") {
            alert("验证码已发送到您的邮箱，请查收！");
        } else {
            alert(res.message || "验证码发送失败，请稍后重试");
        }
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "验证码发送失败，请稍后重试");
    } finally {
        isSendingCode.value = false;
    }
}

// 切换验证码登录模式
function toggleVerifyMode() {
    if (signinBack.choice === 3) {
        // 取消验证码登录，切换到邮箱密码登录
        signinBack.choice = 2;
        signinBack.verifyMode = false;
    } else {
        // 启用验证码登录，自动勾选邮箱登录
        signinBack.choice = 3;
        signinBack.verifyMode = true;

        // 检查邮箱格式，如果正确则发送验证码
        if (signinBack.username && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(signinBack.username)) {
            handleSendVerifyCode();
        } else {
            alert("请输入正确的邮箱地址以发送验证码");
        }
    }
}

//手机号密码登录
const phoneLogin = async () => {
    try {
        const res = await loginByPhone(signinBack.username, signinBack.password);
        if (res.code === "200") {
            alert("登录成功！");
            emit('login-success', res.data);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }//存token

        } else {
            alert(res.message || "登录失败，请检查手机号或密码是否正确");
        }
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "出错了");
    }
}

//邮箱验证码登录
async function emailVerifyLogin() {
    try {
        const res = await loginByEmailCode(signinBack.username, signinBack.password);
        if (res.code === "200") {
            alert("登录成功！");
            emit('login-success', res.data);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }
        } else {
            alert(res.message || "验证码错误或已过期");
        }
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "登录失败，请稍后再试");
    }
}

//根据选择的登录方式调用不同的登录函数并避免多次点击
const isSubmitting = ref(false);
async function login() {
    if (isSubmitting.value) return; // 防止重复点击
    isSubmitting.value = true;

    try {
        if (signinBack.choice == 1) {
            await phoneLogin();
        }
        else if (signinBack.choice == 2) {
            await emailLogin();
        }
        else if (signinBack.choice == 3) {
            await emailVerifyLogin();
        }
    } catch (error) {
        console.error('登录过程出错:', error);
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0%;
    margin: 0%;
}

.icon1 {
    width: 20px;
}

.btn1 {
    width: 80px;
    height: 30px;
    background-color: #c0deff;
    border: solid #71b8ff 1px;
    border-radius: 6px;
    margin: 10px 0 0 140px;
    color: rgb(99, 99, 99);
    transition: 0.1s;
}

.btn1:hover {
    background-color: hsl(210, 100%, 80%);

}

.btn1:active {
    transform: scale(0.95);
    background: hsl(210, 100%, 80%);
}

/* 验证码登录按钮样式 */
.btn-verify {
    width: 120px;
    height: 30px;
    background: linear-gradient(to right, #65A3F0, #88c1ff);
    border: none;
    border-radius: 6px;
    margin-left: 20px;
    margin-top: -2px;
    color: white;
    font-size: 13px;
    font-weight: 300;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    box-shadow: 0 2px 4px rgba(101, 163, 240, 0.3);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.btn-verify:hover {
    background: linear-gradient(to right, #4a8fe0, #65A3F0);
    box-shadow: 0 4px 8px rgba(101, 163, 240, 0.4);
}

.btn-verify-active {
    background: linear-gradient(to right, #357bd8, #4a8fe0) !important;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2) !important;
    transform: scale(0.98) !important;
}

.btn-verify-active:hover {
    background: linear-gradient(to right, #2c6bc7, #357bd8) !important;
}

.window {
    width: 600px;
    height: 400px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 15px 4px #81a3cc;
    transition: 0.3s;
}

.window:hover {
    box-shadow: 0px 4px 28px 5px #7191b9;
}

.section {
    display: flex;
    flex: 1;
    justify-content: space-between;
    background: rgba(215, 231, 255, 0.726);
    backdrop-filter: blur(5px);
}

.section1 {
    display: flex;
    flex-direction: column;

}

.section2 {
    display: flex;
    flex-direction: column;
    padding: 30px 0;
}

.top {
    height: 55px;
    background: linear-gradient(to right, #65A3F0, #FDCBE6);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.topP {
    font: 599 20px SimHei;
    color: white;
}

/* 去注册按钮样式 */
.btn-register {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    padding: 6px 16px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    position: absolute;
    right: 20px;
}

.btn-register:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
}

.btn-register:active {
    transform: scale(0.95);
}

.messageInput {
    width: 250px;
    height: 30px;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
    padding-left: 10px;
    border: solid 2px #A5CAF1;
    background: linear-gradient(to right, #e7f2ff, #A5CAF1);
}

#passwordInput {
    border: solid 2px #FDCBE6;
    outline: none;
    background: linear-gradient(to right, #FFEDF5, #FDCBE6);
}

#passwordInput:focus {
    border-color: #ffa5d5;
}

.messageInput:focus {
    border-color: #409eff;
}

.password {
    display: flex;
    align-items: center;
}

.message {
    margin: 40px 0px 0px 25px;
}

.message1 {
    margin: 30px 0 30px 30px;
}

.passwordShow {
    margin: 10px;
}

.method {
    display: flex;
    margin: 20px 0 20px 30px;
    justify-content: space-around;
}

.methodContent {
    color: #636262;
}

.img1 {
    width: 200px;
    height: 200px;
}

.section2p {
    background-color: #FFEDF5;
    width: 120px;
    height: 60px;
    border-radius: 20px 20px 20px 0px;
    margin: 0px 20px 0 auto;
    border: solid 2px #FDCBE6;
    color: #797979;
    font: 13px bold "Microsoft YaHei";
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
}
</style>