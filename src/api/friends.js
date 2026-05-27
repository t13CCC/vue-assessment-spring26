import request from "@/utils/request";


//好友分组接口

export function getFriendGroup() {
  return request({
    url: "/api/friend/group",
    method: "GET",
  });
}

export function addFriendGroup(groupName) {
  return request({
    url: "/api/friend/group",
    method: "POST",
    data: {
      groupName
    }
  });
}

export function updateFriendGroup(groupId, groupName) {
  return request({
    url: `/api/friend/group/${groupId}`, 
    method: "PUT",
    data: {
      groupName
    }
  });
}

export function deleteFriendGroup(groupId) {
  return request({
    url: `/api/friend/group/${groupId}`,
    method: "DELETE",
  });
}


//好友接口

export function getFriends() {
  return request({
    url: "/api/friend",  
    method: "GET",
  });  
}  

export function removeFriend(friendId) {
  return request({
    url: `/api/friend/${friendId}`,
    method: "DELETE",
  });
}

export function moveFriendToGroup(friendId, groupId) {
  return request({
    url: `/api/friend/${friendId}/group`,
    method: "PUT",
    data: {
      groupId
    }
  });
}

//好友申请接口

export function applyFriendRequest(message, targetId) {
  return request({
    url: "/api/friend/apply",
    method: "POST",
    data: {
      message,
      targetId
    }
  });
}

export function getReceivedFriendRequests() {
  return request({
    url: "/api/friend/apply/received",
    method: "GET",
  });
}

export function getSentFriendRequests() {
  return request({
    url: `/api/friend/apply/sent`,
    method: "GET",
  });
}

export function respondToFriendRequest(applyId, status) {
  return request({
    url: `/api/friend/apply/${applyId}`,
    method: "PUT",
    data: {
      status
    }
  });
}

//私聊接口

export function getPrivateChatContacts() {
  return request({
    url: `/api/friend/chat/contacts`,
    method: "GET",
  });
}

export function getChatHistory(friendId, cursor = 0, size = 20) {
  return request({
    url: `/api/friend/chat/history/${friendId}`,
    method: "POST",
    data: {
      cursor,
      size
    }
  });
}

export function markChatAsRead(friendId) {
  return request({
    url: `/api/friend/chat/read/${friendId}`,
    method: "PUT",
  });
}

// 发送私聊消息
export function sendPrivateMessage(receiverId, content, messageType = 'TEXT') {
  return request({
    url: "/api/friend/chat/send",
    method: "POST",
    data: {
      receiverId,
      content,
      messageType
    }
  });
}

//通知接口
export function getNotifications() {
  return request({
    url: "/api/friend/notification",
    method: "GET",
  });
}

export function markAllNotificationsAsRead() {
  return request({
    url: "/api/friend/notification/read-all",
    method: "PUT",
  });
}

export function getUnreadNotificationCount() {
  return request({
    url: "/api/friend/notification/unread-count",
    method: "GET",
  });
}

// 标记单条通知为已读
export function markNotificationAsRead(id) {
  return request({
    url: `/api/friend/notification/${id}/read`,
    method: "PUT",
  });
}