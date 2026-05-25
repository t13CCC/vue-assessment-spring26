<template>
    <div class="friends-page">
        <header class="header">
            <div class="header-left">
                <button class="home-btn" @click="goToHome">🏠 返回首页</button>
                <div class="logo">🐾 好友中心</div>
            </div>
            <button class="add-btn" @click="showAddModal = true">+ 添加好友</button>
        </header>

        <!-- 选项卡 -->
        <div class="tabs">
            <button :class="['tab', activeTab === 'friends' ? 'active' : '']" @click="activeTab = 'friends'">
                好友列表 {{ friends.length }}
            </button>
            <button :class="['tab', activeTab === 'groups' ? 'active' : '']" @click="activeTab = 'groups'">
                好友分组
            </button>
            <button :class="['tab', activeTab === 'requests' ? 'active' : '']" @click="activeTab = 'requests'">
                好友申请 {{ pendingRequests.length }}
            </button>
            <button :class="['tab', activeTab === 'find' ? 'active' : '']" @click="activeTab = 'find'">
                发现好友
            </button>
        </div>

        <!-- 好友列表 -->
        <div v-if="activeTab === 'friends'" class="content">
            <!-- 分组筛选 -->
            <div class="group-filter">
                <select v-model="selectedGroup" class="filter-select">
                    <option value="">全部好友</option>
                    <option v-for="group in friendGroups" :key="group.id" :value="group.id">
                        {{ group.name }} ({{ getFriendsInGroup(group.id).length }})
                    </option>
                </select>
            </div>
            
            <!-- 好友列表 -->
            <div class="friends-list">
                <div v-for="friend in filteredFriends" :key="friend.friendId" class="friend-card">
                    <img :src="friend.avatar || '/src/assets/avator.png'" alt="头像" class="friend-avatar">
                    <div class="friend-info">
                        <h3 class="friend-name">{{ friend.remark || friend.nickname }}</h3>
                        <p class="friend-group">{{ getGroupName(friend.groupId) }}</p>
                    </div>
                    <div class="friend-actions">
                        <button class="action-btn chat-btn" @click="goToChat(friend.friendId)">💬 聊天</button>
                        <button class="action-btn group-btn" @click="showGroupModal(friend)">📁 分组</button>
                        <button class="action-btn delete-btn" @click="deleteFriend(friend.friendId)">🗑️ 删除</button>
                    </div>
                </div>
            </div>
            
            <div v-if="filteredFriends.length === 0" class="empty-state">
                <p>暂无好友</p>
            </div>
        </div>

        <!-- 好友分组 -->
        <div v-if="activeTab === 'groups'" class="content">
            <div class="groups-list">
                <div v-for="group in friendGroups" :key="group.id" class="group-card">
                    <div class="group-header">
                        <h3 class="group-name">{{ group.name }}</h3>
                        <button class="edit-group-btn" @click="editGroup(group)">✏️</button>
                    </div>
                    <p class="group-count">成员数量：{{ getFriendsInGroup(group.id).length }}</p>
                    <div class="group-friends">
                        <div v-for="friend in getFriendsInGroup(group.id)" :key="friend.friendId" class="mini-friend">
                            <img :src="friend.avatar || '/src/assets/avator.png'" alt="头像" class="mini-avatar">
                            <span class="mini-name">{{ friend.remark || friend.nickname }}</span>
                        </div>
                        <div v-if="getFriendsInGroup(group.id).length === 0" class="no-friends">
                            暂无成员
                        </div>
                    </div>
                </div>
            </div>
            <button class="add-group-btn" @click="showCreateGroupModal = true">+ 创建新分组</button>
        </div>

        <!-- 好友申请 -->
        <div v-if="activeTab === 'requests'" class="content">
            <div v-if="pendingRequests.length === 0" class="empty-state">
                <p>暂无好友申请</p>
            </div>
            <div v-else class="requests-list">
                <div v-for="request in pendingRequests" :key="request.id" class="request-card">
                    <img :src="request.from.avatar || '/src/assets/avator.png'" alt="头像" class="request-avatar">
                    <div class="request-info">
                        <h3 class="request-name">{{ request.from.name }}</h3>
                        <p class="request-time">{{ formatTime(request.time) }}</p>
                    </div>
                    <div class="request-actions">
                        <button class="accept-btn" @click="acceptRequest(request.id)">同意</button>
                        <button class="reject-btn" @click="rejectRequest(request.id)">拒绝</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 发现好友 -->
        <div v-if="activeTab === 'find'" class="content">
            <div class="search-box">
                <input type="text" v-model="searchKeyword" placeholder="搜索用户名..." class="search-input">
                <button @click="searchUsers" class="search-btn">搜索</button>
            </div>
            <div class="users-list">
                <div v-for="user in searchResults" :key="user.id" class="user-card">
                    <img :src="user.avatar || '/src/assets/avator.png'" alt="头像" class="user-avatar">
                    <div class="user-info">
                        <h3 class="user-name">{{ user.name }}</h3>
                        <p class="user-status">{{ isFriend(user.id) ? '已成为好友' : '未添加' }}</p>
                    </div>
                    <button 
                        v-if="!isFriend(user.id) && !hasPendingRequest(user.id)" 
                        class="add-friend-btn" 
                        @click="sendFriendRequest(user.id)"
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
        </div>

        <!-- 添加好友弹窗 -->
        <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
            <div class="modal-content">
                <h3>添加好友</h3>
                <input type="text" v-model="addFriendInput" placeholder="输入用户名" class="modal-input">
                <div class="modal-actions">
                    <button class="modal-btn cancel" @click="showAddModal = false">取消</button>
                    <button class="modal-btn confirm" @click="sendFriendRequestByName">发送请求</button>
                </div>
            </div>
        </div>

        <!-- 分组选择弹窗 -->
        <div v-if="showGroupSelectModal" class="modal-overlay" @click.self="showGroupSelectModal = false">
            <div class="modal-content">
                <h3>选择分组</h3>
                <select v-model="selectedFriendGroup" class="modal-select">
                    <option value="">未分组</option>
                    <option v-for="group in friendGroups" :key="group.id" :value="group.id">
                        {{ group.name }}
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
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 当前用户
const currentUserId = ref(1);

