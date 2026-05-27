<script setup>
import { ref, defineEmits, reactive, onMounted } from 'vue'
import { getUserInfo, updateUserInfo } from '@/api/user'

const emit = defineEmits(['close', 'update'])

const fileInput = ref(null)

const handleAvatarClick = () => {
    fileInput.value?.click()
}

const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            userInfo.avatar = e.target?.result
        }
        reader.readAsDataURL(file)
    }
}

const isSaving = ref(false)

const handleSave = async () => {
    isSaving.value = true
    try {
        const res = await updateUserInfo(userInfo)
        switch (res.code) {
            case "100000":
                alert('修改成功')
                emit('update')
                emit('close')
                break
            case "100002":
                alert(res.message || '用户未登录或登录已过期')
                break
            case "200001":
                alert(res.message || '该手机号或邮箱已被使用')
                break
            default:
                alert(res.message || '修改失败')
                break
        }
    } catch (error) {
        alert('保存失败，请稍后重试')
    } finally {
        isSaving.value = false
    }
}

const handleCancel = () => {
    emit('close')
}

const userInfo = reactive({
    nickname: '',
    gender: 0,
    email: '',
    phone: '',
    avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=default%20user%20avatar%20portrait%20icon%20minimalist%20style&image_size=square',
    userId: ''
})
// 组件挂载时获取用户信息
onMounted(async () => {
    try {
        const res = await getUserInfo()
        if (res.code === "100000") {
            userInfo.nickname = res.data.nickname || ''
            userInfo.gender = res.data.gender ?? 0
            userInfo.email = res.data.email || ''
            userInfo.phone = res.data.phone || ''
            userInfo.userId = res.data.userId || ''
            if (res.data.avatar) {
                userInfo.avatar = res.data.avatar
            }
        }
    } catch (error) {
        console.error('获取用户信息失败:', error)
    }
})
</script>

<template>
    <div class="edit-box">
        <div class="tit">
            <h3>编辑个人信息</h3>
        </div>

        <div class="edit-card">

            <div class="form-item pho">
                <img :src="userInfo.avatar" alt="头像" class="avatar" @click="handleAvatarClick">
                <input ref="fileInput" type="file" accept="image/*" class="avatar-input" @change="handleFileChange">
            </div>

            <div class="form-item name">
                <label>昵称:</label>
                <input type="text" v-model="userInfo.nickname" class="nameinput">
            </div>

            <div class="sex">
                <label>性别:</label>
                <div class="gender">
                    <div class="gender-item">
                        <input type="radio" name="gender" id="man" v-model.number="userInfo.gender" :value="1">
                        <label for="man"><svg width="20" height="20" viewBox="0 0 48 48" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M41.9517 15.0483V6.04834H32.9517" stroke="#8cafff" stroke-width="4"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path
                                    d="M10.4135 38.0007C15.8808 43.4681 24.7451 43.4681 30.2125 38.0007C32.9462 35.2671 34.313 31.6841 34.313 28.1012C34.313 24.5183 32.9462 20.9354 30.2125 18.2017C24.7451 12.7344 15.8808 12.7344 10.4135 18.2017C4.94615 23.6691 4.94615 32.5334 10.4135 38.0007Z"
                                    fill="none" stroke="#8cafff" stroke-width="4" stroke-linejoin="round" />
                                <path d="M30.0002 17.9999L39.9517 8.04838" stroke="#8cafff" stroke-width="4"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>男</label>
                    </div>
                    <div class="gender-item">
                        <input type="radio" name="gender" id="woman" v-model.number="userInfo.gender" :value="2">
                        <label for="woman"><svg width="20" height="20" viewBox="0 0 48 48" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#icon-77eca05bbccbbd09)">
                                    <path
                                        d="M38.3785 9.85132C32.9112 4.38398 24.0468 4.38398 18.5795 9.85132C15.8458 12.585 14.479 16.1679 14.479 19.7508C14.479 23.3337 15.8458 26.9166 18.5795 29.6503C24.0468 35.1176 32.9112 35.1176 38.3785 29.6503C43.8458 24.183 43.8458 15.3187 38.3785 9.85132Z"
                                        fill="none" stroke="#ff8cec" stroke-width="4" stroke-linejoin="round" />
                                    <path d="M18.4642 29.5353L5.73633 42.2632" stroke="#ff8cec" stroke-width="4"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M19.1714 41.5562L6.44346 28.8282" stroke="#ff8cec" stroke-width="4"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="icon-77eca05bbccbbd09">
                                        <rect width="48" height="48" fill="#ff8cec" />
                                    </clipPath>
                                </defs>
                            </svg>女</label>
                    </div>
                </div>
            </div>
            <div class="userIdCss">
                用户ID:{{userInfo.userId}}
            </div>

            <div class="form-item">
                <label>手机号:</label>
                <input type="text" v-model="userInfo.phone">
            </div>

            <div class="form-item">
                <label>邮箱:</label>
                <input type="text" v-model="userInfo.email">
            </div>

            <div class="button-group">
                <button class="btn btn-cancel" @click="handleCancel">取消修改</button>
                <button class="btn btn-save" @click="handleSave">保存修改</button>
            </div>
        </div>


    </div>

</template>

<style scoped>
.edit-box {
    width: 500px;
    height: 410px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    background: #fffdfd;
    box-shadow: 0px 4px 10px 1px #b6ceec;
    position: absolute;
    left: 8px;
    top: 9px;
}

.edit-card {
    padding: 15px;
}

.tit {
    height: 55px;
    background: linear-gradient(to right, #65A3F0, #FDCBE6);
    border-radius: 10px 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;

}

h3 {
    text-align: center;
    font-weight: 600;
    color: #ffffff;
}

.form-item {
    margin: 20px;
    width: 430px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e5e7eb;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: 0.2s;
}

.avatar:hover {
    border-color: #8ec5fc;
    transform: scale(1.05);
}

.avatar-input {
    display: none;
}

.pho {
    margin-bottom: -100px;
}

.name {
    width: 290px;
    margin-left: 160px;
}

.nameinput {
    width: 200px;
}

.sex {
    margin: 16px 16px 16px 160px;
    display: flex;
    align-items: center;
}

label {
    display: block;
    color: #555;
    font-size: 18px;
}

input {
    width: 320px;
    padding: 10px;
    border: 1px solid #e0e0e0;
    outline: none;
    border-radius: 8px;
    font-size: 16px;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 60px;
    margin-top: 20px;
    padding-right: 30px;
}

.btn {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel {
    background: linear-gradient(to right, #65A3F0, #88c1ff);
    border: 2px solid #65A3F0;
    color: white;

    &:hover {
        background: linear-gradient(to right, #5a99e6, #7ab8ff);
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(101, 163, 240, 0.4);
    }
}

.btn-save {
    background: linear-gradient(to right, #ffd7ee, #ffb8d9);
    border: 2px solid #ffc2f2;
    color: white;

    &:hover {
        background: linear-gradient(to right, #ffc7df, #ffa8c9);
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(255, 184, 217, 0.4);
    }
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
.userIdCss {
    font-size: 13px;
    color: #5c5c5c;
}
</style>