<template>
    <div class="publish-page">
        <header class="header">
            <div class="logo">🐾 发布领养信息</div>
            <button class="back-btn" @click="goBack">返回列表</button>
        </header>

        <div class="form-container">
            <form @submit.prevent="submitForm" class="adoption-form">
                <h2>发布宠物领养信息</h2>
                
                <!-- 选择宠物 -->
                <div class="form-group">
                    <label>选择要领养的宠物 *</label>
                    <div class="pet-select-container">
                        <select v-model="selectedPetId" @change="selectPet" required class="form-select">
                            <option value="">请从宠物档案中选择</option>
                            <option v-for="pet in petArchive" :key="pet.id" :value="pet.id">
                                {{ pet.name }} ({{ pet.type }})
                            </option>
                        </select>
                    </div>
                </div>

                <!-- 宠物信息展示 -->
                <div v-if="selectedPet" class="pet-info-card">
                    <div class="pet-info-header">
                        <img :src="selectedPet.image || '/src/assets/hero.png'" alt="宠物照片" class="pet-avatar">
                        <div class="pet-basic">
                            <h3>{{ selectedPet.name }}</h3>
                            <span class="pet-type-tag">{{ selectedPet.type }}</span>
                        </div>
                    </div>
                    <p class="pet-desc">已有描述：{{ selectedPet.description || '暂无描述' }}</p>
                </div>

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
                    <textarea v-model="form.description" required rows="4" placeholder="请描述宠物的性格、健康状况、领养要求等信息..." class="form-textarea"></textarea>
                </div>

                <!-- 领养地区 -->
                <div class="form-group">
                    <label>领养地区 *</label>
                    <select v-model="form.region" required class="form-select">
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
                            <input type="radio" v-model="form.isFree" :value="true" required>
                            <span>无偿领养</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" v-model="form.isFree" :value="false" required>
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
                <button type="submit" class="submit-btn">发布领养信息</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 当前用户ID
const currentUserId = ref(1);

// 宠物档案（模拟数据）- 当前用户的宠物
const petArchive = ref([
    {
        id: 101,
        name: '小橘',
        type: '猫',
        description: '可爱的橘猫，性格温顺，喜欢撒娇，已经打过疫苗。',
        image: '/src/assets/banMa/IMG_3972.PNG',
        ownerId: 1,
        createdAt: new Date('2023-06-15').getTime()
    },
    {
        id: 102,
        name: '豆豆',
        type: '狗',
        description: '小型泰迪犬，非常可爱，不掉毛，适合公寓饲养。',
        image: '/src/assets/banMa/IMG_3980.PNG',
        ownerId: 1,
        createdAt: new Date('2023-08-20').getTime()
    },
    {
        id: 103,
        name: '球球',
        type: '仓鼠',
        description: '可爱的金丝熊，毛色金黄，性格温顺，容易饲养。',
        image: '',
        ownerId: 1,
        createdAt: new Date('2023-10-01').getTime()
    },
    {
        id: 104,
        name: '咪咪',
        type: '猫',
        description: '优雅的英短猫，蓝灰色毛发，性格高冷但很粘人。',
        image: '/src/assets/banMa/IMG_3982.PNG',
        ownerId: 1,
        createdAt: new Date('2023-12-10').getTime()
    }
]);

// 选中的宠物ID
const selectedPetId = ref('');

// 选中的宠物信息
const selectedPet = computed(() => {
    return petArchive.value.find(pet => pet.id === parseInt(selectedPetId.value));
});

// 表单数据
const form = reactive({
    petName: '',
    petType: '',
    description: '',
    region: '',
    isFree: true,
    contact: ''
});

// 选择宠物
const selectPet = () => {
    if (selectedPet.value) {
        form.petName = selectedPet.value.name;
        form.petType = selectedPet.value.type;
        // 如果宠物有描述，可以自动填充到领养描述
        if (selectedPet.value.description && !form.description) {
            form.description = selectedPet.value.description;
        }
    } else {
        form.petName = '';
        form.petType = '';
    }
};

// 提交表单
const submitForm = () => {
    // 生成新的领养信息
    const newAdoption = {
        id: Date.now(),
        ...form,
        publisherId: currentUserId.value,
        publishTime: Date.now(),
        petId: parseInt(selectedPetId.value),
        image: selectedPet.value?.image || ''
    };
    
    // 存储到localStorage
    const adoptionList = JSON.parse(localStorage.getItem('adoptionList') || '[]');
    adoptionList.push(newAdoption);
    localStorage.setItem('adoptionList', JSON.stringify(adoptionList));
    
    alert('发布成功！');
    router.push('/adoption');
};

// 返回列表
const goBack = () => {
    router.push('/adoption');
};
</script>

<style lang="scss" scoped>
.publish-page {
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
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

.adoption-form h2 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 22px;
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
    padding: 12px 15px;
    border: 2px solid #e0e7ff;
    border-radius: 10px;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
    
    &:focus {
        border-color: #65A3F0;
    }
}

.form-select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e7ff;
    border-radius: 10px;
    font-size: 16px;
    outline: none;
    cursor: pointer;
    box-sizing: border-box;
    
    &:focus {
        border-color: #65A3F0;
    }
}

.form-textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e7ff;
    border-radius: 10px;
    font-size: 16px;
    outline: none;
    resize: none;
    box-sizing: border-box;
    
    &:focus {
        border-color: #65A3F0;
    }
}

.form-input.readonly {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
}

.pet-info-card {
    background: linear-gradient(135deg, #f0f7ff, #e8f4fd);
    border: 1px solid #cce0ff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
}

.pet-info-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
}

.pet-avatar {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    object-fit: cover;
}

.pet-basic {
    flex: 1;
}

.pet-basic h3 {
    margin: 0 0 5px 0;
    color: #333;
}

.pet-type-tag {
    background: #e0f2fe;
    color: #0284c7;
    padding: 3px 10px;
    border-radius: 15px;
    font-size: 12px;
}

.pet-desc {
    margin: 0;
    color: #666;
    font-size: 14px;
    line-height: 1.5;
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
    padding: 15px;
    background: linear-gradient(to right, #65A3F0, #88c1ff);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 15px rgba(101, 163, 240, 0.4);
    }
}
</style>