// 选项卡
const activeTab = ref('friends');

// 添加好友弹窗
const showAddModal = ref(false);
const addFriendInput = ref('');

// 分组选择弹窗
const showGroupSelectModal = ref(false);
const selectedFriendGroup = ref('');
const currentFriendForGroup = ref(null);

// 创建分组弹窗
const showCreateGroupModal = ref(false);
const newGroupName = ref('');

// 搜索关键词
const searchKeyword = ref('');

// 选中的分组
const selectedGroup = ref('');

// 好友分组
const friendGroups = ref([
    { id: 1, name: '宠物爱好者' },
    { id: 2, name: '好友' },
    { id: 3, name: '同事' }
]);

// 好友列表
const friends = ref([
    { friendId: '2', nickname: '爱猫达人', avatar: '/src/assets/banMa/IMG_3972.PNG', groupId: 1, remark: '', createdTime: '2024-01-15T10:30:00', updatedTime: '2024-01-15T10:30:00', message: '', timestamp: Date.now() },
    { friendId: '3', nickname: '狗狗控', avatar: '/src/assets/banMa/IMG_3973.PNG', groupId: 1, remark: '好友A', createdTime: '2024-02-20T14:20:00', updatedTime: '2024-02-20T14:20:00', message: '', timestamp: Date.now() },
    { friendId: '4', nickname: '小明', avatar: '/src/assets/banMa/IMG_3974.PNG', groupId: 2, remark: '', createdTime: '2024-03-05T09:15:00', updatedTime: '2024-03-05T09:15:00', message: '', timestamp: Date.now() },
    { friendId: '5', nickname: '小红', avatar: '/src/assets/banMa/IMG_3975.PNG', groupId: 2, remark: '闺蜜', createdTime: '2024-01-10T16:45:00', updatedTime: '2024-01-10T16:45:00', message: '', timestamp: Date.now() },
    { friendId: '6', nickname: '张同事', avatar: '/src/assets/banMa/IMG_3980.PNG', groupId: 3, remark: '', createdTime: '2024-04-01T08:30:00', updatedTime: '2024-04-01T08:30:00', message: '', timestamp: Date.now() },
    { friendId: '7', nickname: '李同事', avatar: '/src/assets/banMa/IMG_3982.PNG', groupId: 3, remark: '项目负责人', createdTime: '2024-04-15T11:00:00', updatedTime: '2024-04-15T11:00:00', message: '', timestamp: Date.now() }
]);

