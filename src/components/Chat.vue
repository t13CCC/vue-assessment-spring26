<template>
    <div class="chat-page">
        <header class="header">
            <div class="header-left">
                <button class="back-btn" @click="goBack">← 返回好友列表</button>
                <img :src="friend?.avatar || '/src/assets/avator.png'" alt="头像" class="friend-avatar">
                <div class="friend-info">
                    <h3 class="friend-name">{{ friend?.name }}</h3>
                    <span class="friend-status">在线</span>
                </div>
            </div>
            <button class="menu-btn">⋮</button>
        </header>

        <!-- 消息列表 -->
        <div class="messages-container" ref="messagesContainer">
            <div v-for="msg in messages" :key="msg.id" :class="['message', msg.isMine ? 'mine' : 'friend']">
                <img :src="msg.isMine ? currentUserAvatar : friend?.avatar || '/src/assets/avator.png'" alt="头像" class="msg-avatar">
                <div class="msg-content">
                    <p class="msg-text">{{ msg.content }}</p>
                    <span class="msg-time">{{ formatTime(msg.time) }}</span>
                </div>
            </div>
        </div>

        <!-- 输入框 -->
        <div class="input-container">
            <input 
                type="text" 
                v-model="inputMessage" 
                placeholder="输入消息..." 
                class="message-input"
                @keyup.enter="sendMessage"
            >
            <button class="send-btn" @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 当前用户
const currentUserId = ref(1);
const currentUserAvatar = ref('/src/assets/avator.png');

// 好友信息
const friend = ref(null);

// 消息列表
const messages = ref([
    { id: 1, content: '你好！', isMine: false, time: Date.now() - 3600000 },
    { id: 2, content: '你好！有什么事吗？', isMine: true, time: Date.now() - 3500000 },
    { id: 3, content: '我想问问你家猫咪的情况', isMine: false, time: Date.now() - 3400000 },
    { id: 4, content: '好的呀，小橘很可爱的', isMine: true, time: Date.now() - 3300000 },
    { id: 5, content: '我想领养一只猫咪', isMine: false, time: Date.now() - 3200000 },
    { id: 6, content: '那太好了！我们可以约个时间见面看看', isMine: true, time: Date.now() - 3100000 }
]);

// 输入消息
const inputMessage = ref('');

// 消息容器引用
const messagesContainer = ref(null);

// 模拟好友数据
const friendsData = [
    { id: 2, name: '爱猫达人', avatar: '/src/assets/banMa/IMG_3972.PNG' },
    { id: 3, name: '狗狗控', avatar: '/src/assets/banMa/IMG_3973.PNG' },
    { id: 4, name: '小明', avatar: '/src/assets/banMa/IMG_3974.PNG' },
    { id: 5, name: '小红', avatar: '/src/assets/banMa/IMG_3975.PNG' },
    { id: 6, name: '张同事', avatar: '/src/assets/banMa/IMG_3980.PNG' },
    { id: 7, name: '李同事', avatar: '/src/assets/banMa/IMG_3982.PNG' }
];

// 获取好友信息
const getFriend = () => {
    const friendId = parseInt(route.params.friendId);
    friend.value = friendsData.find(f => f.id === friendId);
};

// 格式化时间
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 发送消息
const sendMessage = () => {
    if (!inputMessage.value.trim()) return;
    
    messages.value.push({
        id: Date.now(),
        content: inputMessage.value.trim(),
        isMine: true,
        time: Date.now()
    });
    
    inputMessage.value = '';
    
    // 自动滚动到底部
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
    
    // 模拟对方回复
    setTimeout(() => {
        const replies = [
            '好的，我知道了',
            '嗯嗯，没问题',
            '太棒了！',
            '我也觉得不错',
            '可以呀，什么时候方便？',
            '好的，那我们约个时间'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        messages.value.push({
            id: Date.now(),
            content: randomReply,
            isMine: false,
            time: Date.now()
        });
        
        nextTick(() => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
            }
        });
    }, 1500);
};

// 返回好友列表
const goBack = () => {
    router.push('/friends');
};

// 初始化
onMounted(() => {
    getFriend();
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
});
</script>

<style lang="scss" scoped>
.chat-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(135deg, #f0f7ff, #fff0f5);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: linear-gradient(to right, #65A3F0, #88c1ff);
    box-shadow: 0 2px 10px rgba(101, 163, 240, 0.3);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.back-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    padding: 8px 15px;
    border-radius: 15px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
}

.friend-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
}

.friend-info {
    display: flex;
    flex-direction: column;
}

.friend-name {
    margin: 0 0 2px 0;
    font-size: 16px;
    font-weight: bold;
    color: white;
}

.friend-status {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
}

.menu-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.message {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    
    &.friend {
        justify-content: flex-start;
        
        .msg-content {
            background: white;
            border-radius: 0 15px 15px 15px;
        }
    }
    
    &.mine {
        justify-content: flex-end;
        
        .msg-content {
            background: linear-gradient(to right, #65A3F0, #88c1ff);
            border-radius: 15px 0 15px 15px;
            
            .msg-text {
                color: white;
            }
            
            .msg-time {
                color: rgba(255, 255, 255, 0.8);
            }
        }
    }
}

.msg-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

.msg-content {
    max-width: 70%;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.msg-text {
    margin: 0 0 5px 0;
    font-size: 15px;
    line-height: 1.5;
    color: #333;
}

.msg-time {
    font-size: 12px;
    color: #999;
}

.input-container {
    display: flex;
    gap: 10px;
    padding: 15px 20px;
    background: white;
    border-top: 1px solid #eee;
}

.message-input {
    flex: 1;
    padding: 12px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 25px;
    font-size: 15px;
    outline: none;
    
    &:focus {
        border-color: #65A3F0;
    }
}

.send-btn {
    padding: 12px 25px;
    background: linear-gradient(to right, #65A3F0, #88c1ff);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 15px rgba(101, 163, 240, 0.4);
    }
}
</style>