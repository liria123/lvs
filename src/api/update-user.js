import request from "@/utils/request";

// export const updateUser = params => {
//   return axios
//     .put(`${base}/_/api/v1/user/` + params.username, params)
//     .then(res => res.data);
// };

export function updateUser(params) {
  return request({
    url: `v1/user/${params.username}`,
    method: "put",
    data: params
  });
}
