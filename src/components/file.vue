<template>
    <div class="pet-profile-container">
        <header class="top">
            <h1 class="top-title">-宠物档案管理-</h1>
        </header>

        <main class="main-content">
            <div class="action-buttons">
                <button class="btn-primary" @click="openAddPetModal">+ 新建宠物档案</button>
            </div>

            <div class="pet-list" v-if="pets.length > 0">
                <article class="pet-card" v-for="pet in pets" :key="pet.id">
                    <div class="pet-card-header">
                        <h3>{{ pet.name }}</h3>
                        <div class="pet-card-actions">
                            <button class="btn-secondary" @click="editPet(pet)">编辑</button>
                            <button class="btn-danger" @click="deletePet(pet.id)">删除</button>
                        </div>
                    </div>
                    <div class="pet-card-body">
                        <div class="pet-image">
                            <img v-if="pet.photo" :src="pet.photo" :alt="pet.name" />
                            <span v-else class="pet-image-placeholder">{{ pet.name.charAt(0) }}</span>
                        </div>
                        <div class="pet-info">
                            <p><strong>类型：</strong>{{ pet.type }}</p>
                            <p><strong>品种：</strong>{{ pet.breed }}</p>
                            <p><strong>性别：</strong>{{ pet.gender }}</p>
                            <p><strong>体重：</strong>{{ pet.weight }} kg</p>
                            <p><strong>毛色：</strong>{{ pet.color }}</p>
                            <p><strong>生日：</strong>{{ pet.birthday }}</p>
                            <div class="pet-tags">
                                <span class="tag" v-for="tag in pet.tags" :key="tag">{{ tag }}</span>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            <div class="empty-state" v-else>
                <p>还没有宠物档案，点击上方按钮创建</p>
            </div>
        </main>

        <Teleport to="body">
            <div class="modal" v-if="showModal" @click.self="closeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>{{ isEditing ? '编辑宠物档案' : '新建宠物档案' }}</h2>
                        <button class="close-btn" @click="closeModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="savePet">
                            <div class="form-row">
                                <div class="form-group half-width">
                                    <label>宠物名称</label>
                                    <input type="text" v-model="formData.name" required />
                                </div>
                                <div class="form-group half-width">
                                    <label>宠物类型</label>
                                    <select v-model="formData.type" required>
                                        <option value="">请选择</option>
                                        <option v-for="opt in petTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>照片</label>
                                <input type="text" v-model="formData.photo" placeholder="输入照片URL" />
                            </div>

                            <div class="form-group">
                                <label>品种</label>
                                <input type="text" v-model="formData.breed" />
                            </div>

                            <div class="form-row">
                                <div class="form-group half-width">
                                    <label>性别</label>
                                    <select v-model="formData.gender" required>
                                        <option value="">请选择</option>
                                        <option v-for="opt in genderOptions" :key="opt" :value="opt">{{ opt }}</option>
                                    </select>
                                </div>
                                <div class="form-group half-width">
                                    <label>体重 (kg)</label>
                                    <input type="number" v-model.number="formData.weight" step="0.1" min="0" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label>毛色</label>
                                <input type="text" v-model="formData.color" />
                            </div>

                            <div class="form-group">
                                <label>生日</label>
                                <input type="date" v-model="formData.birthday" required />
                            </div>

                            <div class="form-group">
                                <label>标签</label>
                                <div class="tags-input">
                                    <span class="tag" v-for="(tag, i) in formData.tags" :key="i">
                                        {{ tag }}
                                        <button type="button" @click="removeTag(i)">&times;</button>
                                    </span>
                                    <input type="text" v-model="newTag" @keyup.enter.prevent="addTag"
                                        placeholder="输入标签并按回车添加" />
                                </div>
                                <div class="existing-tags">
                                    <span class="existing-tag" v-for="tag in availableTags" :key="tag"
                                        @click="addExistingTag(tag)">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="button" class="btn-secondary" @click="closeModal">取消</button>
                                <button type="submit" class="btn-primary">保存</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const petTypeOptions = ['猫', '狗', '其他']
const genderOptions = ['公', '母']

const pets = ref([
    {
        id: 1,
        name: 'Tommy',
        type: '猫',
        photo: '',
        breed: '英短',
        gender: '公',
        weight: 4.5,
        color: '蓝白',
        birthday: '2021-04-27',
        tags: ['可爱', '粘人', '调皮']
    },
    {
        id: 2,
        name: 'Lucky',
        type: '狗',
        photo: '',
        breed: '金毛',
        gender: '母',
        weight: 25,
        color: '金黄色',
        birthday: '2020-06-15',
        tags: ['温顺', '聪明', '忠诚']
    }
])

