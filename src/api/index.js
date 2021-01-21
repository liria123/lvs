import request from "@/utils/request";

// 获取所有工作组
export function getWorkGroupAll() {
  return request({
    url: "/v1/workgroup/select",
    method: "get"
  });
}

// 添加工作组
export function addWorkGroup(param) {
  return request({
    url: "/v1/workgroup",
    method: "post",
    params: param.data
  });
}

// 删除工作组
export function deleteWorkGroup(param) {
  return request({
    url: `/v1/workgroup/${param.id}`,
    method: "delete"
  });
}

// 更新工作组
export function updateWorkGroup(param) {
  return request({
    url: `/v1/workgroup/${param.id}`,
    method: "put",
    params: param.data
  });
}

// deploy发布
export function modifyConfig(groupId) {
  return request({
    url: `v1/workgroup/${groupId}/modify`,
    method: 'get'
  })
}
