import request from '@/utils/request';

// server-node
export function getServerNode(groupId) {
  return request({
    url: `/v1/${groupId}/node`,
    method: 'get'
  })
}

export function addMasterNode(groupId, data) {
  return request({
    url: `v1/${groupId}/node`,
    method: 'post',
    data
  })
}

export function addBackupNode(groupId, data) {
  return request({
    url: `v1/${groupId}/node`,
    method: 'post',
    data
  })
}

export function updateServerNode(groupId, nodeId, data) {
  return request({
    url: `v1/${groupId}/node/${nodeId}`,
    method: 'put',
    data
  })
}

export function deleteServerNode(groupId, nodeId, data) {
  return request({
    url: `v1/${groupId}/node/${nodeId}`,
    method: 'delete'
  })
}

// export function getAllInstances(groupid, nodeId) {
//   return request({
//     url: `/v1/workgroup/${groupid}/node/${nodeId}/allinstance`,
//     method: 'get'
//   })
// }

export function getInstanceundernode(groupid, nodeId) {
  return request({
    url: `/v1/workgroup/${groupid}/node/${nodeId}/instanceundernode`,
    method: 'get'
  })
}

export function getNodeConfig(groupid) {
  return request({
    url: `/v1/workgroup/${groupid}/selectglobalconfig`,
    method: 'get'
  })
}

export function updateGlobalConfig(groupId, globalConfigid, globalConfig) {
  return request({
    url: `v1/workgroup/${groupId}/globalconfig/${globalConfigid}`,
    method: 'put',
    data: globalConfig
  })
}

// vrrp-instance

export function addSyncConfig(groupid, nodeid, syncConfig) {
  return request({
    url: `v1/workgroup/${groupid}/node/${nodeid}/vrrpinstance`,
    method: 'post',
    data: syncConfig
  })
}

export function updateSyncConfig(groupid, syncConfig) {
  return request({
    url: `v1/workgroup/${groupid}/InstanceSyncConfig`,
    method: 'put',
    data: syncConfig
  })
}

export function updateAsyncConfig({ groupid, nodeid, instanceid }, asyncConfig) {
  return request({
    url: `v1/workgroup/${groupid}/node/${nodeid}/vrrpinstance/${instanceid}`,
    method: 'put',
    data: asyncConfig
  })
}

export function getVip({ groupid, nodeid, instanceid }) {
  return request({
    url: `/v1/workgroup/${groupid}/node/${nodeid}/instance/${instanceid}`,
    method: 'get'
  })
}

export function addVip({ groupid, nodeid, instanceid }, vrrpInstanceVip) {
  return request({
    url: `/v1/workgroup/${groupid}/node/${nodeid}/instance/${instanceid}`,
    method: 'post',
    params: vrrpInstanceVip
  })
}

export function updateVip({ groupid, nodeid, instanceid }, vipid, vrrpInstanceVip) {
  return request({
    url: `/v1/workgroup/${groupid}/node/${nodeid}/instance/${instanceid}/vip/${vipid}`,
    method: 'put',
    params: vrrpInstanceVip
  })
}

export function removeVip({ groupid, nodeid, instanceid }, vipid) {
  return request({
    url: `/v1/workgroup/${groupid}/node/${nodeid}/instance/${instanceid}/vip/${vipid}`,
    method: 'delete'
  })
}

export function removeInstanceConfig({ groupid, nodeid, instanceid }) {
  return request({
    url: `v1/workgroup/${groupid}/node/${nodeid}/vrrpinstance/${instanceid}`,
    method: 'delete'
  })
}
