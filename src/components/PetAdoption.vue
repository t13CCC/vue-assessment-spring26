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

        <!-- 筛选区域 -->
        <div class="search-section">
            <div class="filter-row">
                <select v-model="filterType" class="filter-select" @change="handleFilterChange">
                    <option value="">全部类型</option>
                    <option value="猫">猫</option>
                    <option value="狗">狗</option>
                    <option value="鸟">鸟</option>
                    <option value="兔子">兔子</option>
                    <option value="仓鼠">仓鼠</option>
                    <option value="其他">其他</option>
                </select>
                <input type="text" v-model="filterRegion" placeholder="输入地区..." class="search-input"
                    @change="handleFilterChange">
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-state">
            <p>❌ {{ error }}</p>
            <button @click="fetchAdoptionList" class="retry-btn">重新加载</button>
        </div>

        <!-- 领养列表 -->
        <div v-else class="adoption-list">
            <div v-for="item in adoptionList" :key="item.id" class="adoption-card">
                <div class="card-image">
                    <img :src="item.petPhoto || '/src/assets/hero.png'" alt="宠物图片">
                </div>
                <div class="card-content">
                    <h3 class="pet-name">{{ item.petName }}</h3>
                    <div class="pet-info">
                        <span class="tag">{{ item.petType }}</span>
                        <span class="tag" :class="item.isFree === 1 ? 'free' : 'paid'">{{ item.isFree === 1 ? '无偿' :
                            '有偿' }}</span>
                    </div>
                    <p class="description">{{ item.adoptionDesc }}</p>
                    <div class="card-footer">
                        <span class="region">📍 {{ item.area }}</span>
                        <span class="time">🕐 {{ formatTime(item.createTime) }}</span>
                    </div>
                    <div class="card-actions">
                        <button v-if="item.userId === currentUserId" class="action-btn edit-btn"
                            @click="goToEdit(item.id)">编辑</button>
                        <button v-if="item.userId === currentUserId" class="action-btn delete-btn"
                            @click="deleteAdoptionInfo(item.id)">删除</button>
                        <button v-if="item.userId !== currentUserId" class="action-btn contact-btn"
                            @click="addFriend(item.userId)">加好友联系</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && !error && adoptionList.length === 0" class="empty-state">
            <p>暂无领养信息</p>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="!loading && !error && total > pageSize">
            <button :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)"
                class="page-btn">上一页</button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button :disabled="currentPage >= totalPages" @click="handlePageChange(currentPage + 1)"
                class="page-btn">下一页</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAdoptionList, deleteAdoption } from '../api/adoption';

const router = useRouter();

// 当前用户ID（模拟登录用户）
const currentUserId = ref(1);

// 筛选条件
const filterType = ref('');
const filterRegion = ref('');

// 分页
const currentPage = ref(1);
const pageSize = ref(6);
const total = ref(0);

// 数据列表
const adoptionList = ref([]);
const loading = ref(false);
const error = ref('');

// 总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

// 格式化时间
const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 获取领养列表
const fetchAdoptionList = async () => {
    loading.value = true;
    error.value = '';

    try {
        const params = {
            page: currentPage.value,
            size: pageSize.value,
            area: filterRegion.value || undefined,
            petType: filterType.value || undefined
        };

        const response = await getAdoptionList(params);

        if (response.code === '100000') {
            let data = response.data;
            let records = data.records || [];

            // 按发布时间降序排序
            records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

            adoptionList.value = records;
            total.value = data.total || 0;
        } else {
            error.value = response.message || '获取领养列表失败';
            adoptionList.value = [];
            total.value = 0;
        }
    } catch (err) {
        console.error('获取领养列表失败:', err);
        error.value = '获取领养列表失败，请稍后重试';
        adoptionList.value = [];
        total.value = 0;
    } finally {
        loading.value = false;
    }
};

// 处理筛选条件变化
const handleFilterChange = () => {
    currentPage.value = 1;
    fetchAdoptionList();
};

// 处理页码变化
const handlePageChange = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchAdoptionList();
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
const deleteAdoptionInfo = async (id) => {
    if (!confirm('确定要删除这条领养信息吗？')) return;

    try {
        const response = await deleteAdoption(id);
        if (response.code === '100000') {
            alert('删除成功');
            fetchAdoptionList();
        } else {
            alert(response.message || '删除失败');
        }
    } catch (err) {
        console.error('删除失败:', err);
        alert('删除失败，请稍后重试');
    }
};

//编辑领养信息


// 加好友联系
const addFriend = (userId) => {
    alert(`已向用户ID ${userId} 发送好友请求，请等待对方通过验证后联系！`);
};

// 组件挂载时获取数据
onMounted(() => {
    fetchAdoptionList();
});
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

.loading-state {
    text-align: center;
    padding: 50px;
    color: #65A3F0;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e0e7ff;
    border-top-color: #65A3F0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-state {
    text-align: center;
    padding: 50px;
    color: #dc2626;
}

.retry-btn {
    margin-top: 15px;
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