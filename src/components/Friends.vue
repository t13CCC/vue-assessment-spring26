<template>
    <div class="friends-page">
        <header class="header">
            <div class="header-left">
                <button class="home-btn" @click="goToHome">🏠 返回首页</button>
                <div class="logo"> 好友中心</div>
            </div>
            <!-- <div class="header-right">
                <button class="add-btn" @click="showFindModal = true">+ 发现好友</button>
            </div> -->
        </header>

        <!-- 选项卡 -->
        <div class="tabs">
            <button :class="['tab', activeTab === 'friends' ? 'active' : '']" @click="activeTab = 'friends'">
                好友列表 {{ friends.length }}
            </button>
            <button :class="['tab', activeTab === 'recent' ? 'active' : '']" @click="activeTab = 'recent'">
                最近联系人 {{ recentContacts.length }}
            </button>
            <button :class="['tab', activeTab === 'requests' ? 'active' : '']" @click="activeTab = 'requests'">
                好友申请 {{ receivedRequests.length}}
            </button>
            <button :class="['tab', activeTab === 'notifications' ? 'active' : '']" @click="activeTab = 'notifications'">
                好友领养 {{ unreadNotificationCount }}
            </button>
        </div>

        <!-- 好友列表 -->
        <FriendsList 
            v-if="activeTab === 'friends'"
            :friends="friends"
            :groups="friendGroups"
            @chat="goToChat"
            @delete="deleteFriend"
            @change-group="showGroupModal"
            @create-group="showCreateGroupModal = true"
        />

        <!-- 最近联系人 -->
        <RecentContacts 
            v-if="activeTab === 'recent'"
            :contacts="recentContacts"
            @chat="goToChat"
        />

        <!-- 好友申请 -->
        <FriendRequests 
            v-if="activeTab === 'requests'"
            :received-requests="receivedRequests"
            :sent-requests="sentRequests"
            @accept-request="acceptRequest"
            @reject-request="rejectRequest"
        />

        <!-- 领养通知 -->
        <AdoptionNotifications 
            v-if="activeTab === 'notifications'"
            :notifications="notifications"
            @mark-as-read="handleMarkNotificationAsRead"
            @mark-all-read="handleMarkAllRead"
        />

        <!-- 分组选择弹窗 -->
        <div v-if="showGroupSelectModal" class="modal-overlay" @click.self="showGroupSelectModal = false">
            <div class="modal-content">
                <h3>选择分组</h3>
                <select v-model="selectedFriendGroup" class="modal-select">
                    <option value="">未分组</option>
                    <option v-for="group in friendGroups" :key="group.id" :value="group.id">
                        {{ group.groupName }}
                    </option>
                </select>
                <div class="modal-actions">
                    <button class="modal-btn cancel" @click="showGroupSelectModal = false">取消</button>
                    <button class="modal-btn confirm" @click="saveFriendGroup">确定</button>
                </div>
            </div>
        </div>

        <!-- 创建分组弹窗 -->
        <div v-if="showCreateGroupModal" class="modal-overlay" @click.self="showCreateGroupModal = false">
            <div class="modal-content">
                <h3>创建分组</h3>
                <input type="text" v-model="newGroupName" placeholder="分组名称" class="modal-input">
                <div class="modal-actions">
                    <button class="modal-btn cancel" @click="showCreateGroupModal = false">取消</button>
                    <button class="modal-btn confirm" @click="createGroup">创建</button>
                </div>
            </div>
        </div>
 
        <!-- 发现好友弹窗（后端未提供接口，暂注释）
        <div v-if="showFindModal" class="modal-overlay" @click.self="showFindModal = false">
            <div class="find-modal-content">
                <div class="find-modal-header">
                    <h3>🔍 发现好友</h3>
                    <button class="close-btn" @click="showFindModal = false">×</button>
                </div>
                <div class="find-search-box">
                    <input type="text" v-model="findKeyword" placeholder="搜索用户名..." class="find-input">
                    <button @click="searchUsers" class="find-search-btn">搜索</button>
                </div>
                <div class="find-users-list">
                    <div v-for="user in filteredUsers" :key="user.id" class="find-user-item">
                        <img :src="user.avatar || '/src/assets/avator.png'" alt="头像" class="find-avatar">
                        <div class="find-user-info">
                            <span class="find-user-name">{{ user.name }}</span>
                            <span class="find-user-status">{{ isFriend(user.id) ? '已成为好友' : '未添加' }}</span>
                        </div>
                        <button 
                            v-if="!isFriend(user.id) && !hasPendingRequest(user.id)" 
                            class="find-add-btn" 
                            @click="handleFindAdd(user.id)"
                        >
                            + 添加
                        </button>
                        <button v-else-if="hasPendingRequest(user.id)" class="find-pending-btn">
                            等待验证
                        </button>
                        <button v-else class="find-already-btn">
                            已添加
                        </button>
                    </div>
                    <div v-if="filteredUsers.length === 0 && findKeyword" class="find-empty">
                        <p>未找到用户</p>
                    </div>
                    <div v-if="!findKeyword" class="find-recommend">
                        <p>推荐用户</p>
                        <div v-for="user in recommendUsers" :key="user.id" class="find-user-item">
                            <img :src="user.avatar || '/src/assets/avator.png'" alt="头像" class="find-avatar">
                            <div class="find-user-info">
                                <span class="find-user-name">{{ user.name }}</span>
                                <span class="find-user-status">推荐</span>
                            </div>
                            <button 
                                v-if="!isFriend(user.id) && !hasPendingRequest(user.id)" 
                                class="find-add-btn" 
                                @click="handleFindAdd(user.id)"
                            >
                                + 添加
                            </button>
                            <button v-else-if="hasPendingRequest(user.id)" class="find-pending-btn">
                                等待验证
                            </button>
                            <button v-else class="find-already-btn">
                                已添加
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  getFriendGroup,
  addFriendGroup,
  deleteFriendGroup,
  updateFriendGroup,
  getFriends,
  removeFriend,
  moveFriendToGroup,
  getReceivedFriendRequests,
  getSentFriendRequests,
  respondToFriendRequest,
  applyFriendRequest,
  getPrivateChatContacts,
  getNotifications,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  markNotificationAsRead
} from '@/api/friends';
import FriendsList from './FriendsList.vue';
import RecentContacts from './RecentContacts.vue';
import FriendRequests from './FriendRequests.vue';
import AdoptionNotifications from './AdoptionNotifications.vue';

