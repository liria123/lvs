import request from "@/utils/request";

export function getServices() {
  return request({
    url: `/_/services`,
    method: "get"
  });
  // return axios.get(`${base}/_/services`);
}

