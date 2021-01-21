import request from '@/utils/request';

export function getTaskList(groupid, startdate, enddate) {
  return request({
    url: `/v1/workgroup/${groupid}/task?startdate=${startdate}&enddate=${enddate}`,
    method: 'get'
  })
}
