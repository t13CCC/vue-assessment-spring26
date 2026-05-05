<template>
    <div class="adoption-page">
        <header class="header">
            <div class="header-left">
                <button class="home-btn" @click="goToHome">🏠 返回首页</button>
                <div class="logo">🐾 萌宠领养</div>
            </div>
            <div class="header-right">
                <button class="publish-btn" @click="goToPublish">发布领养信息</button>
            </div>
        </header>

        <!-- 搜索筛选区域 -->
        <div class="search-section">
            <div class="search-box">
                <input type="text" v-model="searchKeyword" placeholder="搜索宠物名称..." class="search-input">
                <button @click="search" class="search-btn">搜索</button>
            </div>
            <div class="filter-row">
                <select v-model="filterType" class="filter-select">
                    <option value="">全部类型</option>
                    <option value="猫">猫</option>
                    <option value="狗">狗</option>
                    <option value="鸟">鸟</option>
                    <option value="兔子">兔子</option>
                    <option value="仓鼠">仓鼠</option>
                    <option value="其他">其他</option>
                </select>
                <select v-model="filterRegion" class="filter-select">
                    <option value="">全部地区</option>
                    <option value="北京">北京</option>
                    <option value="上海">上海</option>
                    <option value="广州">广州</option>
                    <option value="深圳">深圳</option>
                    <option value="杭州">杭州</option>
                    <option value="成都">成都</option>
                </select>
                <select v-model="filterFree" class="filter-select">
                    <option value="">全部</option>
                    <option value="true">无偿领养</option>
                    <option value="false">有偿领养</option>
                </select>
            </div>
        </div>

        <!-- 排序方式 -->
        <div class="sort-section">
            <span>排序方式：</span>
            <button :class="['sort-btn', sortBy === 'time' ? 'active' : '']" @click="sortBy = 'time'">按发布时间</button>
            <button :class="['sort-btn', sortBy === 'name' ? 'active' : '']" @click="sortBy = 'name'">按宠物名称</button>
        </div>

        <!-- 领养列表 -->
        <div class="adoption-list">
            <div v-for="item in filteredList" :key="item.id" class="adoption-card">
                <div class="card-image">
                    <img :src="item.image || '/src/assets/hero.png'" alt="宠物图片">
                </div>
                <div class="card-content">
                    <h3 class="pet-name">{{ item.petName }}</h3>
                    <div class="pet-info">
                        <span class="tag">{{ item.petType }}</span>
                        <span class="tag" :class="item.isFree ? 'free' : 'paid'">{{ item.isFree ? '无偿' : '有偿' }}</span>
                    </div>
                    <p class="description">{{ item.description }}</p>
                    <div class="card-footer">
                        <span class="region">📍 {{ item.region }}</span>
                        <span class="time">🕐 {{ formatTime(item.publishTime) }}</span>
                    </div>
                    <div class="card-actions">
                        <button v-if="item.publisherId === currentUserId" class="action-btn edit-btn" @click="goToEdit(item.id)">编辑</button>
                        <button v-if="item.publisherId === currentUserId" class="action-btn delete-btn" @click="deleteAdoption(item.id)">删除</button>
                        <button v-if="item.publisherId !== currentUserId" class="action-btn contact-btn" @click="addFriend(item.publisherId)">加好友联系</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredList.length === 0" class="empty-state">
            <p>暂无领养信息</p>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1">
            <button :disabled="currentPage === 1" @click="currentPage--" class="page-btn">上一页</button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-btn">下一页</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 当前用户ID（模拟登录用户）
const currentUserId = ref(1);

// 搜索和筛选条件
const searchKeyword = ref('');
const filterType = ref('');
const filterRegion = ref('');
const filterFree = ref('');
const sortBy = ref('time');

// 分页
const currentPage = ref(1);
const pageSize = ref(6);

// 模拟数据
const adoptionList = ref([
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
]);

