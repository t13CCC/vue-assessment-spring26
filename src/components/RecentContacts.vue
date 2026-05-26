<template>
    <div class="content">
        <div v-if="loading" class="loading-state">
            <p>加载中...</p>
        </div>
        
        <div v-else-if="contacts.length === 0" class="empty-state">
            <p>暂无最近联系人</p>
        </div>
        
        <div v-else class="contacts-list">
            <div 
                v-for="contact in contacts" 
                :key="contact.friendId" 
                class="contact-card"
                @click="handleContactClick(contact.friendId)"
            >
                <div class="contact-header">
                    <img :src="contact.avatar || '/src/assets/avator.png'" alt="头像" class="contact-avatar">
                    <div class="contact-info">
                        <div class="contact-name-row">
                            <h4 class="contact-name">{{ contact.remark || contact.nickname }}</h4>
                            <span v-if="contact.unreadCount > 0" class="unread-badge">{{ contact.unreadCount }}</span>
                        </div>
                        <p class="contact-message">{{ contact.lastMessage }}</p>
                    </div>
                    <div class="contact-time">
                        <span>{{ formatTime(contact.timestamp) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPrivateChatContacts } from '@/api/friends';

const router = useRouter();

const contacts = ref([]);
const loading = ref(true);

// 加载最近联系人
const loadRecentContacts = async () => {
    try {
        loading.value = true;
        const res = await getPrivateChatContacts();
        if (res.code === '100000' && res.data) {
            contacts.value = res.data.map(contact => ({
                ...contact,
                expanded: false
            }));
        }
    } catch (error) {
        console.error('加载最近联系人失败:', error);
    } finally {
        loading.value = false;
    }
};

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

// 点击联系人进入聊天
const handleContactClick = (friendId) => {
    router.push(`/chat/${friendId}`);
};

// 组件挂载时加载数据
onMounted(() => {
    loadRecentContacts();
});
</script>

<style lang="scss" scoped>
.content {
    padding: 20px 30px;
}

.contacts-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.contact-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
}

.contact-header {
    display: flex;
    align-items: center;
    padding: 15px;
    cursor: pointer;
}

.contact-avatar {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
    border: 2px solid #f0f0f0;
}

.contact-info {
    flex: 1;
}

.contact-name-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
}

.contact-name {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.unread-badge {
    background: #ef4444;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 10px;
    min-width: 20px;
    text-align: center;
}

.contact-message {
    margin: 0;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.contact-time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
}

.contact-time span:first-child {
    font-size: 13px;
    color: #999;
}

.expand-icon {
    font-size: 12px;
    color: #999;
    transition: transform 0.3s ease;
}

.contact-expanded {
    background: #fafafa;
    padding: 15px;
    border-top: 1px solid #eee;
}

.conversation-preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
}

.message-bubble {
    max-width: 70%;
    padding: 10px 15px;
    border-radius: 15px;
    font-size: 14px;
    
    &.received {
        align-self: flex-start;
        background: white;
        border-radius: 15px 15px 15px 5px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    &.sent {
        align-self: flex-end;
        background: linear-gradient(to right, #f895c8, #ffd4eb);
        color: white;
        border-radius: 15px 15px 5px 15px;
    }
    
    p {
        margin: 0;
        word-break: break-word;
    }
    
    .message-time {
        display: block;
        font-size: 11px;
        margin-top: 5px;
        opacity: 0.7;
    }
}

.chat-now-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(to right, #f895c8, #ffd4eb);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }
}

.empty-state {
    text-align: center;
    padding: 50px;
    color: #999;
}
</style>