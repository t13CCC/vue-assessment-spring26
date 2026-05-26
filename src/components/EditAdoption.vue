<template>
    <div class="edit-page">
        <header class="header">
            <div class="header-left">
                <button class="home-btn" @click="goToHome">🏠 返回首页</button>
                <div class="logo">🐾 编辑领养信息</div>
            </div>
            <button class="back-btn" @click="goBack">← 返回列表</button>
        </header>

        <div class="form-container" v-if="adoption">
            <form @submit.prevent="submitForm" class="adoption-form">
                <h2>修改领养信息</h2>

                <!-- 宠物名称（只读） -->
                <div class="form-group">
                    <label>宠物名称</label>
                    <input type="text" v-model="form.petName" readonly class="form-input readonly">
                </div>

                <!-- 宠物类型（只读） -->
                <div class="form-group">
                    <label>宠物类型</label>
                    <input type="text" v-model="form.petType" readonly class="form-input readonly">
                </div>

                <!-- 领养描述 -->
                <div class="form-group">
                    <label>领养描述 *</label>
                    <textarea v-model="form.adoptionDesc" required rows="4" placeholder="请描述宠物的性格、健康状况、领养要求等信息..."
                        class="form-textarea"></textarea>
                </div>

                <!-- 领养地区 -->
                <div class="form-group">
                    <label>领养地区 *</label>
                    <select v-model="form.area" required class="form-select">
                        <option value="">请选择领养地区</option>
                        <option value="北京">北京</option>
                        <option value="上海">上海</option>
                        <option value="广州">广州</option>
                        <option value="深圳">深圳</option>
                        <option value="杭州">杭州</option>
                        <option value="成都">成都</option>
                    </select>
                </div>

                <!-- 是否无偿 -->
                <div class="form-group">
                    <label>是否无偿领养 *</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" v-model="form.isFree" :value="1" required>
                            <span>无偿领养</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" v-model="form.isFree" :value="0" required>
                            <span>有偿领养</span>
                        </label>
                    </div>
                </div>

                <!-- 联系方式 -->
                <div class="form-group">
                    <label>联系方式 *</label>
                    <input type="text" v-model="form.contact" required placeholder="请输入手机号或微信号" class="form-input">
                </div>

                <!-- 提交按钮 -->
                <button type="submit" class="submit-btn">保存修改</button>
            </form>
        </div>

        <div v-else class="loading">
            <p>加载中...</p>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAdoptionById, putAdoptionDetail } from '@/api/adoption';

const router = useRouter();
const route = useRoute();

// 表单数据
const form = reactive({
    petName: '',
    petType: '',
    adoptionDesc: '',
    area: '',
    isFree: 1,
    contact: ''
});

// 当前领养信息
const adoption = ref(null);

// 初始化表单数据
onMounted(async () => {
    const id = parseInt(route.params.id);
    try {
        const response = await getAdoptionById(id);
        if (response.code === "100000") {
            adoption.value = response.data;
            form.petName = adoption.value.petName;
            form.petType = adoption.value.petType;
            form.adoptionDesc = adoption.value.adoptionDesc;
            form.area = adoption.value.area;
            form.isFree = adoption.value.isFree;
            form.contact = adoption.value.contact;
        } else {
            alert('获取领养信息失败！');
        }
    } catch (error) {
        console.error('获取领养信息失败:', error);
        alert('获取领养信息失败！');
    }
});

// 提交表单
const submitForm = async () => {
    const adoptionData = {
        id: adoption.value.id,
        petId: adoption.value.petId,
        petName: form.petName,
        petType: form.petType,
        adoptionDesc: form.adoptionDesc,
        area: form.area,
        isFree: form.isFree,
        contact: form.contact,
        petPhoto: adoption.value.petPhoto
    };

    try {
        const response = await putAdoptionDetail(adoptionData);
        if (response.code === "100000") {
            alert('修改成功！');
            router.push('/adoption');
        } else {
            alert('修改失败！');
        }
    } catch (error) {
        console.error('修改领养信息失败:', error);
        alert('修改领养信息失败！');
    }
};

// 返回首页
const goToHome = () => {
    router.push('/');
};

// 返回列表
const goBack = () => {
    router.push('/adoption');
};
</script>

<style lang="scss" scoped>
.edit-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f7ff, #e8f4fd);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: linear-gradient(to right, #65A3F0, #88c1ff, #FDCBE6);
    box-shadow: 0 2px 10px rgba(101, 163, 240, 0.3);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 15px;
}

.home-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 8px 15px;
    border-radius: 15px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: white;
}

.back-btn {
    background: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    color: #65A3F0;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: #f0f7ff;
        transform: scale(1.05);
    }
}

.form-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 0 20px;
}

.adoption-form {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 5px 25px rgba(101, 163, 240, 0.15);
}

.adoption-form h2 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: bold;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
}

.form-input {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
    transition: all 0.3s;

    &:focus {
        border-color: #65A3F0;
        box-shadow: 0 0 0 3px rgba(101, 163, 240, 0.1);
    }
}

.form-input.readonly {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
}

.form-select {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 16px;
    outline: none;
    cursor: pointer;
    box-sizing: border-box;
    transition: all 0.3s;

    &:focus {
        border-color: #65A3F0;
        box-shadow: 0 0 0 3px rgba(101, 163, 240, 0.1);
    }
}

.form-textarea {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 16px;
    outline: none;
    resize: none;
    box-sizing: border-box;
    transition: all 0.3s;

    &:focus {
        border-color: #65A3F0;
        box-shadow: 0 0 0 3px rgba(101, 163, 240, 0.1);
    }
}

.radio-group {
    display: flex;
    gap: 30px;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    input {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    span {
        font-size: 16px;
        color: #555;
    }
}

.submit-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(to right, #65A3F0, #88c1ff);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(101, 163, 240, 0.4);
    }
}

.loading {
    text-align: center;
    padding: 100px;
    color: #999;
}
</style>