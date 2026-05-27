<template>
    <div class="content">
        <!-- 通知头部 -->
        <div class="notifications-header">
            <button v-if="notifications.length > 0" class="mark-all-btn" @click="$emit('mark-all-read')">
                全部标为已读
            </button>
        </div>

        <!-- 空状态 -->
        <div v-if="notifications.length === 0" class="empty-state">
            <p>暂无领养通知</p>
        </div>

        <!-- 通知列表 -->
        <div v-else class="notifications-list">
            <div 
                v-for="notification in notifications" 
                :key="notification.id" 
                :class="['notification-card', notification.isRead === 1 ? 'read' : 'unread']"
                @click="handleNotificationClick(notification)"
            >
                <!-- 通知图标 -->
                <div class="notification-icon">
                    <span v-if="notification.type === 'ADOPTION_APPLICATION'">📝</span>
                    <span v-else-if="notification.type === 'ADOPTION_APPROVED'">✅</span>
                    <span v-else-if="notification.type === 'ADOPTION_REJECTED'">❌</span>
                    <span v-else>🔔</span>
                </div>

                <!-- 通知内容 -->
                <div class="notification-content">
                    <h4 class="notification-title">{{ notification.title }}</h4>
                    <p class="notification-message">{{ notification.content }}</p>
                    <span class="notification-time">{{ formatTime(notification.createdTime) }}</span>
                </div>

                <!-- 已读标记 -->
                <div v-if="notification.isRead === 0" class="unread-dot"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    notifications: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['mark-as-read', 'mark-all-read']);

// 格式化时间
const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
};

// 点击通知
const handleNotificationClick = (notification) => {
    if (notification.isRead === 0) {
        emit('mark-as-read', notification.id);
    }
};
</script>

<style lang="scss" scoped>
.content {
    padding: 20px 30px;
}

.notifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.notifications-title {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.mark-all-btn {
    padding: 10px 20px;
    background: linear-gradient(to right, #f895c8, #ffd4eb);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(248, 149, 200, 0.4);
    }
}

.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.notification-card {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        transform: translateX(5px);
    }

    &.unread {
        background: linear-gradient(135deg, #fff5f8, #ffffff);
        border-left: 4px solid #f895c8;
    }

    &.read {
        opacity: 0.7;
    }
}

.notification-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 12px;
    font-size: 24px;
    flex-shrink: 0;
}

.notification-content {
    flex: 1;
    min-width: 0;
}

.notification-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.notification-message {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
}

.notification-time {
    font-size: 13px;
    color: #999;
}

.unread-dot {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
}

.empty-state {
    text-align: center;
    padding: 50px;
    color: #999;
}
</style>