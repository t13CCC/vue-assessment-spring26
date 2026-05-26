<template>
    <div class="content">
        <!-- 选项卡 -->
        <div class="add-friend-tabs">
            <button 
                :class="['add-tab', activeSubTab === 'find' ? 'active' : '']" 
                @click="activeSubTab = 'find'"
            >
                发现好友
            </button>
            <button 
                :class="['add-tab', activeSubTab === 'requests' ? 'active' : '']" 
                @click="activeSubTab = 'requests'"
            >
                好友申请 {{ requests.length }}
            </button>
        </div>
        
        <!-- 发现好友 -->
        <div v-if="activeSubTab === 'find'" class="find-section">
            <div class="search-box">
                <input type="text" v-model="searchKeyword" placeholder="搜索用户名..." class="search-input">
                <button @click="searchUsers" class="search-btn">搜索</button>
            </div>
            
            <div v-if="searchResults.length > 0" class="users-list">
                <div v-for="user in searchResults" :key="user.id" class="user-card">
                    <img :src="user.avatar || '/src/assets/avator.png'" alt="头像" class="user-avatar">
                    <div class="user-info">
                        <h4 class="user-name">{{ user.name }}</h4>
                        <p class="user-status">{{ isFriend(user.id) ? '已成为好友' : '未添加' }}</p>
                    </div>
                    <button 
                        v-if="!isFriend(user.id) && !hasPendingRequest(user.id)" 
                        class="add-friend-btn" 
                        @click="$emit('send-request', user.id)"
                    >
                        + 添加好友
                    </button>
                    <button v-else-if="hasPendingRequest(user.id)" class="pending-btn">
                        等待验证
                    </button>
                    <button v-else class="already-friend-btn">
                        已成为好友
                    </button>
                </div>
            </div>
            
            <div v-if="searchResults.length === 0 && searchKeyword" class="empty-state">
                <p>未找到用户</p>
            </div>
            
            <div v-if="!searchKeyword" class="recommend-section">
                <h3>推荐用户</h3>
                <div class="users-list">
                    <div v-for="user in recommendUsers" :key="user.id" class="user-card">
                        <img :src="user.avatar || '/src/assets/avator.png'" alt="头像" class="user-avatar">
                        <div class="user-info">
                            <h4 class="user-name">{{ user.name }}</h4>
                            <p class="user-status">推荐</p>
                        </div>
                        <button 
                            v-if="!isFriend(user.id) && !hasPendingRequest(user.id)" 
                            class="add-friend-btn" 
                            @click="$emit('send-request', user.id)"
                        >
                            + 添加好友
                        </button>
                        <button v-else-if="hasPendingRequest(user.id)" class="pending-btn">
                            等待验证
                        </button>
                        <button v-else class="already-friend-btn">
                            已成为好友
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 好友申请 -->
        <div v-if="activeSubTab === 'requests'" class="requests-section">
            <div v-if="requests.length === 0" class="empty-state">
                <p>暂无好友申请</p>
            </div>
            
            <div v-else class="requests-list">
                <div v-for="request in requests" :key="request.id" class="request-card">
                    <img :src="request.from.avatar || '/src/assets/avator.png'" alt="头像" class="request-avatar">
                    <div class="request-info">
                        <h4 class="request-name">{{ request.from.name }}</h4>
                        <p class="request-time">{{ formatTime(request.time) }}</p>
                    </div>
                    <div class="request-actions">
                        <button class="accept-btn" @click="$emit('accept-request', request.id)">同意</button>
                        <button class="reject-btn" @click="$emit('reject-request', request.id)">拒绝</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    users: {
        type: Array,
        required: true
    },
    friends: {
        type: Array,
        required: true
    },
    requests: {
        type: Array,
        required: true
    },
    currentUserId: {
        type: Number,
        required: true
    }
});

defineEmits(['send-request', 'accept-request', 'reject-request']);

// 当前子选项卡
const activeSubTab = ref('find');

// 搜索关键词
const searchKeyword = ref('');

// 搜索结果
const searchResults = computed(() => {
    if (!searchKeyword.value) return [];
    const keyword = searchKeyword.value.toLowerCase();
    return props.users.filter(user => 
        user.id !== props.currentUserId && 
        user.name.toLowerCase().includes(keyword)
    );
});

// 推荐用户（排除自己和已添加的好友）
const recommendUsers = computed(() => {
    return props.users.filter(user => 
        user.id !== props.currentUserId && 
        !props.friends.some(f => f.friendId === user.id.toString())
    );
});

// 是否是好友
const isFriend = (userId) => {
    return props.friends.some(friend => friend.friendId === userId.toString());
};

// 是否有待处理的请求
const hasPendingRequest = (userId) => {
    return props.requests.some(req => req.from.id === userId);
};

// 格式化时间
const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
};

// 搜索用户
const searchUsers = () => {
    // 搜索逻辑已通过computed实现
};
</script>

<style lang="scss" scoped>
.content {
    padding: 20px 30px;
}

.add-friend-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    background: white;
    padding: 5px;
    border-radius: 15px;
    width: fit-content;
}

.add-tab {
    padding: 10px 25px;
    border: none;
    background: transparent;
    border-radius: 12px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    
    &:hover {
        background: #f0f0f0;
    }
    
    &.active {
        background: linear-gradient(to right, #f895c8, #ffd4eb);
        color: white;
    }
}

.find-section {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-box {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.search-input {
    flex: 1;
    padding: 12px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 16px;
    outline: none;
    
    &:focus {
        border-color: #f895c8;
    }
}

.search-btn {
    padding: 12px 25px;
    background: linear-gradient(to right, #f895c8, #ffd4eb);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
}

.users-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.user-card {
    display: flex;
    align-items: center;
    background: #f8fafc;
    padding: 15px;
    border-radius: 12px;
}

.user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
}

.user-info {
    flex: 1;
}

.user-name {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.user-status {
    margin: 0;
    font-size: 13px;
    color: #999;
}

.add-friend-btn {
    padding: 8px 16px;
    background: linear-gradient(to right, #f895c8, #ffd4eb);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    
    &:hover {
        opacity: 0.9;
    }
}

.pending-btn, .already-friend-btn {
    padding: 8px 16px;
    background: #f1f5f9;
    color: #64748b;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: not-allowed;
}

.recommend-section {
    margin-top: 20px;
}

.recommend-section h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.requests-section {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.requests-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.request-card {
    display: flex;
    align-items: center;
    background: #f8fafc;
    padding: 15px;
    border-radius: 12px;
}

.request-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
}

.request-info {
    flex: 1;
}

.request-name {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.request-time {
    margin: 0;
    font-size: 13px;
    color: #999;
}

.request-actions {
    display: flex;
    gap: 10px;
}

.accept-btn {
    padding: 8px 16px;
    background: linear-gradient(to right, #22c55e, #4ade80);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    
    &:hover {
        opacity: 0.9;
    }
}

.reject-btn {
    padding: 8px 16px;
    background: #fee2e2;
    color: #dc2626;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    
    &:hover {
        opacity: 0.9;
    }
}

.empty-state {
    text-align: center;
    padding: 50px;
    color: #999;
}
</style>