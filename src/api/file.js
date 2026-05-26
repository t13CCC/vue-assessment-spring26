import request from "@/utils/request";

// 获取所有宠物
export function downloadFile() {
  return request({
    url: "/api/pet/all",
    method: "GET",
  });
}

// 创建宠物
export function createPet(data) {
  return request({
    url: "/api/pet/create",
    method: "POST",
    data,
  });
}

// 更新宠物
export function updatePet(data) {
  return request({
    url: "/api/pet/update",
    method: "PUT",
    data,
  });
}

// 删除宠物
export function deletePet(id) {
  return request({
    url: `/api/pet/delete/${id}`,
    method: "DELETE",
  });
}

//创建宠物标签
export function createPetTag(petId, tagName) {
  return request({
    url: "/api/petTag",
    method: "POST",
    data: {
      petId,
      tagName,
    },
  });
}

//获取单个宠物标签
export function getPetTag(tagId) {
  return request({
    url: `/api/petTag/${tagId}`,
    method: "GET",
  });
}

//分页查询宠物标签
export function getPetTags(params) {
  return request({
    url: "/api/petTag/page",
    method: "POST",
    data: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 100,
      tagContent: params.tagContent || "",
      tagId: params.tagId || "",
      tagName: params.tagName || "",
    },
  });
}

//修改宠物标签
export function updatePetTag(tagId, tagName) {
  return request({
    url: `/api/petTag/${tagId}`,
    method: "PUT",
    data: {
      tagName,
    },
  });
}

//删除宠物标签
export function deletePetTag(tagId) {
  return request({
    url: `/api/petTag/${tagId}`,
    method: "DELETE",
  });
}
