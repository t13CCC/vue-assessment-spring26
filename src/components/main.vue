<template>
    <div class="window">
        <div class="section1">
            <div class="information" @click="goToEditProfile" @focus="showEditProfile = true" tabindex="0">
                <img :src="user.avator" alt="" class="avator">
                <div class="username">
                    {{ user.name }}
                </div>
                <span class="edit-icon">✏️</span>
            </div>
            <EditProfile v-show="showEditProfile" @close="showEditProfile = false" />
        </div>
        <div class="section2">
            <h1>萌宠小镇</h1>
        </div>
        <div class="section3">
            <div class="file choice" @click="goToFile">
                <div class="top">-宠物档案-</div>
                <div class="choiceContent">
                    <div class="contentp">记录自己的宠物吧！</div>
                    <img class="img1 zebra" src="/src/assets/banMa/IMG_3983.PNG" alt="">
                </div>
            </div>
            <div class="adopt choice" @click="goToAdoption">
                <div class="top">-宠物领养-</div>
                <div class="choiceContent">
                    <div class="contentp">发布领养信息或领养一只宠物！</div>
                    <img class="img2 zebra" src="/src/assets/banMa/IMG_4020.PNG" alt="">
                </div>
            </div>
            <div class="friend choice" @click="goToFriends">
                <div class="top top2">-好友-</div>
                <div class="choiceContent">
                    <div class="contentp">寻找相似的宠物爱好者！</div>
                    <img class="img3 zebra" src="/src/assets/banMa/IMG_4023.PNG" alt="">
                </div>
            </div>
        </div>
        <div class="section4"></div>
    </div>
    <Signin class="Signin" v-show="showSignin" @login-success="handleLoginSuccess"></Signin>

    <!-- 登录遮罩层：登录前覆盖主页，禁止操作 -->
    <div class="login-overlay" v-show="showSignin"></div>

</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import EditProfile from './EditProfile.vue';
import Signin from './signin.vue';

const router = useRouter();
const showEditProfile = ref(false);
const showSignin = ref(true); // 控制登录组件显示

let user = reactive({
    name: "未设置用户名",
    avator: "/src/assets/avator.png"
});

// 跳转到领养页面
const goToAdoption = () => {
    router.push('/adoption');
};

// 聚焦时显示编辑资料界面
const goToEditProfile = () => {
    showEditProfile.value = true;
};

const goToFriends = () => {
    router.push('/friends');
};

const goToFile = () => {
    router.push('/file');
};

// 登录成功后隐藏登录组件
const handleLoginSuccess = () => {
    showSignin.value = false;
};
</script>

<style lang="scss" scoped>
.window {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(135deg, #ffffff, #d6e8ff);
    justify-content: space-between;
    overflow: auto;
    flex-shrink: 0;
    position: relative;
}

.section1 {
    height: 60px;
    display: flex;
    align-items: center;
    background: linear-gradient(to right, #88c1ff, rgb(255, 255, 255), #ffc7e5);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
}

.information {
    height: 40px;
    border: solid 2px #cae4ff;
    border-radius: 18px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    margin: 0 10px;

    * {
        margin: 0 3px;
    }

    background-color: white;
    cursor: pointer;
    transition: all 0.3s;
    outline: none;

    &:hover {
        transform: scale(1.05);
    }

    &:focus {
        border-color: #65A3F0;
        box-shadow: 0 0 0 3px rgba(101, 163, 240, 0.2);
    }
}

.edit-icon {
    font-size: 14px;
    opacity: 0.5;
    transition: opacity 0.3s;

    .information:hover & {
        opacity: 1;
    }
}

.avator {
    width: 25px;
    border-radius: 100%;
}

.username {
    color: #777777;
    font-size: 14px;
}


.section2 {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    position: relative;
}

.section2::before {
    content: '🐾';
    position: absolute;
    left: 10%;
    font-size: 40px;
    opacity: 0.6;
    animation: float 3s ease-in-out infinite;
}

.section2::after {
    content: '🐾';
    position: absolute;
    right: 10%;
    font-size: 40px;
    opacity: 0.6;
    animation: float 3s ease-in-out infinite 1.5s;
}

h1 {
    font-size: clamp(50px, 14vw, 120px);
    margin: 0;
    color: #ffffff;
    font-weight: 700;
    font-family: 'Microsoft YaHei', 'PingFang SC', 'KaiTi', serif;
    letter-spacing: 15px;
    position: relative;
    text-shadow:
        3px 3px 0 #87bdff,
        -1px -1px 0 #87bdff,
        1px -1px 0 #87bdff,
        -1px 1px 0 #87bdff,
        2px 2px 10px rgba(101, 163, 240, 0.3);
}

h1::after {
    content: '❤';
    position: absolute;
    top: -30px;
    color: #ff89ca;
    right: -50px;
    font-size: 33px;
    animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes heartbeat {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }
}

.section3 {
    display: flex;
    justify-content: space-evenly;
    padding: 20px;
    flex-wrap: wrap;
}

.choice {
    background: linear-gradient(135deg, #cbe4ff, #e8f2ffd7);
    border: solid 1px #8ac2ff;
    width: 400px;
    height: 280px;
    flex-wrap: wrap;
    border-radius: 40px;
    transition: 0.3s;
    margin: 20px;
    cursor: pointer;

    &:hover {
        box-shadow: 0 4px 12px hsla(211, 100%, 72%, 0.522);
    }

    overflow: hidden;
}

.friend {
    background: linear-gradient(135deg, #ffd4eb, rgb(255, 238, 246));
    border: solid 1px #f895c8;

    &:hover {
        box-shadow: 0 4px 12px #f8afd6da;
    }
}

.top {
    height: 50px;
    background: linear-gradient(to right, #8ac2ff, #cbe4ff);
    color: #5f5f5fa8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 1px;
}

.top2 {
    background: linear-gradient(to right, #f895c8, #ffd4eb);
}

.choiceContent {
    display: flex;
    align-items: center;
}

.contentp {
    margin-left: 40px;
    color: #818181;
    font-size: 18px;
}

.zebra {
    width: 180px;
    height: 180px;
    margin-right: auto;
    flex: none;
}

.adopt,
.friend {
    &:hover {
        transform: scale(1.02);
    }
}

.Signin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 400px;
    background: transparent;
    z-index: 100;
    /* 登录框在遮罩层上面 */
}

/* 登录遮罩层样式 */
.login-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    /* 全透明遮罩 */
    z-index: 50;
    /* 遮罩层在主页上面，登录框下面 */
}
</style>