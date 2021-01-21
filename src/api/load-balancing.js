import request from "@/utils/request";

// 虚拟服务配置
// 查询工作组下的所有 virtual_server
export function AllselectVirtualServer(groupId) {
  return request({
    url: `v1/workgroup/${groupId}/selectvirtualserver`,
    method: "get"
  });
}
// 查询单个virtual_server
export function selectVirtualServer(groupId, virtualserverid) {
  return request({
    url: `v1/workgroup/${groupId}/selectvirtualserver/${virtualserverid}`,
    method: "get"
  });
}
// 插入一个virtual_server
export function addVirtualConfig(groupId, virtualServer) {
  return request({
    url: `v1/workgroup/${groupId}/insertvirtualserver`,
    method: "post",
    data: virtualServer
  });
}
// 删除一个virtual_server
export function removeVirtualConfig(groupId, virtualserverid) {
  return request({
    url: `v1/workgroup/${groupId}/virtualserver/${virtualserverid}`,
    method: "delete"
  });
}
// 更新一个virtual_server
export function updateVirtualConfig(groupId, virtualserverid, virtualServer) {
  return request({
    url: `v1/workgroup/${groupId}/virtualserver/${virtualserverid}`,
    method: "put",
    data: virtualServer
  });
}

// 真实服务配置
// 查询单个virtual_server下的所有Realserver
export function getAllRealserver(groupId, virtualserverid) {
  return request({
    url: `v1/workgroup/${groupId}/virtualserver/${virtualserverid}/selectrealserver`,
    method: "get"
  });
}
// 查询单个virtual_server下的单个Realserver
export function getRealserver(groupId, virtualserverid, realserverid) {
  return request({
    url: `v1/workgroup/${groupId}/virtualserver/${virtualserverid}/selectrealserver/${realserverid}`,
    method: "get"
  });
}
// 插入一个Realserver
export function addRealConfig(groupId, virtualserverid, realServer) {
  return request({
    url: `v1/workgroup/${groupId}/virtualserver/${virtualserverid}/insertrealserver`,
    method: "post",
    data: realServer
  });
}
// 更新一个Realserver
export function updateRealConfig(groupId, virtualserverid, realserverid, realServer) {
  return request({
    url: `v1/workgroup/${groupId}/virtualserver/${virtualserverid}/realserver/${realserverid}`,
    method: "put",
    data: realServer
  });
}
// 删除一个Realserver
export function removeRealConfig(groupId, virtualserverid, realserverid) {
  return request({
    url: `v1/workgroup/${groupId}/virtualserver/${virtualserverid}/realserver/${realserverid}`,
    method: "delete"
  });
}

// 下拉框 vip
export function selectVip(groupId, nodeid, instanceid) {
  return request({
    url: `v1/workgroup/${groupId}/node/${nodeid}/instance/${instanceid}`,
    method: "get"
  });
}
// // 批量新增 real_server
// export function insertRealserverconfigs(workgroupId, vsport, realServers) {
//   return request({
//     url: `v2/workgroup/${workgroupId}/insertRealserverconfigs/${vsport}`,
//     method: "post",
//     data: realServers
//   });
// }
