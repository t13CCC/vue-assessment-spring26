<template>
  <Transition name="slide-fade">
    <div v-if="showBirthdayWish" class="birthday-wish-overlay" @click="closeWish">
      <div class="birthday-card" @click.stop>
        <div class="birthday-decoration">
          <span class="balloon">🎈</span>
          <span class="balloon">🎈</span>
          <span class="balloon">🎈</span>
        </div>
        
        <div class="birthday-content">
          <div class="birthday-icon">🎂</div>
          <h2 class="birthday-title">生日快乐！</h2>
          <p class="birthday-message">{{ birthdayMessage }}</p>
        </div>
        
        <button class="close-btn" @click="closeWish">
          <span>✕</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { initSocket, onMessage, offMessage } from '@/utils/socket';

const props = defineProps({
  pets: {
    type: Array,
    default: () => []
  }
});

const showBirthdayWish = ref(false);
const birthdayPet = ref(null);

// 计算生日消息
const birthdayMessage = computed(() => {
  if (!birthdayPet.value) return '';
  const age = calculateAge(birthdayPet.value.birthday);
  return `你的宠物${birthdayPet.value.name}今天${age}岁啦！`;
});

// 计算宠物年龄
function calculateAge(birthday) {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  return age;
}

// 检查今天是否有宠物生日
function checkBirthdays() {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  
  const birthdayPets = props.pets.filter(pet => {
    const [, month, day] = pet.birthday.split('-').map(Number);
    return month === todayMonth && day === todayDay;
  });
  
  if (birthdayPets.length > 0) {
    // 按年龄排序，优先显示年龄最大的宠物
    birthdayPets.sort((a, b) => calculateAge(b.birthday) - calculateAge(a.birthday));
    birthdayPet.value = birthdayPets[0];
    
    // 检查是否在早上8点之后
    const currentHour = today.getHours();
    if (currentHour >= 8) {
      // 检查今天是否已经显示过祝福（使用localStorage）
      const lastShownDate = localStorage.getItem('birthdayWishShown');
      const todayStr = today.toDateString();
      if (lastShownDate !== todayStr) {
        // 延迟1秒显示，让页面先加载
        setTimeout(() => {
          showBirthdayWish.value = true;
        }, 1000);
        localStorage.setItem('birthdayWishShown', todayStr);
      }
    }
  }
}

// 关闭祝福
function closeWish() {
  showBirthdayWish.value = false;
}

// 处理 WebSocket 收到的生日消息
const handleBirthdayMessage = (data) => {
  const { content, extra } = data;
  
  // 设置生日宠物信息
  if (extra) {
    birthdayPet.value = {
      id: extra.petId,
      name: extra.petName,
      breed: extra.petBreed,
      birthday: extra.birthday
    };
  }
  
  // 显示生日祝福
  showBirthdayWish.value = true;
  
  // 记录已显示（避免重复显示）
  const today = new Date();
  localStorage.setItem('birthdayWishShown', today.toDateString());
};

// 监听宠物列表变化
watch(() => props.pets, () => {
  checkBirthdays();
}, { deep: true });

onMounted(() => {
  // 初始化 WebSocket 连接
  initSocket();
  
  // 注册 BIRTHDAY 消息处理器
  onMessage('BIRTHDAY', handleBirthdayMessage);
  
  checkBirthdays();
  
  // 设置定时器，每天早上8点检查（备用方案）
  const now = new Date();
  const next8am = new Date(now);
  next8am.setHours(8, 0, 0, 0);
  if (next8am <= now) {
    next8am.setDate(next8am.getDate() + 1);
  }
  
  const delay = next8am.getTime() - now.getTime();
  setTimeout(() => {
    checkBirthdays();
    // 之后每天检查
    setInterval(checkBirthdays, 24 * 60 * 60 * 1000);
  }, delay);
});

onUnmounted(() => {
  // 取消消息监听
  offMessage('BIRTHDAY', handleBirthdayMessage);
});
</script>

<style lang="scss" scoped>
.birthday-wish-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 247, 247, 0.185);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

.birthday-card {
  background: linear-gradient(135deg, #fffbf6 0%, #ffdcd8 100%);
  border-radius: 24px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 60px rgba(255, 182, 193, 0.4);
  animation: bounceIn 0.5s ease;
}

.birthday-decoration {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
}

.balloon {
  font-size: 32px;
  animation: float 3s ease-in-out infinite;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    animation-delay: 0.5s;
  }
  
  &:nth-child(3) {
    animation-delay: 1s;
  }
}

.birthday-content {
  position: relative;
}

.birthday-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

.birthday-title {
  font-size: 30px;
  color: #ff87b5;
  margin-bottom: 15px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(255, 107, 138, 0.3);
}

.birthday-message {
  font-size: 14px;
  color: #4a4a4a;
  line-height: 1.7;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  position: relative;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  letter-spacing: 0.3px;
}

.birthday-message::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 12px;
  width: 4px;
  height: 4px;
  background: linear-gradient(135deg, #ffb6c1, #ffc0cb);
  border-radius: 50%;
}

.birthday-message::after {
  content: '';
  position: absolute;
  bottom: 8px;
  right: 12px;
  width: 3px;
  height: 3px;
  background: linear-gradient(135deg, #b8c7dc, #c9d6e8);
  border-radius: 50%;
}



.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 107, 138, 0.2);
  color: #ff6b8a;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 107, 138, 0.4);
    transform: rotate(90deg);
  }
  
  span {
    line-height: 1;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}


.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s ease-in; }
.slide-fade-enter-from { opacity: 0; transform: translateY(-20px); }
.slide-fade-leave-to { opacity: 0; transform: scale(0.9); }
</style>