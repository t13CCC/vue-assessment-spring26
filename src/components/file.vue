<template>
    <div class="adoption-page">
        <header class="header">
            <div class="header-left">
                <button class="home-btn" @click="goToHome">🏠 返回首页</button>
                <div class="logo">🐾 宠物档案</div>
            </div>
            <div class="header-right">
                <button class="publish-btn" @click="openAddPetModal">+ 新建宠物档案</button>
            </div>
        </header>

        <div class="adoption-list" v-if="pets.length > 0">
            <div v-for="pet in pets" :key="pet.id" class="adoption-card">
                <div class="card-image">
                    <img v-if="pet.petPhoto" :src="pet.petPhoto" :alt="pet.petName" />
                    <span v-else class="pet-image-placeholder">{{ pet.petName.charAt(0) }}</span>
                </div>
                <div class="card-content">
                    <h3 class="pet-name">{{ pet.petName }}</h3>
                    <div class="pet-info">
                        <span class="tag">{{ pet.petType }}</span>
                        <span class="tag">{{ pet.petBreed }}</span>
                    </div>
                    <div class="pet-details">
                        <p><strong>性别：</strong>{{ getGenderLabel(pet.petGender) }}</p>
                        <p><strong>体重：</strong>{{ pet.petWeight }} kg</p>
                        <p><strong>毛色：</strong>{{ pet.petColor }}</p>
                        <p><strong>生日：</strong>{{ pet.petBirthday }}</p>
                    </div>
                    <div class="pet-tags">
                        <span class="pet-tag" v-for="tag in pet.tags" :key="tag">{{ tag }}</span>
                    </div>
                    <div class="card-actions">
                        <button class="action-btn edit-btn" @click="editPet(pet)">编辑</button>
                        <button class="action-btn delete-btn" @click="deletePet(pet.id)">删除</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="pets.length === 0" class="empty-state">
            <p>还没有宠物档案，点击上方按钮创建</p>
        </div>

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
                                    <input type="text" v-model="formData.petName" required />
                                </div>
                                <div class="form-group half-width">
                                    <label>宠物类型</label>
                                    <select v-model="formData.petType" required>
                                        <option value="">请选择</option>
                                        <option v-for="opt in petTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>照片</label>
                                <div class="upload-area" @click="triggerUpload" @dragover.prevent
                                    @drop.prevent="handleDrop">
                                    <input type="file" id="photo-upload" accept="image/*" @change="handlePhotoUpload"
                                        style="display: none;">
                                    <div class="upload-icon">📷</div>
                                    <div class="upload-text" v-if="!formData.petPhoto">点击或拖拽上传图片</div>
                                    <div class="upload-text" v-else>已选择图片</div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>品种</label>
                                <input type="text" v-model="formData.petBreed" />
                            </div>

                            <div class="form-row">
                                <div class="form-group half-width">
                                    <label>性别</label>
                                    <select v-model="formData.petGender" required>
                                        <option v-for="opt in genderOptions" :key="opt.value" :value="opt.value">{{
                                            opt.label }}</option>
                                    </select>
                                </div>
                                <div class="form-group half-width">
                                    <label>体重 (kg)</label>
                                    <input type="number" v-model.number="formData.petWeight" step="0.1" min="0" />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group half-width">
                                    <label>毛色</label>
                                    <input type="text" v-model="formData.petColor" />
                                </div>
                                <div class="form-group half-width">
                                    <label>生日</label>
                                    <input type="date" v-model="formData.petBirthday" required />
                                </div>
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
import { useRouter } from 'vue-router'
import { downloadFile, createPet, updatePet, deletePet as deletePetApi, createPetTag, deletePetTag, getPetTags } from '@/api/file'

const router = useRouter()

function goToHome() {
    router.push('/')
}

// 图片上传处理
function triggerUpload() {
    document.getElementById('photo-upload').click()
}

