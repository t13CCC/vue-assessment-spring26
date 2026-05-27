<template>
    <div class="chat-page">
        <header class="header">
            <div class="header-left">
                <button class="back-btn" @click="goBack">← 返回好友列表</button>
                <img :src="friend?.friendAvatar || '/src/assets/avator.png'" alt="头像" class="friend-avatar">
                <div class="friend-info">
                    <h3 class="friend-name">{{ friend?.friendName }}</h3>
                    <span class="friend-status">在线</span>
                </div>
            </div>
            <button class="menu-btn">⋮</button>
        </header>

        <!-- 消息列表 -->
        <div class="messages-container" ref="messagesContainer">
            <div v-if="loading" class="loading-messages">
                <p>加载消息中...</p>
            </div>
            <div v-else v-for="msg in messages" :key="msg.id" :class="['message', msg.isMine ? 'mine' : 'friend']">
                <img :src="msg.isMine ? currentUserAvatar : friend?.friendAvatar || '/src/assets/avator.png'" alt="头像" class="msg-avatar">
                <div class="msg-content">
                    <p class="msg-text">{{ msg.content }}</p>
                    <span class="msg-time">{{ formatTime(msg.time) }}</span>
                </div>
            </div>
            <div v-if="!loading && messages.length === 0" class="empty-messages">
                <p>开始与 {{ friend?.friendName }} 的聊天吧！</p>
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
            <button class="send-btn" @click="sendMessage" :disabled="sending">
                {{ sending ? '发送中...' : '发送' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getChatHistory, markChatAsRead, getFriends, sendPrivateMessage } from '@/api/friends';
import { initSocket, onMessage, offMessage } from '@/utils/socket';

const router = useRouter();
const route = useRoute();

// 当前用户
const currentUserId = ref(1);
const currentUserAvatar = ref('/src/assets/avator.png');

// WebSocket 消息处理函数 - CHAT 类型（后端定义的消息类型）
const handleChatMessage = (data) => {
  const { senderId, content } = data;
  const friendId = parseInt(route.params.friendId);
  
  // 如果是当前聊天对象发来的消息
  if (senderId === friendId) {
    messages.value.push({
      id: Date.now(),
      content,
      isMine: false,
      time: Date.now()
    });
    scrollToBottom();
  }
};

// 好友信息
const friend = ref(null);

// 消息列表
const messages = ref([]);

// 输入消息
const inputMessage = ref('');

// 加载状态
const loading = ref(false);
const sending = ref(false);

// 消息容器引用
const messagesContainer = ref(null);

// 获取好友信息
const getFriendInfo = async () => {
    try {
        const res = await getFriends();
        if (res.code === '100000' && res.data) {
            const friendId = parseInt(route.params.friendId);
            friend.value = res.data.find(f => f.friendId === friendId.toString());
        }
    } catch (error) {
        console.error('获取好友信息失败:', error);
    }
};

// 加载聊天记录
const loadChatHistory = async () => {
    try {
        loading.value = true;
        const friendId = parseInt(route.params.friendId);
        const res = await getChatHistory(friendId);
        if (res.code === '100000' && res.data?.messages) {
            // 转换消息格式
            messages.value = res.data.messages.map(msg => ({
                id: msg.id,
                content: msg.content,
                isMine: msg.senderId === currentUserId.value,
                time: msg.createdTime
            }));
        }
        else if (res.code === '10001') {
            alert(res.message || '参数错误');
        }
        else if (res.code === '50001') {
            alert(res.message || '目标用户不存在');
        }
        else if (res.code === '50008') {
            alert(res.message || '你们不是好友');
        }
    } catch (error) {
        console.error('加载聊天记录失败:', error);
    } finally {
        loading.value = false;
        scrollToBottom();
    }
};

// 格式化时间
const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 发送消息（使用 HTTP，后端会通过 WebSocket 推送给对方）
const sendMessage = async () => {
    if (!inputMessage.value.trim() || sending.value) return;
    
    const friendId = parseInt(route.params.friendId);
    const content = inputMessage.value.trim();
    
    sending.value = true;
    
    try {
        // 使用 HTTP API 发送消息（后端会持久化并通过 WebSocket 推送给对方）
        const res = await sendPrivateMessage(friendId, content);
        if (res.code === '100000') {
            messages.value.push({
                id: res.data?.id || Date.now(),
                content: res.data?.content || content,
                isMine: true,
                time: res.data?.createdTime || Date.now()
            });
            inputMessage.value = '';
            scrollToBottom();
        } else if (res.code === '10001') {
            alert(res.message || '参数错误');
        } else if (res.code === '20003') {
            alert(res.message || '账号或密码错误');
        } else if (res.code === '50001') {
            alert(res.message || '目标用户不存在');
        } else if (res.code === '50008') {
            alert(res.message || '你们不是好友');
        } else {
            alert(res.message || '发送失败，请重试');
        }
    } catch (error) {
        console.error('发送消息失败:', error);
        alert('发送失败，请重试');
    } finally {
        sending.value = false;
    }
};

// 滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

// 返回好友列表
const goBack = () => {
    router.push('/friends');
};

// 标记为已读
const markAsRead = async () => {
    try {
        const friendId = parseInt(route.params.friendId);
        const res = await markChatAsRead(friendId);
        if (res.code === '100000') {
            alert('标记成功');
        }   
        else if (res.code === '50001') {
            alert(res.message || '目标用户不存在');
        }
        else if (res.code === '50008') {
            alert(res.message || '你们不是好友');
        }
    } catch (error) {
        console.error('标记已读失败:', error);
    }
};

// 监听路由变化
watch(() => route.params.friendId, async () => {
    await getFriendInfo();
    await loadChatHistory();
    await markAsRead();
});

// 初始化
onMounted(async () => {
    // 初始化 WebSocket 连接
    initSocket();
    
    // 注册 CHAT 消息处理器（后端定义的消息类型）
    onMessage('CHAT', handleChatMessage);
    
    await getFriendInfo();
    await loadChatHistory();
    await markAsRead();
});

// 组件卸载时清理
onUnmounted(() => {
    // 取消消息监听
    offMessage('CHAT', handleChatMessage);
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