const router = useRouter();

// 当前用户（从localStorage获取）
const currentUserId = ref(parseInt(localStorage.getItem('userId') || '1'));

// 选项卡
const activeTab = ref('friends');

// 分组选择弹窗
const showGroupSelectModal = ref(false);
const selectedFriendGroup = ref('');
const currentFriendForGroup = ref(null);

// 创建分组弹窗
const showCreateGroupModal = ref(false);
const newGroupName = ref('');

// 发现好友弹窗（后端未提供接口，暂注释）
// const showFindModal = ref(false);
// const findKeyword = ref('');

// 好友分组
const friendGroups = ref([]);

// 好友列表
const friends = ref([]);

// 收到的好友申请
const receivedRequests = ref([]);

// 发出的好友申请
const sentRequests = ref([]);

// 可添加的用户（后端未提供接口，暂注释）
// const allUsers = ref([]);

// 通知列表
const notifications = ref([]);

// 未读通知数量
const unreadNotificationCount = ref(0);

// 最近联系人
const recentContacts = ref([]);

// 加载数据
const loadData = async () => {
    try {
        // 加载好友分组
        const groupRes = await getFriendGroup();
        if (groupRes.data && groupRes.code === '100000') {
            friendGroups.value = groupRes.data;
            console.log(friendGroups.value);
        }
        else if (groupRes.code === '10002') {
            console.error('用户未登录或登录已过期', groupRes.message);
        }
        
        // 加载好友列表
        const friendsRes = await getFriends();
        if (friendsRes.data && friendsRes.code === '100000') {
            friends.value = friendsRes.data;
            console.log(friends.value);
        }
        else if (friendsRes.code === '50006') {
            console.error('好友分组不存在', friendsRes.message);
        }    
        else if (friendsRes.code === '10002') {
            console.error('用户未登录或登录已过期', friendsRes.message);
        }

        
        // 加载收到的好友申请
        const receivedRes = await getReceivedFriendRequests();
        if (receivedRes.data && receivedRes.code === '100000') {
            receivedRequests.value = receivedRes.data;
        }
        else if (receivedRes.code === '10002') {
            console.error('用户未登录或登录已过期', receivedRes.message);
        }

        // 加载发出的好友申请
        const sentRes = await getSentFriendRequests();
        if (sentRes.data && sentRes.code === '100000') {
            sentRequests.value = sentRes.data;
        }
        else if (sentRes.code === '10002') {
            console.error('用户未登录或登录已过期', sentRes.message);
        }

        
        // 加载最近联系人
        await loadRecentContacts();
        
        // 加载通知
        await loadNotifications();
        
        // 加载未读通知数量
        await loadUnreadNotificationCount();
    } catch (error) {
        console.error('加载数据失败:', error);
    }
};

