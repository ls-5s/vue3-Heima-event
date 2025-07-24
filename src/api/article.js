// import { request } from '@/utils/request.js'
import request from '@/utils/request.js'
export const artGetChannelsService = () => request.get('/my/cate/list')

export const artAddChannelsService = ((data) => {
  return request.post('/my/cate/add', data)
})
export const artEditChannelsService = (data) => {
  return request.put('/my/cate/info', data)
}
export const artDelChannelsService = (id) => {
  return request.delete('/my/cate/del', { params: { id } })
}
export const artGetArticleService = (params) => {
  return request.get('/my/article/list', { params })
}
export const artPublishService = (data) => {
  return request.post('/my/article/add', data)
}
export const artEditService = (data) => {
  return request.put('/my/article/info', data)
}
// 文章：获取文章详情
export const artGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })
// 文章：删除文章接口
export const artDelService = (id) => {
  return request.delete('/my/article/info', { params: { id } })
}