// 好友申请
const pendingRequests = ref([
    { id: 1, from: { id: 8, name: '新用户A', avatar: '' }, time: Date.now() - 3600000 },
    { id: 2, from: { id: 9, name: '宠物爱好者B', avatar: '/src/assets/banMa/IMG_3983.PNG' }, time: Date.now() - 7200000 }
]);

// 可添加的用户
const allUsers = ref([
    { id: 2, name: '爱猫达人', avatar: '/src/assets/banMa/IMG_3972.PNG' },
    { id: 3, name: '狗狗控', avatar: '/src/assets/banMa/IMG_3973.PNG' },
    { id: 4, name: '小明', avatar: '/src/assets/banMa/IMG_3974.PNG' },
    { id: 8, name: '新用户A', avatar: '' },
    { id: 9, name: '宠物爱好者B', avatar: '/src/assets/banMa/IMG_3983.PNG' },
    { id: 10, name: '兔子爱好者', avatar: '/src/assets/banMa/IMG_4020.PNG' },
    { id: 11, name: '仓鼠达人', avatar: '/src/assets/banMa/IMG_4021.PNG' }
]);

// 搜索结果
const searchResults = computed(() => {
    if (!searchKeyword.value) return [];
    const keyword = searchKeyword.value.toLowerCase();
    return allUsers.value.filter(user => 
        user.id !== currentUserId.value && 
        user.name.toLowerCase().includes(keyword)
    );
});

// 筛选后的好友列表
const filteredFriends = computed(() => {
    if (!selectedGroup.value) return friends.value;
    return friends.value.filter(friend => friend.groupId === parseInt(selectedGroup.value));
});

// 获取分组名称
const getGroupName = (groupId) => {
    if (!groupId) return '未分组';
    const group = friendGroups.value.find(g => g.id === groupId);
    return group ? group.name : '未分组';
};

// 获取分组中的好友
const getFriendsInGroup = (groupId) => {
    return friends.value.filter(friend => friend.groupId === groupId);
};

// 是否是好友
const isFriend = (userId) => {
    return friends.value.some(friend => friend.friendId === userId.toString());
};

// 是否有待处理的请求
const hasPendingRequest = (userId) => {
    return pendingRequests.value.some(req => req.from.id === userId);
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

// 跳转到首页
const goToHome = () => {
    router.push('/');
};

// 跳转到聊天
const goToChat = (friendId) => {
    router.push(`/chat/${friendId}`);
};

// 发送好友请求
const sendFriendRequest = (userId) => {
    const user = allUsers.value.find(u => u.id === userId);
    if (user) {
        pendingRequests.value.push({
            id: Date.now(),
            from: user,
            time: Date.now()
        });
        alert(`已向 ${user.name} 发送好友请求！`);
    }
};

// 通过用户名发送请求
const sendFriendRequestByName = () => {
    const user = allUsers.value.find(u => 
        u.name === addFriendInput.value && u.id !== currentUserId.value
    );
    if (user) {
        if (isFriend(user.id)) {
            alert('该用户已是您的好友');
            return;
        }
        if (hasPendingRequest(user.id)) {
            alert('已发送过好友请求');
            return;
        }
        pendingRequests.value.push({
            id: Date.now(),
            from: user,
            time: Date.now()
        });
        alert(`已向 ${user.name} 发送好友请求！`);
        showAddModal.value = false;
        addFriendInput.value = '';
    } else {
        alert('未找到该用户');
    }
};

// 同意好友请求
const acceptRequest = (requestId) => {
    const requestIndex = pendingRequests.value.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
        const request = pendingRequests.value[requestIndex];
        friends.value.push({
            friendId: request.from.id.toString(),
            nickname: request.from.name,
            avatar: request.from.avatar,
            groupId: null,
            remark: '',
            createdTime: new Date().toISOString(),
            updatedTime: new Date().toISOString(),
            message: '',
            timestamp: Date.now()
        });
        pendingRequests.value.splice(requestIndex, 1);
        alert(`已同意 ${request.from.name} 的好友请求！`);
    }
};

