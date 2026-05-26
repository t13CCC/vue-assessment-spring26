//获取自己的宠物档案
export function getFile() {
  return request({
    url: "/api/pet/all",
    method: "GET",
  });
}

//发布领养信息
export function publishAdoption(data) {
  return request({
    url: "/api/adoption/publish",
    method: "POST",
    data,
  });
}
//分页查询领养列表
export function getAdoptionList(params) {
  return request({
    url: "/api/adoption/list",
    method: "GET",
    params: {
      page: params.page || 1,
      size: params.size || 6,
      area: params.area || "",
      petType: params.petType || "",
    },
  });
}
//删除领养信息
export function deleteAdoption(id) {
  return request({
    url: `/api/adoption/delete/${id}`,
    method: "DELETE",
  });
}
//获取单个领养信息
export function getAdoptionById(id) {
  return request({
    url: `/api/adoption/${id}`,
    method: "GET",
  });
}

//编辑领养信息
export function putAdoptionDetail(data) {
  return request({
    url: `/api/adoption/update`,
    method: "PUT",
    data,
  });
}