function handlePhotoUpload(event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            formData.petPhoto = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

function handleDrop(event) {
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
            formData.petPhoto = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const petTypeOptions = ['猫', '狗', '其他']
const genderOptions = [
    { value: 0, label: '未知' },
    { value: 1, label: '公' },
    { value: 2, label: '母' }
]

function getGenderLabel(value) {
    const option = genderOptions.find(opt => opt.value === value)
    return option ? option.label : '未知'
}

const pets = ref([])

const getPets = async () => {
    try {
        const response = await downloadFile()
        if (response.code === "100000") {
            pets.value = response.data || []
            // 为每个宠物获取标签
            for (const pet of pets.value) {
                pet.tags = await fetchPetTags(pet.id)
            }
        }
    } catch (err) {
        alert(err.message || '获取宠物档案失败')
    }
}
onMounted(async () => {
    await getPets()
    await loadAllTags()
})

// 加载所有标签到预设列表
async function loadAllTags() {
    try {
        const response = await getPetTags({ pageNum: 1, pageSize: 100 })
        if (response.code === "100000") {
            const tagList = response.data.data || []
            tagList.forEach(tag => {
                const tagName = tag.tagName || tag.name
                if (tagName && !existingTags.value.includes(tagName)) {
                    existingTags.value.push(tagName)
                }
            })
        }
    } catch (err) {
        console.error('加载标签列表失败:', err)
    }
}
const showModal = ref(false)
const isEditing = ref(false)
const newTag = ref('')
const existingTags = ref(['可爱', '粘人', '调皮', '温顺', '聪明', '忠诚', '活泼', '安静', '友善'])

let nextId = 3

const formData = reactive({
    id: null,
    petName: '',
    petType: '',
    petPhoto: '',
    petBreed: '',
    petGender: 0,
    petWeight: 0,
    petColor: '',
    petBirthday: '',
    tags: []
})

const availableTags = computed(() => {
    return existingTags.value.filter(tag => !formData.tags.includes(tag))
})

function createEmptyForm() {
    return {
        id: null,
        petName: '',
        petType: '',
        petPhoto: '',
        petBreed: '',
        petGender: 0,
        petWeight: 0,
        petColor: '',
        petBirthday: '',
        tags: []
    }
}
function openAddPetModal() {
    isEditing.value = false
    resetForm()
    showModal.value = true
}
function resetForm() {
    Object.assign(formData, createEmptyForm())
    newTag.value = ''
}



async function editPet(pet) {
    isEditing.value = true
    // 如果宠物数据中没有 tags，从后端获取
    let tags = []
    if (pet.tags && Array.isArray(pet.tags)) {
        tags = [...pet.tags]
    } else {
        // 从后端获取宠物标签
        tags = await fetchPetTags(pet.id)
    }
    Object.assign(formData, { ...pet, tags })
    showModal.value = true
}

// 获取宠物的标签列表（通过分页查询所有标签然后过滤）
async function fetchPetTags(petId) {
    try {
        const response = await getPetTags({ pageNum: 1, pageSize: 100 })
        if (response.code === "100000") {
            const allTags = response.data.data || []
            return allTags
                .filter(tag => tag.petId === petId)
                .map(tag => tag.tagName || tag.name)
        }
    } catch (err) {
        console.error('获取宠物标签失败:', err)
    }
    return []
}

async function deletePet(id) {
    if (confirm('确定要删除这个宠物档案吗？')) {
        try {
            const response = await deletePetApi(id)
            if (response.code === "100000") {
                pets.value = pets.value.filter(pet => pet.id !== id)
                alert('删除成功')
            } else {
                alert(response.message || '删除失败')
            }
        } catch (err) {
            alert(err.message || '删除失败')
        }
    }
}

function closeModal() {
    showModal.value = false
    resetForm()
}

async function savePet() {
    try {
        if (isEditing.value) {
            // 编辑模式：调用更新 API
            const response = await updatePet(formData)
            if (response.code === "100000") {
                const index = pets.value.findIndex(pet => pet.id === formData.id)
                if (index !== -1) {
                    pets.value[index] = { ...formData }
                }
                // 更新标签：先删除旧标签，再添加新标签
                await updatePetTags(formData.id, formData.tags)
                alert('修改成功')
            } else {
                alert(response.message || '修改失败')
            }
        } else {
            // 新建模式：调用创建 API（不包含 tags）
            const { tags, ...petData } = formData
            const response = await createPet(petData)
            if (response.code === "100000") {
                const newPetId = response.data.id
                pets.value.push({ ...formData, id: newPetId })
                // 创建标签（单独调用标签接口）
                await createPetTags(newPetId, formData.tags)
                alert('创建成功')
            } else {
                alert(response.message || '创建失败')
            }
        }
        closeModal()
    } catch (err) {
        alert(err.message || '保存失败')
    }
}

// 创建宠物标签
async function createPetTags(petId, tags) {
    for (const tagName of tags) {
        try {
            await createPetTag(petId, tagName)
        } catch (err) {
            console.error('创建标签失败:', tagName, err)
        }
    }
}

// 更新宠物标签（先删除所有旧标签，再添加新标签）
async function updatePetTags(petId, newTags) {
    try {
        // 先获取所有标签，然后过滤出当前宠物的标签
        const response = await getPetTags({ pageNum: 1, pageSize: 100 })
        if (response.code === "100000") {
            const allTags = response.data.data || []
            const petOldTags = allTags.filter(tag => tag.petId === petId)

            // 删除所有旧标签
            for (const tag of petOldTags) {
                if (tag.tagId || tag.id) {
                    try {
                        await deletePetTag(tag.tagId || tag.id)
                    } catch (err) {
                        console.error('删除标签失败:', tag.tagName, err)
                    }
                }
            }
        }

        // 添加新标签
        for (const tagName of newTags) {
            try {
                await createPetTag(petId, tagName)
            } catch (err) {
                console.error('更新标签失败:', tagName, err)
            }
        }
    } catch (err) {
        console.error('更新宠物标签失败:', err)
    }
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
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.adoption-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f7ff, #e8f4fd);
    padding-bottom: 40px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: linear-gradient(to right, #65A3F0, #88c1ff, #FDCBE6);
    box-shadow: 0 2px 10px rgba(101, 163, 240, 0.3);
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
    align-items: center;
}

.publish-btn {
    background: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    color: #65A3F0;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: #f0f7ff;
        transform: scale(1.05);
    }
}

.adoption-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    padding: 20px 30px;
}

.adoption-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }
}