const showModal = ref(false)
const isEditing = ref(false)
const newTag = ref('')
const existingTags = ref(['可爱', '粘人', '调皮', '温顺', '聪明', '忠诚', '活泼', '安静', '友善'])

let nextId = 3

const formData = reactive({
    id: null,
    name: '',
    type: '',
    photo: '',
    breed: '',
    gender: '',
    weight: null,
    color: '',
    birthday: '',
    tags: []
})

const availableTags = computed(() => {
    return existingTags.value.filter(tag => !formData.tags.includes(tag))
})

function createEmptyForm() {
    return {
        id: null,
        name: '',
        type: '',
        photo: '',
        breed: '',
        gender: '',
        weight: null,
        color: '',
        birthday: '',
        tags: []
    }
}

function resetForm() {
    Object.assign(formData, createEmptyForm())
    newTag.value = ''
}

function openAddPetModal() {
    isEditing.value = false
    resetForm()
    showModal.value = true
}

function editPet(pet) {
    isEditing.value = true
    Object.assign(formData, { ...pet, tags: [...pet.tags] })
    showModal.value = true
}

function deletePet(id) {
    if (confirm('确定要删除这个宠物档案吗？')) {
        pets.value = pets.value.filter(pet => pet.id !== id)
    }
}

function closeModal() {
    showModal.value = false
    resetForm()
}

function savePet() {
    if (isEditing.value) {
        const index = pets.value.findIndex(pet => pet.id === formData.id)
        if (index !== -1) {
            pets.value[index] = { ...formData }
        }
    } else {
        pets.value.push({ ...formData, id: nextId++ })
    }
    closeModal()
}

function addTag() {
    const tag = newTag.value.trim()
    if (tag && !formData.tags.includes(tag)) {
        formData.tags.push(tag)
        if (!existingTags.value.includes(tag)) {
            existingTags.value.push(tag)
        }
    }
    newTag.value = ''
}

function removeTag(index) {
    formData.tags.splice(index, 1)
}

function addExistingTag(tag) {
    if (!formData.tags.includes(tag)) {
        formData.tags.push(tag)
    }
}

function checkBirthdayReminders() {
    const today = new Date()
    const todayMonth = today.getMonth() + 1
    const todayDay = today.getDate()

    pets.value.forEach(pet => {
        const [, month, day] = pet.birthday.split('-').map(Number)
        if (month === todayMonth && day === todayDay) {
            const age = today.getFullYear() - parseInt(pet.birthday.split('-')[0])
            alert(`🎉 你的宠物${pet.name}今天${age}岁啦！`)
        }
    })
}

onMounted(() => {
    checkBirthdayReminders()
})
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.pet-profile-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #ffffff, #d6e8ff);
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}

