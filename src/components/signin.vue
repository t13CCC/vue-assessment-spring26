<template>
    <div class="window">
        <div class="top">
            <p class="topP">--登录--</p>
        </div>
        <div class="section">
            <div class="section1">  
                <div class="message">
                    <div class="message1 username">
                        <input class="messageInput" type="text" :placeholder="placeholderText" v-model="signinBack.username">
                    </div>
                    <div class="message1 password">
                        <input class="messageInput" id="passwordInput" type="password" placeholder="请输入密码" v-model="signinBack.password">
                    </div>
                </div>
                <div class="method">
                    <span class="methodContent"><input type="radio" name="signinMethod" :value="1" v-model="signinBack.choice">手机号</span>
                    <span class="methodContent"><input type="radio" name="signinMethod" :value="2" v-model="signinBack.choice">邮箱</span>
                    
                </div>
                <button class="btn1">登录</button>
            </div>
            <div class="section2">
                <div class="section2p">{{ signinBack.content }}</div>
                <img class="img1" :src="signinBack.img" alt="">
            </div>
        </div>
    </div>
    
</template>

<script setup>
    import { reactive, ref, watchEffect } from 'vue';

    //登录方式
    let placeholderText = ref("")
    //登录输入反馈
    let signinBack = reactive({
        img:"src/assets/banMa/IMG_4021.PNG",
        content:"欢迎来到萌宠小镇！",
        username:"",
        password:"",
        choice:0,
        judge:true,
        check(x){
            if(x == 1){
                if(this.username.length >= 11){
                    this.judge = /^1[3-9]\d{9}$/.test(this.username);
                }
                else{
                    this.judge = true;
                }
            }
            if(x == 2 && this.username.length >= 6){
                this.judge = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.username);
            }
            if(x == 2 && this.username.length < 6){
                this.judge = true;
            }
            

        }
    })
    watchEffect(() => {
        signinBack.check(signinBack.choice);
        if(signinBack.judge == false){
            signinBack.content = "输入格式有误！"
            signinBack.img="src/assets/banMa/IMG_3982.PNG"
        }
        else{
            signinBack.content = "欢迎来到萌宠小镇！"
            signinBack.img="src/assets/banMa/IMG_4021.PNG";
        }

        if(signinBack.choice == 0 && signinBack.username.length){
            signinBack.content = "选择登录方式！";
            signinBack.img="src/assets/banMa/IMG_3974.PNG";
        }
        switch(signinBack.choice){
            case 1:
                placeholderText.value = "请输入手机号"
                break;
            case 2:
                placeholderText.value = "请输入邮箱"
                break;
            default:
                placeholderText.value = "请选择登录方式"
        }
    })

</script>

<style lang="scss" scoped>
*{
  padding: 0%;
  margin: 0%;
  overflow: hidden;
}

.icon1{
    width: 20px;
}
.btn1{
    width: 80px;
    height: 30px;
    background-color:#c0deff;
    border: solid #71b8ff 1px;
    border-radius: 6px;
    margin: 10px 0 0 140px;
    color: rgb(99, 99, 99);
    transition: 0.1s;
}
.btn1:hover{
    background-color:hsl(210, 100%, 80%) ;
    
}
.btn1:active {
    transform: scale(0.95);
    background: hsl(210, 100%, 80%);
}
.window {
    margin: 100px;
    width: 600px;
    height: 400px;
    border-radius: 20px;
    display: flex;
    flex: 1;
    flex-direction: column;
    box-shadow: 0px 4px 10px 1px #b6ceec;
    transition: 0.3s;
}
.window:hover{
    box-shadow: 0px 4px 15px 4px #b6ceec;
}
.section{
    display: flex;
    flex: 1;
    justify-content: space-between;
    background: rgba(200, 222, 255, 0.15);
    backdrop-filter: blur(10px);
}
.section1{
    display: flex;
    flex-direction: column;

}
.section2{
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 30px 0;
}
.top {
    height: 55px;
    background: linear-gradient(to right, #65A3F0,#FDCBE6);
    display: flex;
    align-items: center;
    justify-content: center;
}
.topP{
    font: 599 20px SimHei;
    color: white;
}
.messageInput {
    width: 250px;
    height: 30px;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
    padding-left: 10px;
    border: solid 2px #A5CAF1;
    background: linear-gradient(to right, #e7f2ff,#A5CAF1);
}
#passwordInput{
    border: solid 2px #FDCBE6;
    outline: none;
    background: linear-gradient(to right, #FFEDF5,#FDCBE6);
}
#passwordInput:focus{
    border-color: #ffa5d5;
}

.messageInput:focus {
    border-color: #409eff;
}

.password {
    display: flex;
    align-items: center;
}

.message {
    margin: 40px 0px 0px 25px;
}

.message1 {
    margin: 30px 0 30px 30px;
}
.passwordShow{
    margin:10px;
}
.method{
    display: flex;
    margin: 20px 0 20px 30px;
    justify-content: space-around;
}
.methodContent{
    color: #636262;
}
.img1{
    width: 200px;
    height: 200px;
}
.section2p{
    background-color: #FFEDF5;
    width: 120px;
    height: 60px;
    border-radius: 20px 20px 20px 0px;
    margin: 0px 20px 0 auto;
    border: solid 2px #FDCBE6;
    color: #797979;
    font: 13px bold "Microsoft YaHei" ;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
}
</style>