<template>
    <div class="content">
        
        <!-- 按分组展示好友 -->
        <div class="grouped-friends">
            <!-- 未分组好友 -->
            <div class="group-section">
                <!-- 创建分组按钮 -->
                <div class="group-header">
                    <button class="add-group-btn" @click="$emit('create-group')">+ 创建新分组</button>
                </div>
                <h3 class="group-title">未分组 ({{ getUngroupedFriends.length }})</h3>
                <div class="friends-grid">
                    <div v-for="friend in getUngroupedFriends" :key="friend.friendId" class="friend-card">
                        <img :src="friend.avatar || '/src/assets/avator.png'" alt="头像" class="friend-avatar">
                        <div class="friend-info">
                            <h4 class="friend-name">{{ friend.remark || friend.nickname }}</h4>
                            <span class="friend-tag">未分组</span>
                        </div>
                        <div class="friend-actions">
                            <button class="action-btn chat-btn" @click="$emit('chat', friend.friendId)">💬 聊天</button>
                            <button class="action-btn group-btn" @click="$emit('change-group', friend)">📁 分组</button>
                            <button class="action-btn delete-btn" @click="$emit('delete', friend.friendId)">🗑️ 删除</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 各分组好友 -->
            <div v-for="group in groups" :key="group.id" class="group-section">
                <div class="group-header-row">
                    <h3 class="group-title">{{ group.groupName }} ({{ getFriendsInGroup(group.id).length }})</h3>
                    <div class="group-actions">
                        <button class="edit-group-btn" @click="editGroupName(group)">✏️</button>
                        <button class="delete-group-btn" @click="removeGroup(group)">🗑️</button>
                    </div>
                </div>
                <div class="friends-grid">
                    <div v-for="friend in getFriendsInGroup(group.id)" :key="friend.friendId" class="friend-card">
                        <img :src="friend.avatar || '/src/assets/avator.png'" alt="头像" class="friend-avatar">
                        <div class="friend-info">
                            <h4 class="friend-name">{{ friend.remark || friend.nickname }}</h4>
                            <span class="friend-tag">{{ group.groupName }}</span>
                        </div>
                        <div class="friend-actions">
                            <button class="action-btn chat-btn" @click="$emit('chat', friend.friendId)">💬 聊天</button>
                            <button class="action-btn group-btn" @click="$emit('change-group', friend)">📁 分组</button>
                            <button class="action-btn delete-btn" @click="$emit('delete', friend.friendId)">🗑️ 删除</button>
                        </div>
                    </div>
                    <div v-if="getFriendsInGroup(group.id).length === 0" class="empty-group">
                        <p>该分组暂无好友</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="friends.length === 0" class="empty-state">
            <p>暂无好友</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { updateFriendGroup, deleteFriendGroup } from '@/api/friends';

const props = defineProps({
    friends: {
        type: Array,
        required: true
    },
    groups: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['chat', 'delete', 'change-group', 'create-group', 'update']);

// 获取未分组好友
const getUngroupedFriends = computed(() => {
    return props.friends
});

// 获取分组中的好友
const getFriendsInGroup = (groupId) => {
    return props.friends.filter(friend => friend.groupId === groupId);
};

// 编辑分组名称
const editGroupName = async (group) => {
    const newName = prompt('请输入新的分组名称', group.groupName);
    if (newName && newName.trim()) {
        try {
            const res = await updateFriendGroup(group.id, newName.trim());
            if (res.code === '100000') {
                group.groupName = newName.trim();
                alert('分组名称修改成功！');
                emit('update');
            }
            else if (res.code === '10001') {
                alert(res.message || '参数错误');
            }
            else if (res.code === '50006') {
                alert(res.message || '好友分组不存在');
            } 
            else if (res.code === '50007') {
                alert('分组名称已存在');
            }
        } catch (error) {
            console.error('修改分组名称失败:', error);
            alert('修改失败');
        }
    }
};

// 删除分组
const removeGroup = async (group) => {
    if (confirm(`确定要删除分组 "${group.groupName}" 吗？`)) {
        try {
            const res = await deleteFriendGroup(group.id);
            if (res.code === '100000') {
                alert('分组删除成功！');
                emit('update');
            }
            else if (res.code === '50006') {
                alert(res.message || '好友分组不存在');
            }
            else if (res.code === '50009') {
                alert(res.message || '默认分组不可删除');
            }
        } catch (error) {
            console.error('删除分组失败:', error);
            alert('删除失败');
        }
    }
};
</script>

<style lang="scss" scoped>
.content {
    padding: 20px 30px;
}

.group-header {
    margin-bottom: 20px;
    text-align: right;
    float: right;
}

.add-group-btn {
    padding: 12px 25px;
    background: linear-gradient(to right, #f895c8, #ffd4eb);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        transform: scale(1.05);
    }
}

.grouped-friends {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.group-section {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.group-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.group-title {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.group-actions {
    display: flex;
    gap: 10px;
}

.group-actions {
    display: flex;
    gap: 10px;
}

.edit-group-btn {
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #999;
}

.delete-group-btn {
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #ef4444;
}

.delete-group-btn {
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #ef4444;
}

.friends-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
}

.friend-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border: #eeeeee solid 2px;
    border-radius: 15px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #65A3F0, #f895c8);
    }
    
    &:hover {
        box-shadow: inset 0 0 2px 2px rgba(240, 101, 219, 0.398);
    }
}

.friend-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 12px;
    border: 3px solid #e2e8f0;
}

.friend-info {
    text-align: center;
    margin-bottom: 15px;
    width: 100%;
}

.friend-name {
    margin: 0 0 6px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}

.friend-tag {
    display: inline-block;
    padding: 3px 10px;
    background: linear-gradient(135deg, #e0f2fe, #fce7f3);
    border-radius: 15px;
    font-size: 11px;
    color: #64748b;
}

.friend-actions {
    display: flex;
    gap: 8px;
    width: 100%;
    justify-content: center;
}

.action-btn {
    flex: 1;
    padding: 8px 10px;
    border: none;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.5s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    
    &.chat-btn {
        background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        color: #1d4ed8;
        
        &:hover {
            background: linear-gradient(135deg, #93c5fd, #60a5fa);
            color: white;
        }
    }
    
    &.group-btn {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        color: #d97706;
        
        &:hover {
            background: linear-gradient(135deg, #fcd34d, #f59e0b);
            color: white;
        }
    }
    
    &.delete-btn {
        background: linear-gradient(135deg, #fee2e2, #fecaca);
        color: #dc2626;
        
        &:hover {
            background: linear-gradient(135deg, #fca5a5, #ef4444);
            color: white;
        }
    }
}

.empty-group {
    grid-column: 1 / -1;
    text-align: center;
    padding: 20px;
    color: #999;
}

.empty-state {
    text-align: center;
    padding: 50px;
    color: #999;
}
</style>