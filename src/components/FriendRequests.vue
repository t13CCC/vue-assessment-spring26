<template>
    <div class="content">
        <!-- 切换按钮 -->
        <div class="toggle-section">
            <button 
                v-if="activeSubTab !== 'sent'"
                class="toggle-btn"
                @click="activeSubTab = 'sent'"
            >
                查看发出的申请 ({{ sentRequests.length }})
            </button>
            <button 
                v-if="activeSubTab === 'sent'"
                class="toggle-btn back"
                @click="activeSubTab = 'received'"
            >
                ← 返回收到的申请
            </button>
        </div>

        <!-- 收到的申请 -->
        <div v-if="activeSubTab === 'received'">
            <div v-if="receivedRequests.length === 0" class="empty-state">
                <p>暂无收到的好友申请</p>
            </div>
            <div v-else class="requests-list">
                <div v-for="request in receivedRequests" :key="request.id" class="request-card">
                    <img :src="request.applicantAvatar || '/src/assets/avator.png'" alt="头像" class="request-avatar">
                    <div class="request-info">
                        <h4 class="request-name">{{ request.applicantName }}</h4>
                        <p class="request-time">{{ formatTime(request.createdTime) }}</p>
                        <p v-if="request.message" class="request-message">{{ request.message }}</p>
                    </div>
                    <div class="request-actions">
                        <button class="accept-btn" @click="$emit('accept-request', request.id)">同意</button>
                        <button class="reject-btn" @click="$emit('reject-request', request.id)">拒绝</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 发出的申请 -->
        <div v-if="activeSubTab === 'sent'">
            <div v-if="sentRequests.length === 0" class="empty-state">
                <p>暂无发出的好友申请</p>
            </div>
            <div v-else class="requests-list">
                <div v-for="request in sentRequests" :key="request.id" class="request-card">
                    <img :src="request.targetAvatar || '/src/assets/avator.png'" alt="头像" class="request-avatar">
                    <div class="request-info">
                        <h4 class="request-name">{{ request.targetName }}</h4>
                        <p class="request-time">{{ formatTime(request.createdTime) }}</p>
                        <p class="request-status">
                            <span :class="getStatusClass(request.status)">{{ getStatusText(request.status) }}</span>
                        </p>
                    </div>
                    <div class="request-actions">
                        <button v-if="request.status === 0" class="cancel-btn" @click="$emit('reject-request', request.id)">取消</button>
                        <span v-else class="status-text">{{ getStatusText(request.status) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    receivedRequests: {
        type: Array,
        required: true
    },
    sentRequests: {
        type: Array,
        required: true
    }
});

defineEmits(['accept-request', 'reject-request']);

const activeSubTab = ref('received');

// 直接使用 props 传递的数据
const receivedRequests = computed(() => props.receivedRequests);
const sentRequests = computed(() => props.sentRequests);

const getStatusClass = (status) => {
    switch (status) {
        case 0: // 待处理
            return 'status-pending';
        case 1: // 已通过
            return 'status-accept';
        case 2: // 已拒绝
            return 'status-reject';
        default:
            return '';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 0: // 待处理
            return '待验证';
        case 1: // 已通过
            return '已同意';
        case 2: // 已拒绝
            return '已拒绝';
        default:
            return String(status);
    }
};

// 格式化时间
const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return '一小时内';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
};
</script>

<style lang="scss" scoped>
.content {
    padding: 20px 30px;
}

.toggle-section {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.toggle-btn {
    padding: 8px 16px;
    background: linear-gradient(to right, #60a5fa, #93c5fd);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(96, 165, 250, 0.3);
    }
    
    &.back {
        background: #f1f5f9;
        color: #64748b;
        
        &:hover {
            background: #e2e8f0;
            box-shadow: none;
        }
    }
}

.requests-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.request-card {
    display: flex;
    align-items: center;
    background: white;
    padding: 15px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
}

.request-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
    border: 2px solid #f0f0f0;
}

.request-info {
    flex: 1;
}

.request-message {
    margin: 3px 0 0 0;
    font-size: 12px;
    color: #666;
    font-style: italic;
}

.request-status {
    margin: 3px 0 0 0;
}

.status-pending {
    font-size: 12px;
    color: #f59e0b;
    background: #fef3c7;
    padding: 2px 8px;
    border-radius: 10px;
}

.status-accept {
    font-size: 12px;
    color: #22c55e;
    background: #dcfce7;
    padding: 2px 8px;
    border-radius: 10px;
}

.status-reject {
    font-size: 12px;
    color: #dc2626;
    background: #fee2e2;
    padding: 2px 8px;
    border-radius: 10px;
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
    transition: all 0.3s;

    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(34, 197, 94, 0.3);
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
    transition: all 0.3s;

    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(220, 38, 38, 0.2);
    }
}

.cancel-btn {
    padding: 8px 16px;
    background: #f1f5f9;
    color: #64748b;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: #e2e8f0;
        transform: translateY(-1px);
    }
}

.status-text {
    font-size: 14px;
    color: #64748b;
    padding: 8px 16px;
}

.empty-state {
    text-align: center;
    padding: 50px;
    color: #999;
}
</style>