// 加载通知
const loadNotifications = async () => {
    try {
        const res = await getNotifications();
        if (res.code === '100000' && res.data) {
            notifications.value = res.data;
        }
        else if (res.code === '10002') {
            console.error('用户未登录或登录已过期', res.message);
        }
    } catch (error) {
        console.error('加载通知失败:', error);
    }
};

// 加载最近联系人
const loadRecentContacts = async () => {
    try {
        const res = await getPrivateChatContacts();
        if (res.code === '100000' && res.data) {
            recentContacts.value = res.data;
        }
        else if (res.code === '10002') {
            console.error('用户未登录或登录已过期', res.message);
        }
    } catch (error) {
        console.error('加载最近联系人失败:', error);
    }
};

// 加载最近联系人
const loadRecentContacts = async () => {
    try {
        const res = await getPrivateChatContacts();
        if (res.code === '100000' && res.data) {
            recentContacts.value = res.data;
        }
        else if (res.code === '10002') {
            console.error('用户未登录或登录已过期', res.message);
        }
    } catch (error) {
        console.error('加载最近联系人失败:', error);
    }
};

// 加载未读通知数量
const loadUnreadNotificationCount = async () => {
    try {
        const res = await getUnreadNotificationCount();
        if (res.code === '100000' && res.data !== undefined) {
            unreadNotificationCount.value = res.data;
        }
        else if (res.code === '10002') {
            console.error('用户未登录或登录已过期', res.message);
        }
    } catch (error) {
        console.error('获取未读通知数量失败:', error);
    }
};

// 组件挂载时加载数据
onMounted(() => {
    loadData();
});

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

// 跳转到首页
const goToHome = () => {
    router.push('/');
};

// 跳转到聊天
const goToChat = (friendId) => {
    router.push(`/chat/${friendId}`);
};

// 处理发送请求
const handleSendRequest = async (userId) => {
    try {
        const res = await applyFriendRequest('想加你为好友', userId);
        if (res.code === '100000') {
            alert('好友请求已发送！');
            await loadData();
        } else {
            alert(res.message || '发送失败');
        }
    } catch (error) {
        console.error('发送好友请求失败:', error);
        alert('发送失败');
    }
};

// 同意好友请求
const acceptRequest = async (requestId) => {
    try {
        const res = await respondToFriendRequest(requestId, 1);
        if (res.code === '100000') {
            alert('已同意好友请求！');
            await loadData();
        }
        else if (res.code === '10001') {
            alert(res.message || '参数错误');
        }
        else if (res.code === '50005') {
            alert(res.message || '好友申请记录不存在或已处理');
        }
        
    } catch (error) {
        console.error('同意好友请求失败:', error);
        alert('操作失败');
    }
};

// 拒绝好友请求
const rejectRequest = async (requestId) => {
    try {
        const res = await respondToFriendRequest(requestId, 2);
        if (res.code === '100000') {
            alert('已拒绝好友请求');
            await loadData();
        }
        else if (res.code === '10001') {
            alert(res.message || '参数错误');
        }
        else if (res.code === '50005') {
            alert(res.message || '好友申请记录不存在或已处理');
        }
    } catch (error) {
        console.error('拒绝好友请求失败:', error);
        alert('操作失败');
    }
};

// 显示分组弹窗
const showGroupModal = (friend) => {
    currentFriendForGroup.value = friend;
    selectedFriendGroup.value = friend.groupId?.toString() || '';
    showGroupSelectModal.value = true;
};