.top {
    height: 55px;
    background: linear-gradient(to right, #65A3F0, #FDCBE6);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(101, 163, 240, 0.3);
}

.top-title {
    font: 599 28px SimHei;
    color: white;
    text-shadow: 0 2px 12px rgba(101, 163, 240, 0.5);
    letter-spacing: 2px;
    position: relative;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    line-height: 1;
    transform: translateY(-2px);
}

.main-content {
    flex: 1;
    padding: 40px 80px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.action-buttons {
    margin-bottom: 30px;
    text-align: right;
}

.btn-primary {
    padding: 12px 28px;
    background: linear-gradient(135deg, #65A3F0, #88c1ff);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(101, 163, 240, 0.4);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(101, 163, 240, 0.5);
    }

    &:active {
        transform: scale(0.95);
    }
}

.btn-secondary {
    padding: 8px 18px;
    background: linear-gradient(to right, #e1f0ff, #b3d9ff);
    border: none;
    border-radius: 6px;
    color: #4a6fa5;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 10px;
    box-shadow: 0 2px 4px rgba(136, 193, 255, 0.3);

    &:hover {
        background: linear-gradient(to right, #b3d9ff, #8cc2ff);
        color: #2c5282;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(136, 193, 255, 0.4);
    }

    &:active {
        transform: scale(0.95);
    }
}

.btn-danger {
    padding: 8px 18px;
    background: linear-gradient(to right, #ffe6f0, #ffd1e0);
    border: none;
    border-radius: 6px;
    color: #b56576;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(255, 184, 217, 0.3);

    &:hover {
        background: linear-gradient(to right, #ffd1e0, #ffb8d9);
        color: #8c3d54;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(255, 184, 217, 0.4);
    }

    &:active {
        transform: scale(0.95);
    }
}

.pet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 70px;
}

.pet-card {
    flex: 0 0 calc(50% - 35px);
    background: white;
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 8px 24px rgba(101, 163, 240, 0.15);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid #F0F7FF;
    cursor: pointer;

    &:hover {
        box-shadow: 0 12px 32px rgba(101, 163, 240, 0.25);
        transform: translateY(-4px);
        border-color: #A5CAF1;
    }
}

.pet-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 2px solid #F0F7FF;

    h3 {
        font: 700 20px SimHei;
        color: #4a6fa5;
        letter-spacing: 0.5px;
    }
}

.pet-card-body {
    display: flex;
    gap: 18px;
}

.pet-image {
    flex-shrink: 0;
    width: 95px;
    height: 95px;
    border-radius: 14px;
    overflow: hidden;
    border: 3px solid #F0F7FF;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ffd1e0 0%, #b3d9ff 100%);
    box-shadow: 0 4px 12px rgba(101, 163, 240, 0.2);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.pet-image-placeholder {
    font-size: 38px;
    font-weight: 800;
    color: white;
    text-shadow: 0 2px 8px rgba(101, 163, 240, 0.3);
}

.pet-info {
    flex: 1;
    font-size: 13px;
    line-height: 2;
    color: #797979;

    strong {
        color: #4a6fa5;
        font-weight: 700;
    }
}

.pet-tags {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag {
    background: linear-gradient(135deg, #ffd1e0 0%, #FDCBE6 100%);
    color: #8c3d54;
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    button {
        background: rgba(255, 255, 255, 0.6);
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #8c3d54;
        padding: 0;
        line-height: 1;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        &:hover {
            background: rgba(255, 255, 255, 0.9);
            transform: scale(1.1);
        }
    }
}

.empty-state {
    text-align: center;
    padding: 120px 0;
    color: #797979;

    p {
        font-size: 20px;
        font-weight: 500;
    }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 20px;
    width: 90%;
    max-width: 650px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 30px;
    border-bottom: 1px solid #F0F7FF;
    background: linear-gradient(to right, #65A3F0, #FDCBE6);

    h2 {
        font: 700 22px SimHei;
        color: white;
        letter-spacing: 0.5px;
    }
}

.close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: white;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    line-height: 1;

    &:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: rotate(90deg);
    }
}

.modal-body {
    padding: 30px;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
}

.form-group {
    margin-bottom: 24px;

    label {
        display: block;
        margin-bottom: 10px;
        font-weight: 700;
        color: #4a6fa5;
        font-size: 15px;
    }

    input,
    select {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #F0F7FF;
        border-radius: 10px;
        font-size: 16px;
        outline: none;
        transition: all 0.3s ease;
        background: #F9FDFF;
        font-family: inherit;
        color: #4a6fa5;

        &:focus {
            border-color: #65A3F0;
            box-shadow: 0 0 0 4px rgba(101, 163, 240, 0.1);
            background: white;
        }

        &::placeholder {
            color: #A5CAF1;
        }
    }
}

.half-width {
    flex: 1;
    margin-bottom: 0;
}

.tags-input {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px;
    border: 2px solid #F0F7FF;
    border-radius: 10px;
    background: #F9FDFF;
    min-height: 60px;
    align-items: center;
    transition: all 0.3s ease;

    &:focus-within {
        border-color: #65A3F0;
        box-shadow: 0 0 0 4px rgba(101, 163, 240, 0.1);
        background: white;
    }

    input {
        flex: 1;
        border: none;
        background: transparent;
        padding: 0;
        min-width: 150px;
        font-size: 16px;
        color: #4a6fa5;
        outline: none;

        &::placeholder {
            color: #A5CAF1;
        }
    }
}

.existing-tags {
    margin-top: 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.existing-tag {
    background: #F0F7FF;
    color: #4a6fa5;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #A5CAF1;

    &:hover {
        background: linear-gradient(135deg, #65A3F0 0%, #88c1ff 100%);
        color: white;
        transform: translateY(-2px);
        border-color: transparent;
        box-shadow: 0 4px 12px rgba(101, 163, 240, 0.3);
    }
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 36px;
}

@media (max-width: 768px) {
    .main-content {
        padding: 20px;
    }

    .pet-list {
        grid-template-columns: 1fr;
    }

    .pet-card-body {
        flex-direction: column;
        text-align: center;
    }

    .pet-image {
        margin: 0 auto;
    }

    .modal-content {
        width: 95%;
        margin: 20px;
    }

    .form-row {
        flex-direction: column;
        gap: 0;
    }

    .half-width {
        margin-bottom: 24px;
    }
}
</style>
