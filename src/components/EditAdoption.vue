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
                <h2>修改宠物信息</h2>
                
                <!-- 宠物名称 -->
                <div class="form-group">
                    <label>宠物名称 *</label>
                    <input type="text" v-model="form.petName" required placeholder="请输入宠物名称" class="form-input">
                </div>

                <!-- 宠物类型 -->
                <div class="form-group">
                    <label>宠物类型 *</label>
                    <select v-model="form.petType" required class="form-select">
                        <option value="">请选择宠物类型</option>
                        <option value="猫">猫</option>
                        <option value="狗">狗</option>
                        <option value="鸟">鸟</option>
                        <option value="兔子">兔子</option>
                        <option value="仓鼠">仓鼠</option>
                        <option value="其他">其他</option>
                    </select>
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

const router = useRouter();
const route = useRoute();

// 表单数据
const form = reactive({
    petName: '',
    petType: '',
    description: '',
    region: '',
    isFree: true,
    contact: ''
});

// 当前领养信息
const adoption = ref(null);

// 模拟数据
const adoptionList = [
    {
        id: 1,
        petName: '小橘',
        petType: '猫',
        description: '可爱的橘猫，性格温顺，喜欢撒娇，已经打过疫苗，希望找到一个温暖的家。',
        region: '北京',
        isFree: true,
        contact: '13800138001',
        publisherId: 1,
        publishTime: new Date('2024-01-15').getTime(),
        image: '/src/assets/banMa/IMG_3972.PNG'
    },
    {
        id: 2,
        petName: '旺财',
        petType: '狗',
        description: '活泼好动的金毛犬，非常聪明，会握手、坐下等基本指令。',
        region: '上海',
        isFree: false,
        contact: '13900139002',
        publisherId: 2,
        publishTime: new Date('2024-01-14').getTime(),
        image: '/src/assets/banMa/IMG_3973.PNG'
    },
    {
        id: 3,
        petName: '球球',
        petType: '仓鼠',
        description: '可爱的金丝熊，毛色金黄，性格温顺，容易饲养。',
        region: '广州',
        isFree: true,
        contact: '13700137003',
        publisherId: 3,
        publishTime: new Date('2024-01-13').getTime()
    },
    {
        id: 4,
        petName: '飞飞',
        petType: '鸟',
        description: '会说话的鹦鹉，毛色鲜艳，非常聪明可爱。',
        region: '深圳',
        isFree: false,
        contact: '13600136004',
        publisherId: 4,
        publishTime: new Date('2024-01-12').getTime(),
        image: '/src/assets/banMa/IMG_3974.PNG'
    },
    {
        id: 5,
        petName: '雪球',
        petType: '兔子',
        description: '雪白的垂耳兔，性格温顺，喜欢吃胡萝卜。',
        region: '杭州',
        isFree: true,
        contact: '13500135005',
        publisherId: 5,
        publishTime: new Date('2024-01-11').getTime(),
        image: '/src/assets/banMa/IMG_3975.PNG'
    },
    {
        id: 6,
        petName: '豆豆',
        petType: '狗',
        description: '小型泰迪犬，非常可爱，不掉毛，适合公寓饲养。',
        region: '成都',
        isFree: false,
        contact: '13400134006',
        publisherId: 1,
        publishTime: new Date('2024-01-10').getTime(),
        image: '/src/assets/banMa/IMG_3980.PNG'
    },
    {
        id: 7,
        petName: '咪咪',
        petType: '猫',
        description: '优雅的英短猫，蓝灰色毛发，性格高冷但很粘人。',
        region: '北京',
        isFree: true,
        contact: '13300133007',
        publisherId: 6,
        publishTime: new Date('2024-01-09').getTime(),
        image: '/src/assets/banMa/IMG_3982.PNG'
    },
    {
        id: 8,
        petName: '布丁',
        petType: '仓鼠',
        description: '布丁仓鼠，金黄色的毛发，非常可爱活泼。',
        region: '上海',
        isFree: true,
        contact: '13200132008',
        publisherId: 7,
        publishTime: new Date('2024-01-08').getTime(),
        image: '/src/assets/banMa/IMG_3983.PNG'
    }
];

// 初始化表单数据
onMounted(() => {
    const id = parseInt(route.params.id);
    adoption.value = adoptionList.find(item => item.id === id);
    
    if (adoption.value) {
        form.petName = adoption.value.petName;
        form.petType = adoption.value.petType;
        form.description = adoption.value.description;
        form.region = adoption.value.region;
        form.isFree = adoption.value.isFree;
        form.contact = adoption.value.contact;
    }
});

// 提交表单
const submitForm = () => {
    // 更新数据（实际应用中这里会调用API）
    if (adoption.value) {
        adoption.value.petName = form.petName;
        adoption.value.petType = form.petType;
        adoption.value.description = form.description;
        adoption.value.region = form.region;
        adoption.value.isFree = form.isFree;
        adoption.value.contact = form.contact;
    }
    
    alert('修改成功！');
    router.push('/adoption');
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