<script setup>
import axios from 'axios';
import { ref, reactive, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';


// 注册表单数据
const registerForm = reactive({
    account: '', // 手机号/邮箱
    code: '',
    password: ''
});

// 表单错误信息
const errors = reactive({
    account: '',
    code: '',
    password: ''
});

// 验证码倒计时
const codeCountdown = ref(0);
const codeButtonText = ref('获取验证码');

// 是否正在提交
const isSubmitting = ref(false);

// 判断是手机号还是邮箱
const isPhone = ref(false);
const isEmail = ref(false);

// 验证表单
const validateForm = () => {
    let isValid = true;
    
    // 验证账号（手机号或邮箱）
    if (!registerForm.account) {
        errors.account = '请输入手机号或邮箱';
        isValid = false;
    } else if (!isPhone.value && !isEmail.value) {
        errors.account = '请输入正确的手机号或邮箱格式';
        isValid = false;
    } else {
        errors.account = '';
    }
    
    // 验证验证码
    if (!registerForm.code) {
        errors.code = '请输入验证码';
        isValid = false;
    } else if (!/^\d{6}$/.test(registerForm.code)) {
        errors.code = '验证码应为6位数字';
        isValid = false;
    } else {
        errors.code = '';
    }
    
    // 验证密码
    if (!registerForm.password) {
        errors.password = '请设置密码';
        isValid = false;
    } else if (registerForm.password.length < 6 || registerForm.password.length > 20) {
        errors.password = '密码长度应为6-20个字符';
        isValid = false;
    } else {
        errors.password = '';
    }
    
    return isValid;
};

// 获取验证码
const getver = async () => {
    if (codeCountdown.value > 0) return;
    
    // 先验证账号格式
    if (!registerForm.account) {
        errors.account = '请先输入手机号或邮箱';
        return;
    }
    
    if (!isPhone.value && !isEmail.value) {
        errors.account = '请输入正确的手机号或邮箱格式';
        return;
    }
    
    const data = isPhone.value 
        ? { phone: registerForm.account } 
        : { email: registerForm.account };
    
    try {
        const response = await axios.post('http://localhost:8081/api/auth/login/email/code/send', data);
        
        if (response.data.code === '100000') {
            codeCountdown.value = 60;
            startCountdown();
            errors.account = '';
        } else {
            errors.account = response.data.message || '发送失败';
        }
    } catch (error) {
        console.error('发送验证码失败:', error);
        errors.account = '发送验证码失败，请稍后重试';
    }
};

// 倒计时
const startCountdown = () => {
    const timer = setInterval(() => {
        codeCountdown.value--;
        codeButtonText.value = `${codeCountdown.value}秒后重发`;
        
        if (codeCountdown.value <= 0) {
            clearInterval(timer);
            codeButtonText.value = '获取验证码';
        }
    }, 1000);
};

// 提交注册
const handleRegister = async () => {
    if (!validateForm()) return;
    
    isSubmitting.value = true;
    
    const data = {
        phone: isPhone.value ? registerForm.account : undefined,
        email: isEmail.value ? registerForm.account : undefined,
        password: registerForm.password
    };
    
    try {
        const response = await axios.post('http://localhost:8081/api/auth/register', data);
        
        if (response.data.code === '100000') {
            alert('注册成功！请登录');
            // 重置表单
            registerForm.account = '';
            registerForm.code = '';
            registerForm.password = '';
        } else {
            alert(response.data.message || '注册失败');
        }
    } catch (error) {
        console.error('注册失败:', error);
        alert('注册失败，请稍后重试');
    } finally {
        isSubmitting.value = false;
    }
};

// 实时验证
watchEffect(() => {
    if (registerForm.account) {
        isPhone.value = /^1[3-9]\d{9}$/.test(registerForm.account);
        isEmail.value = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(registerForm.account);
    } else {
        isPhone.value = false;
        isEmail.value = false;
    }
});
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
                <div class="input-wrapper">
                    <div class="input" :class="{ 'error': errors.account }">
                        <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 30H40V42C40 43.1046 39.1046 44 38 44H10C8.89543 44 8 43.1046 8 42V30Z" fill="none"
                                stroke="#65A3F0" stroke-width="3" stroke-linejoin="round" />
                            <path d="M40 30V6C40 4.89543 39.1046 4 38 4H10C8.89543 4 8 4.89543 8 6V30" stroke="#65A3F0"
                                stroke-width="3" stroke-linejoin="round" />
                            <path d="M22 37H26" stroke="#65A3F0" stroke-width="3" stroke-linecap="round" />
                        </svg>
                        <input type="text" placeholder="请输入手机号/邮箱" v-model="registerForm.account" :class="{ 'error-input': errors.account }">
                    </div>
                    <span v-if="errors.account" class="error-text">{{ errors.account }}</span>
                </div>
                <div class="input-wrapper">
                    <div class="input" :class="{ 'error': errors.code }">
                        <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
                                fill="none" stroke="#FF8CEC" stroke-width="3" stroke-linejoin="round" />
                            <path d="M16 24L22 30L34 18" stroke="#FF8CEC" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                        <input type="text" placeholder="请输入验证码" v-model="registerForm.code" :class="{ 'error-input': errors.code }">
                        <button id="ver" @click="getver()" :disabled="codeCountdown > 0">{{ codeButtonText }}</button>
                    </div>
                    <span v-if="errors.code" class="error-text">{{ errors.code }}</span>
                </div>
                <div class="input-wrapper">
                    <div class="input" :class="{ 'error': errors.password }">
                        <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="22" width="36" height="22" rx="2" fill="none" stroke="#67C23A" stroke-width="3"
                                stroke-linejoin="round" />
                            <path d="M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22" stroke="#67C23A"
                                stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M24 30V36" stroke="#67C23A" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                        <input type="password" placeholder="设置密码（6-20个字符）" v-model="registerForm.password" :class="{ 'error-input': errors.password }">
                    </div>
                    <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
                </div>
                <div class="but">
                    <button id="reg" @click="handleRegister" :disabled="isSubmitting">
                        {{ isSubmitting ? '注册中...' : '注册账号' }}
                    </button>
                </div>
                <div class="login-link">
                    <span>已有帐号？</span>
                    <router-link to="/signin" class="link">立即登录</router-link>
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
    background: linear-gradient(to right, #88c1ff,rgb(255, 255, 255),#ffc7e5);
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
    background: url("../assets/picture/background.jpg");
    background-color: #ffffff9f;
    background-blend-mode: overlay;
    background-size: cover;
    /* 让图片铺满整个屏幕，不变形 */
    background-position: center;
    /* 图片居中显示，保证主体不被裁掉 */
    background-repeat: no-repeat;
    /* 禁止图片重复平铺 */


}

.ff {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 530px;
    height: 550px;
    border-radius: 25px;
    border: 3px solid #d0dcfa;
    background: #f9fcff93;
    transition: all 0.5s;
    padding-top: 20px;
    box-sizing: border-box;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 
            0 5px 15px rgba(101, 163, 240, 0.2);
    }
}