// 保存好友分组
const saveFriendGroup = async () => {
    if (currentFriendForGroup.value) {
        try {
            const groupId = selectedFriendGroup.value ? parseInt(selectedFriendGroup.value) : null;
            const res = await moveFriendToGroup(currentFriendForGroup.value.friendId, groupId);
            if (res.code === '100000') {
                currentFriendForGroup.value.groupId = groupId;
                alert('分组修改成功！');
            } 
            else if (res.code === '50001') {
                alert(res.message || '目标用户不存在');
            }
            else if (res.code === '50006') {
                alert(res.message || '好友分组不存在');
            }
            else if (res.code === '50008') {
                alert(res.message || '你们不是好友');
            }
        } catch (error) {
            console.error('修改分组失败:', error);
            alert('修改失败');
        }
    }
    showGroupSelectModal.value = false;
};

// 创建分组
const createGroup = async () => {
    if (!newGroupName.value.trim()) {
        alert('请输入分组名称');
        return;
    }
    try {
        const res = await addFriendGroup(newGroupName.value.trim());
        if (res.code === '100000' && res.data) {
            friendGroups.value.push(res.data);
            newGroupName.value = '';
            showCreateGroupModal.value = false;
            alert('分组创建成功！');
        } 
        else if (res.code === '10001') {
            alert(res.message || '参数错误');
        }
        else if (res.code === '50007') {
            alert(res.message || '分组名称已存在');
        }

    } catch (error) {
        console.error('创建分组失败:', error);
        alert('创建失败');
    }
};

// 标记所有通知为已读
const handleMarkAllRead = async () => {
    try {
        const res = await markAllNotificationsAsRead();
        if (res.code === '100000') {
            // 更新本地通知状态
            notifications.value.forEach(notification => {
                notification.isRead = 1;
            });
            unreadNotificationCount.value = 0;
        } else if (res.code === '10002') {
            console.error('用户未登录或登录已过期', res.message);
        }
    } catch (error) {
        console.error('标记全部已读失败:', error);
    }
};

// 标记单条通知为已读
const handleMarkNotificationAsRead = async (notificationId) => {
    try {
        const res = await markNotificationAsRead(notificationId);
            if (res.code === '100000') {
            // 更新本地通知状态
            const notification = notifications.value.find(n => n.id === notificationId);
            if (notification) {
                notification.isRead = 1;
                // 更新未读数量
                if (unreadNotificationCount.value > 0) {
                    unreadNotificationCount.value--;
                }
            }
        } else if (res.code === '10002') {
            console.error('用户未登录或登录已过期', res.message);
        }
    } catch (error) {
        console.error('标记通知为已读失败:', error);
    }
};

// 删除好友
const deleteFriend = async (friendId) => {
    if (confirm('确定要删除这位好友吗？')) {
        try {
            const res = await removeFriend(friendId);
            if (res.code === '100000') {
                const index = friends.value.findIndex(f => f.friendId === friendId.toString());
                if (index !== -1) {
                    friends.value.splice(index, 1);
                }
                alert('已删除好友');
            }
            else if (res.code === '50001') {
                alert(res.message || '目标用户不存在');
            }
            else if (res.code === '50008') {
                alert(res.message || '你们不是好友');
            }
        } catch (error) {
            console.error('删除好友失败:', error);
            alert('删除失败');
        }
    }
};