// 筛选后的列表
const filteredList = computed(() => {
    let result = [...adoptionList.value];
    
    // 关键词搜索
    if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        result = result.filter(item => 
            item.petName.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)
        );
    }
    
    // 类型筛选
    if (filterType.value) {
        result = result.filter(item => item.petType === filterType.value);
    }
    
    // 地区筛选
    if (filterRegion.value) {
        result = result.filter(item => item.region === filterRegion.value);
    }
    
    // 是否无偿筛选
    if (filterFree.value !== '') {
        result = result.filter(item => String(item.isFree) === filterFree.value);
    }
    
    // 排序
    if (sortBy.value === 'time') {
        result.sort((a, b) => b.publishTime - a.publishTime);
    } else {
        result.sort((a, b) => a.petName.localeCompare(b.petName));
    }
    
    return result;
});

// 总页数
const totalPages = computed(() => Math.ceil(filteredList.value.length / pageSize.value));

// 当前页列表
const currentPageList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredList.value.slice(start, start + pageSize.value);
});

// 格式化时间
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 搜索
const search = () => {
    currentPage.value = 1;
};

// 跳转到首页
const goToHome = () => {
    router.push('/');
};

// 跳转到发布页面
const goToPublish = () => {
    router.push('/publish');
};

// 跳转到编辑页面
const goToEdit = (id) => {
    router.push(`/edit/${id}`);
};

// 删除领养信息
const deleteAdoption = (id) => {
    if (confirm('确定要删除这条领养信息吗？')) {
        const index = adoptionList.value.findIndex(item => item.id === id);
        if (index !== -1) {
            adoptionList.value.splice(index, 1);
        }
    }
};

// 加好友联系
const addFriend = (publisherId) => {
    alert(`已向用户ID ${publisherId} 发送好友请求，请等待对方通过验证后联系！`);
};
</script>

<style lang="scss" scoped>
.adoption-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f7ff, #e8f4fd);
    padding-bottom: 40px;
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

.publish-btn {
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

.search-section {
    padding: 20px 30px;
    background: white;
    margin: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-box {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.search-input {
    flex: 1;
    padding: 10px 15px;
    border: 2px solid #e0e7ff;
    border-radius: 25px;
    font-size: 16px;
    outline: none;
    
    &:focus {
        border-color: #65A3F0;
    }
}

.search-btn {
    padding: 10px 25px;
    background: #65A3F0;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    
    &:hover {
        background: #4a9ef0;
    }
}

.filter-row {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.filter-select {
    padding: 8px 15px;
    border: 2px solid #e0e7ff;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    cursor: pointer;
    
    &:focus {
        border-color: #65A3F0;
    }
}

.sort-section {
    padding: 0 30px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.sort-btn {
    padding: 6px 15px;
    border: 2px solid #e0e7ff;
    border-radius: 15px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
    
    &:hover {
        border-color: #65A3F0;
    }
    
    &.active {
        background: #65A3F0;
        color: white;
        border-color: #65A3F0;
    }
}

.adoption-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    padding: 0 30px;
}

.adoption-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }
}

.card-image {
    height: 200px;
    overflow: hidden;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.card-content {
    padding: 15px;
}

.pet-name {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.pet-info {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.tag {
    padding: 3px 10px;
    background: #e0f2fe;
    color: #0284c7;
    border-radius: 15px;
    font-size: 12px;
    
    &.free {
        background: #dcfce7;
        color: #16a34a;
    }
    
    &.paid {
        background: #fef3c7;
        color: #d97706;
    }
}

.description {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 13px;
    color: #999;
}

.card-actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    
    &.edit-btn {
        background: #e0e7ff;
        color: #4338ca;
    }
    
    &.delete-btn {
        background: #fee2e2;
        color: #dc2626;
    }
    
    &.contact-btn {
        background: #dbeafe;
        color: #1d4ed8;
    }
    
    &:hover {
        opacity: 0.8;
        transform: scale(1.02);
    }
}

.empty-state {
    text-align: center;
    padding: 50px;
    color: #999;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
}

.page-btn {
    padding: 8px 20px;
    background: white;
    border: 2px solid #65A3F0;
    border-radius: 8px;
    color: #65A3F0;
    cursor: pointer;
    font-weight: bold;
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    &:hover:not(:disabled) {
        background: #65A3F0;
        color: white;
    }
}

.page-info {
    font-size: 16px;
    color: #666;
}
</style>