.frame {
    display: flex;
    width: 460px;
    background-color: #ffffffc6;
    height: 370px;
    flex-direction: column;
    border-radius: 25px;
    justify-content: flex-start;
    align-items: center;
    padding-top: 25px;
    box-sizing: border-box;
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

.input-wrapper {
    width: 320px;
    height: 65px;
    margin-bottom: 5px;
    position: relative;
}

.input {
    margin: 0;
    border-top: 2px solid #b0e6ff;
    border-right: 2px solid #b0e6ff;
    border-radius: 25px;
    padding: 12px 15px;
    width: 100%;
    height: 48px;
    position: relative;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
}

.input.error {
    border-color: #ff6b6b;
}

input {
    border: none;
    font-size: 18px;
    color: #666;
    background: transparent;
    outline: none;
    transition: all 0.3s;
    flex: 1;
}

input.error-input {
    color: #ff6b6b;
}

.error-text {
    position: absolute;
    bottom: 5px;
    left: 40px;
    display: block;
    color: #ff6b6b;
    font-size: 13px;
    white-space: nowrap;
}

#ver {
    color: #0154e3;
    background-color: #ffffff00;
    border: none;
    cursor: pointer;
    font-size: 18px;
    margin-left: -70px;
    transition: all 0.3s;
}

#ver:hover:not(:disabled) {
    color: #007bff;
    text-decoration: underline;
}

#ver:disabled {
    color: #999;
    cursor: not-allowed;
}

#reg {
    margin-top: -20px;
    width: 170px;
    height: 50px;
    border: none;
    border-radius: 25px;
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    background: linear-gradient(135deg, #65A3F0 0%, #87BDFF 50%, #FDCBE6 100%);
    box-shadow: 
        0 4px 15px rgba(101, 163, 240, 0.4),
        0 2px 5px rgba(253, 203, 230, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

#reg::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
}

#reg:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 
        0 8px 25px rgba(101, 163, 240, 0.5),
        0 4px 10px rgba(253, 203, 230, 0.4);
}

#reg:hover:not(:disabled)::before {
    left: 100%;
}

#reg:active:not(:disabled) {
    transform: translateY(-1px);
}

#reg:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
    box-shadow: none;
}

.login-link {
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-link span {
    color: #666;
    font-size: 16px;
}

.login-link .link {
    color: #4a9ef0;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.3s;
}

.login-link .link:hover {
    transform: scale(1.1);
}

.but {
    padding: 20px 0;
    margin-top: 10px;
}
</style>