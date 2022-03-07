//  这个模块主要获取的是品牌管理的数据模块
/* eslint-disable */
import request from "@/utils/request";

//  获取品牌列表接口 page当前页 limit当前分页每页展示的数量
//  GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => {
  return request({
    url: `admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });
};

//  新增品牌
//  POST /admin/product/baseTrademark/save 携带两个参数 logoUrl品牌logo图片地址 tmName品牌名称
//  对于新增的品牌，给服务器传递数据，不需要传递ID，ID是由服务器生成的

//  修改品牌
// PUT /admin/product/baseTrademark/update 携带三个参数 logoUrl品牌logo图片地址 tmName品牌名称 id品牌id
//  对于修改某一个品牌的操作，前端携带的参数需要带上id,你需要告诉服务器修改的是哪一个品牌

export const reqAddOrUpdateTrademark = (tradeMark) => {
  if (tradeMark.id) {
    //  修改品牌
    return request({
      url: `/admin/product/baseTrademark/update`,
      method: "put",
      data: tradeMark,
    });
  } else {
    //  新增品牌
    return request({
      url: `/admin/product/baseTrademark/save`,
      method: "post",
      data: tradeMark,
    });
  }
};

//  删除品牌
// DELETE /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) => {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: "delete",
  });
};
