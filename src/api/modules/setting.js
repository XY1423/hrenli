/**
 * 获取角色列表
 * ***/
 import request from '@/utils/request'

 export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 获取公司信息
 * **/
 export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}