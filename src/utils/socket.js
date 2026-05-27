import { ref } from 'vue';

// 为 sockjs-client 提供全局变量支持
if (typeof global === 'undefined') {
  window.global = window;
}

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// STOMP 客户端实例
let stompClient = null;

// 连接状态
export const socketStatus = ref('disconnected'); // disconnected, connecting, connected

// 消息回调函数集合
const messageHandlers = new Map();

// 配置
const config = {
  // SockJS 连接地址
  sockjsUrl: '/ws/social',
  // 用户消息订阅地址
  userMessageTopic: '/user/queue/message',
  // 系统公告订阅地址（可选）
  noticeTopic: '/topic/notice',
  // 重连间隔（毫秒）
  reconnectInterval: 3000,
  // 最大重连次数
  maxReconnectAttempts: 5
};

// 重连计数器
let reconnectAttempts = 0;

/**
 * 初始化 STOMP 连接
 */
export function initSocket() {
  if (stompClient?.connected) {
    console.warn('STOMP 已连接');
    return;
  }

  socketStatus.value = 'connecting';
  
  // 创建 SockJS 连接
  const socket = new SockJS(config.sockjsUrl);
  
  // 创建 STOMP 客户端
  stompClient = Stomp.over(socket);
  
  // 关闭 debug 日志（生产环境）
  stompClient.debug = () => {};
  
  // 获取当前用户 token
  const token = localStorage.getItem('token');
  
  // 连接参数
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // 建立连接
  stompClient.connect(headers, 
    // 连接成功
    () => {
      console.log('STOMP 连接成功');
      socketStatus.value = 'connected';
      reconnectAttempts = 0;
      
      // 订阅用户消息
      subscribeUserMessages();
      
      // 可选：订阅系统公告
      subscribeNotice();
    },
    // 连接错误
    (error) => {
      console.error('STOMP 连接错误:', error);
      socketStatus.value = 'disconnected';
      
      // 自动重连
      handleReconnect();
    }
  );
}

/**
 * 订阅用户消息
 */
function subscribeUserMessages() {
  if (!stompClient?.connected) return;
  
  stompClient.subscribe(config.userMessageTopic, (message) => {
    try {
      const data = JSON.parse(message.body);
      handleMessage(data);
    } catch (error) {
      console.error('消息解析失败:', error);
    }
  });
}

/**
 * 订阅系统公告（可选）
 */
function subscribeNotice() {
  if (!stompClient?.connected) return;
  
  stompClient.subscribe(config.noticeTopic, (message) => {
    try {
      const data = JSON.parse(message.body);
      console.log('系统公告:', data);
      // 触发系统公告回调
      if (messageHandlers.has('NOTICE')) {
        const handlers = messageHandlers.get('NOTICE');
        handlers.forEach(handler => handler(data));
      }
    } catch (error) {
      console.error('公告解析失败:', error);
    }
  });
}

/**
 * 处理收到的消息
 * @param {Object} data - 消息数据
 */
function handleMessage(data) {
  const { messageType } = data;
  
  console.log(`收到消息 [${messageType}]:`, data);
  
  // 触发对应类型的回调
  if (messageHandlers.has(messageType)) {
    const handlers = messageHandlers.get(messageType);
    handlers.forEach(handler => handler(data));
  }
  
  // 触发通用回调
  if (messageHandlers.has('*')) {
    const handlers = messageHandlers.get('*');
    handlers.forEach(handler => handler(data));
  }
}

/**
 * 处理重连
 */
function handleReconnect() {
  if (reconnectAttempts < config.maxReconnectAttempts) {
    reconnectAttempts++;
    console.log(`尝试重连 (${reconnectAttempts}/${config.maxReconnectAttempts})...`);
    setTimeout(initSocket, config.reconnectInterval);
  } else {
    console.error('已达到最大重连次数');
  }
}

/**
 * 注册消息处理器
 * @param {string} messageType - 消息类型（CHAT/APPLY/FRIEND_APPLY/NOTICE）
 * @param {Function} handler - 处理函数
 */
export function onMessage(messageType, handler) {
  if (!messageHandlers.has(messageType)) {
    messageHandlers.set(messageType, []);
  }
  messageHandlers.get(messageType).push(handler);
}

/**
 * 取消消息处理器
 * @param {string} messageType - 消息类型
 * @param {Function} handler - 处理函数
 */
export function offMessage(messageType, handler) {
  if (messageHandlers.has(messageType)) {
    const handlers = messageHandlers.get(messageType);
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}

/**
 * 关闭连接
 */
export function closeSocket() {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log('STOMP 连接已关闭');
    });
    stompClient = null;
    socketStatus.value = 'disconnected';
  }
}

/**
 * 发送消息（通用方法）
 * @param {string} destination - 目标地址
 * @param {Object} body - 消息体
 * @param {Object} headers - 可选头信息
 */
export function sendMessage(destination, body, headers = {}) {
  if (!stompClient?.connected) {
    console.error('STOMP 未连接');
    return false;
  }
  
  try {
    stompClient.send(destination, headers, JSON.stringify(body));
    return true;
  } catch (error) {
    console.error('发送消息失败:', error);
    return false;
  }
}