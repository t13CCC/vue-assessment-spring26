<template>
    <div class="window">
        <div class="section1">
            <div class="information">
                <img :src="user.avator" alt="" class="avator">
                <div class="username">
                    {{ user.name }}
                </div>
            </div>
        </div>
        <div class="section2">
            <h1>萌宠小镇</h1>
        </div>
        <div class="section3">
            <div class="file choice">
                <div class="top">-宠物档案-</div>
                <div class="choiceContent">
                    <div class="contentp">记录自己的宠物吧！</div>
                    <img class="img1 zebra" src="/src/assets/banMa/IMG_3983.PNG" alt="">
                </div>
            </div>
            <div class="adopt choice">
                <div class="top">-宠物领养-</div>
                <div class="choiceContent">
                    <div class="contentp">发布领养信息或领养一只宠物！</div>
                    <img class="img2 zebra" src="/src/assets/banMa/IMG_4020.PNG" alt="">
                </div>
            </div>
            <div class="friend choice">
                <div class="top top2">-好友-</div>
                <div class="choiceContent">
                    <div class="contentp">寻找相似的宠物爱好者！</div>
                    <img class="img3 zebra" src="/src/assets/banMa/IMG_4023.PNG" alt="">
                </div>
            </div>
        </div>
        <div class="section4"></div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

//基本信息
let user = reactive({
    name :"未设置用户名",
    avator:"/src/assets/avator.png"
})
</script>

<style lang="scss" scoped>
.window{
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(135deg, #ffffff,#d6e8ff);
    justify-content: space-between; 
    overflow: auto;
    flex-shrink: 0;
}
.section1{
    height: 50px;
    display: flex;
    align-items: center;
    background: linear-gradient(to right, #88c1ff,rgb(255, 255, 255),#ffc7e5);
    flex-shrink: 0;
}
.information{
    height: 33px;
    border:solid 2px #cae4ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    margin: 0 10px;
    *{
        margin: 0 3px;
    }
    background-color: white;
}
.avator{
    width: 25px;
    border-radius: 100%;
}
.username{
    color: #818181;
    font-size: 14px;
}


.section2{
    display: flex;
}
h1{
    font-size: 120px;
    margin: 0 auto;
    color: hsl(210, 81%, 75%);
}

.section3{
    display: flex;
    justify-content: space-evenly;
    padding: 20px;
    flex-wrap: wrap;
}
.choice{
    background: linear-gradient(135deg,#cbe4ff,#e8f2ffd7);
    border: solid 1px #8ac2ff;
    width: 400px;
    height: 280px;
    flex-wrap:wrap;
    border-radius: 40px;
    transition: 0.3s;
    margin: 20px;
    cursor: pointer;
    &:hover{
    box-shadow: 0 4px 12px hsla(211, 100%, 72%, 0.522); 
    }
    overflow: hidden;
}
.friend{
    background: linear-gradient(135deg,#ffd4eb,rgb(255, 238, 246));
    border: solid 1px #f895c8;

    &:hover{
        box-shadow: 0 4px 12px #f8afd6da;
    }
}
.top{
    height: 50px;
    background: linear-gradient(to right, #8ac2ff,#cbe4ff);
    color: #5f5f5fa8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 1px;
}
.top2{
    background: linear-gradient(to right, #f895c8,#ffd4eb);
}
.choiceContent{
    display: flex;
    align-items: center;
}
.contentp{
    margin-left: 40px;
    color: #818181;
    font-size: 18px;
}
.zebra{
    width: 180px;
    height: 180px;
    margin-right: auto;
    flex:none;
}

</style>