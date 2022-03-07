//  这个模块主要获取的是Sku管理的数据模块
/* eslint-disable */
import request from "@/utils/request";

//  sku列表的接口
//  GET /admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => {
  return request({
    url: `/admin/product/list/${page}/${limit}`,
    method: "get",
  });
};

//  sku上架
// GET /admin/product/onSale/{skuId}
export const reqSale = (skuId) => {
  return request({
    url: `/admin/product/onSale/${skuId}`,
    method: "get",
  });
};

//  sku下架
// GET /admin/product/cancelSale/{skuId}
export const reqCancel = (skuId) => {
  return request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: "get",
  });
};

//  获取sku详情
// GET /admin/product/getSkuById/{skuId}
export const reqSkuById = (skuId) => {
  return request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: "get",
  });
};