.card-image {
    height: 200px;
    overflow: hidden;
    background: linear-gradient(135deg, #ffd1e0 0%, #b3d9ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.pet-image-placeholder {
    font-size: 60px;
    font-weight: 800;
    color: white;
    text-shadow: 0 4px 12px rgba(101, 163, 240, 0.4);
}

.card-content {
    padding: 15px;
}

.pet-name {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.pet-info {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.tag {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px 4px 12px;
    background: #e0f2fe;
    color: #0284c7;
    border-radius: 15px;
    font-size: 13px;
    font-weight: 500;

    button {
        width: 18px;
        height: 18px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        color: #0284c7;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
        transition: all 0.2s ease;

        &:hover {
            background: rgba(239, 68, 68, 0.8);
            color: white;
            transform: scale(1.1);
        }
    }
}

.pet-details {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 12px;

    strong {
        color: #333;
        font-weight: bold;
    }
}

.pet-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.pet-tag {
    padding: 3px 10px;
    background: #fef3c7;
    color: #d97706;
    border-radius: 15px;
    font-size: 12px;
}

.card-actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;

    &.edit-btn {
        background: #e0e7ff;
        color: #4338ca;
    }

    &.delete-btn {
        background: #fee2e2;
        color: #dc2626;
    }

    &:hover {
        opacity: 0.8;
        transform: scale(1.02);
    }
}

.empty-state {
    text-align: center;
    padding: 50px;
    color: #999;
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
    width: 95%;
    max-width: 550px;
    max-height: 95vh;
    overflow-y: visible;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid #F0F7FF;
    background: linear-gradient(to right, #65A3F0, #FDCBE6);
    border-radius: 20px 20px 0 0;

    h2 {
        font: 700 20px SimHei;
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
    padding: 20px 25px;
}

.form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 18px;
}

.form-group {
    margin-bottom: 18px;

    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #4a6fa5;
        font-size: 14px;
    }

    input,
    select {
        width: 100%;
        padding: 12px 14px;
        border: 2px solid #F0F7FF;
        border-radius: 8px;
        font-size: 15px;
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
    gap: 8px;
    padding: 10px;
    border: 2px dashed #A5CAF1;
    border-radius: 8px;
    background: #fafdff;
    min-height: 60px;
    align-items: center;
    transition: all 0.3s ease;

    &:focus-within {
        border-color: #65A3F0;
        border-style: solid;
        box-shadow: 0 0 0 4px rgba(101, 163, 240, 0.1);
        background: white;
    }

    input {
        flex: 1;
        border: none;
        background: transparent;
        padding: 0;
        min-width: 150px;
        font-size: 14px;
        color: #4a6fa5;
        outline: none;

        &::placeholder {
            color: #A5CAF1;
        }
    }
}

.existing-tags {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.existing-tag {
    background: #F0F7FF;
    color: #4a6fa5;
    padding: 6px 12px;
    border-radius: 100px;
    font-size: 13px;
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

.upload-area {
    border: 2px dashed #A5CAF1;
    border-radius: 10px;
    padding: 25px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fafdff;

    &:hover {
        border-color: #65A3F0;
        background: #f0f7ff;
    }

    &:active {
        transform: scale(0.98);
    }
}

.upload-icon {
    font-size: 36px;
    margin-bottom: 10px;
}

.upload-text {
    color: #6b7280;
    font-size: 14px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
}

.btn-secondary {
    padding: 10px 20px;
    background: #f3f4f6;
    border: none;
    border-radius: 8px;
    color: #6b7280;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: #e5e7eb;
        transform: scale(1.02);
    }
}

.btn-primary {
    padding: 10px 20px;
    background: linear-gradient(to right, #65A3F0, #88c1ff);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(101, 163, 240, 0.3);

    &:hover {
        background: linear-gradient(to right, #4a9ef0, #65A3F0);
        transform: scale(1.02);
        box-shadow: 0 6px 16px rgba(101, 163, 240, 0.4);
    }
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