// 搜索用户（后端未提供接口，暂注释）
// const filteredUsers = computed(() => {
//     if (!findKeyword.value) return [];
//     const keyword = findKeyword.value.toLowerCase();
//     return allUsers.value.filter(user => 
//         user.id !== currentUserId.value && 
//         user.name.toLowerCase().includes(keyword)
//     );
// });
// 
// // 推荐用户
// const recommendUsers = computed(() => {
//     return allUsers.value.filter(user => 
//         user.id !== currentUserId.value && 
//         !friends.value.some(f => f.friendId === user.id.toString())
//     ).slice(0, 5);
// });
// 
// // 是否是好友
// const isFriend = (userId) => {
//     return friends.value.some(friend => friend.friendId === userId.toString());
// };
// 
// // 是否有待处理的请求
// const hasPendingRequest = (userId) => {
//     return sentRequests.value.some(req => req.targetId === userId);
// };
// 
// // 搜索用户
// const searchUsers = () => {
//     // 搜索逻辑已通过computed实现
// };
// 
// // 处理发现好友中的添加
// const handleFindAdd = async (userId) => {
//     try {
//         const res = await applyFriendRequest('想加你为好友', userId);
//         if (res.code === '100000') {
//             alert('好友请求已发送！');
//             await loadData();
//         }
//         else if (res.code === '10001') {
//             alert(res.message || '参数错误');
//         }
//         else if (res.code === '50001') {
//             alert(res.message || '目标用户不存在');
//         }
//         else if (res.code === '50002') {
//             alert(res.message || '不能添加自己为好友');
//         }
//         else if (res.code === '50003') {
//             alert(res.message || '你们已经是好友了');
//         }
//         else if (res.code === '50004') {
//             alert(res.message || '已发送过申请，请勿重复发送');
//         }
// 
//     } catch (error) {
//         console.error('发送好友请求失败:', error);
//         alert('发送失败');
//     }
// };
</script>

<style lang="scss" scoped>
.friends-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #fff0f5, #f0f7ff);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: linear-gradient(to right, #f895c8, #ffd4eb, #cbe4ff);
    box-shadow: 0 2px 15px rgba(248, 149, 200, 0.3);
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

.header-right {
    display: flex;
    gap: 10px;
}


.add-btn {
    background: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    color: #f895c8;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        background: #fff0f5;
        transform: scale(1.05);
    }
}

.tabs {
    display: flex;
    gap: 10px;
    padding: 15px 30px;
    background: white;
    border-bottom: 1px solid #eee;
}

.tab {
    padding: 10px 20px;
    border: none;
    background: transparent;
    border-radius: 20px;
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

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 20px;
    width: 400px;
    max-width: 90%;
}

.modal-content h3 {
    margin: 0 0 20px 0;
    font-size: 20px;
    text-align: center;
    color: #333;
}

.modal-input, .modal-select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
    margin-bottom: 20px;
    
    &:focus {
        border-color: #f895c8;
    }
}

.modal-actions {
    display: flex;
    gap: 15px;
}

.modal-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    
    &.cancel {
        background: #f1f5f9;
        color: #64748b;
    }
    
    &.confirm {
        background: linear-gradient(to right, #f895c8, #ffd4eb);
        color: white;
    }
    
    &:hover {
        opacity: 0.9;
    }
}

/* 发现好友弹窗样式（后端未提供接口，暂注释）
.find-modal-content {
    background: white;
    border-radius: 20px;
    width: 500px;
    max-width: 90%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.find-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: linear-gradient(to right, #f895c8, #ffd4eb);
    
    h3 {
        margin: 0;
        color: white;
        font-size: 18px;
    }
}

.close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
}

.find-search-box {
    display: flex;
    gap: 10px;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
}

.find-input {
    flex: 1;
    padding: 10px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 25px;
    font-size: 14px;
    outline: none;
    
    &:focus {
        border-color: #f895c8;
    }
}

.find-search-btn {
    padding: 10px 20px;
    background: linear-gradient(to right, #f895c8, #ffd4eb);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
}

.find-users-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

.find-user-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 12px;
    transition: background 0.3s;
    
    &:hover {
        background: #f8fafc;
    }
}

.find-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 12px;
}

.find-user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.find-user-name {
    font-size: 15px;
    font-weight: bold;
    color: #333;
}

.find-user-status {
    font-size: 12px;
    color: #999;
}

.find-add-btn {
    padding: 8px 15px;
    background: linear-gradient(to right, #f895c8, #ffd4eb);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    
    &:hover {
        opacity: 0.9;
    }
}

.find-pending-btn, .find-already-btn {
    padding: 8px 15px;
    background: #f1f5f9;
    color: #64748b;
    border: none;
    border-radius: 20px;
    font-size: 13px;
    cursor: not-allowed;
}

.find-empty {
    text-align: center;
    padding: 30px;
    color: #999;
}

.find-recommend {
    p {
        font-size: 13px;
        color: #999;
        margin: 10px 0;
        padding-left: 12px;
    }
}
*/
</style>