// 拒绝好友请求
const rejectRequest = (requestId) => {
    const index = pendingRequests.value.findIndex(r => r.id === requestId);
    if (index !== -1) {
        pendingRequests.value.splice(index, 1);
        alert('已拒绝好友请求');
    }
};

// 显示分组弹窗
const showGroupModal = (friend) => {
    currentFriendForGroup.value = friend;
    selectedFriendGroup.value = friend.groupId?.toString() || '';
    showGroupSelectModal.value = true;
};

// 保存好友分组
const saveFriendGroup = () => {
    if (currentFriendForGroup.value) {
        currentFriendForGroup.value.groupId = selectedFriendGroup.value ? parseInt(selectedFriendGroup.value) : null;
        alert('分组修改成功！');
    }
    showGroupSelectModal.value = false;
};

// 创建分组
const createGroup = () => {
    if (!newGroupName.value.trim()) {
        alert('请输入分组名称');
        return;
    }
    friendGroups.value.push({
        id: Date.now(),
        name: newGroupName.value.trim()
    });
    newGroupName.value = '';
    showCreateGroupModal.value = false;
    alert('分组创建成功！');
};

// 编辑分组
const editGroup = (group) => {
    const newName = prompt('请输入新的分组名称', group.name);
    if (newName && newName.trim()) {
        group.name = newName.trim();
    }
};

// 删除好友
const deleteFriend = (friendId) => {
    if (confirm('确定要删除这位好友吗？')) {
        const index = friends.value.findIndex(f => f.friendId === friendId.toString());
        if (index !== -1) {
            friends.value.splice(index, 1);
            alert('已删除好友');
        }
    }
};

// 搜索用户
const searchUsers = () => {
    // 搜索逻辑已通过computed实现
};
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

.content {
    padding: 20px 30px;
}

.group-filter {
    margin-bottom: 20px;
}

.filter-select {
    padding: 10px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    cursor: pointer;
}

.friends-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.friend-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 25px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #65A3F0, #f895c8, #88c1ff);
    }
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 30px rgba(101, 163, 240, 0.15);
    }
}

.friend-avatar {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
    border: 4px solid #f0f4f8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    .friend-card:hover & {
        transform: scale(1.05);
        border-color: #65A3F0;
    }
}

.friend-info {
    text-align: center;
    margin-bottom: 20px;
    width: 100%;
}

.friend-name {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    letter-spacing: 0.5px;
}

.friend-group {
    display: inline-block;
    padding: 4px 12px;
    background: linear-gradient(135deg, #e0f2fe, #fce7f3);
    border-radius: 20px;
    font-size: 12px;
    color: #64748b;
}

.friend-actions {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: center;
}

.action-btn {
    flex: 1;
    padding: 10px 12px;
    border: none;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    
    &.chat-btn {
        background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        color: #1d4ed8;
        
        &:hover {
            background: linear-gradient(135deg, #93c5fd, #60a5fa);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(30, 77, 237, 0.3);
        }
    }
    
    &.group-btn {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        color: #d97706;
        
        &:hover {
            background: linear-gradient(135deg, #fcd34d, #f59e0b);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
        }
    }
    
    &.delete-btn {
        background: linear-gradient(135deg, #fee2e2, #fecaca);
        color: #dc2626;
        
        &:hover {
            background: linear-gradient(135deg, #fca5a5, #ef4444);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }
    }
}

.groups-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.group-card {
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.group-name {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.edit-group-btn {
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #999;
}

.group-count {
    margin: 0 0 15px 0;
    font-size: 13px;
    color: #999;
}

.group-friends {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.mini-friend {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    background: #f8fafc;
    border-radius: 20px;
}

.mini-avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    object-fit: cover;
}

.mini-name {
    font-size: 12px;
    color: #666;
}

.no-friends {
    font-size: 13px;
    color: #999;
    padding: 10px;
}

.add-group-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(to right, #f895c8, #ffd4eb);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(248, 149, 200, 0.4);
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
    background: white;
    padding: 15px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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

.empty-state {
    text-align: center;
    padding: 50px;
    color: #999;
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
</style>