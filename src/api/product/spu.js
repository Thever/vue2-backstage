//  这个模块主要获取的是Spu管理的数据模块
/* eslint-disable */
import request from "@/utils/request";

//  获取Spu列表接口 page当前页 limit当前分页每页展示的数量 三级分类id category3Id
//  GET /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => {
  return request({
    url: `admin/product/${page}/${limit}`,
    method: "get",
    params: { category3Id },
  });
};

//  通过SpuId获取Spu信息
// GET /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => {
  return request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: "get",
  });
};

//  获取品牌信息
// GET /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () => {
  return request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: "get",
  });
};

//  获取Spu图片的接口
// GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });
};

//  获取品台全部销售属性 ---- 整个平台销售属性最多3个
// GET /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => {
  return request({
    url: `/admin/product/baseSaleAttrList`,
    method: "get",
  });
};

//  修改SPU|添加SPU：对于修改或添加，携带给服务器参数大致一样的，唯一的区别就是携带的参数是否携带id
//  POST /admin/product/saveSpuInfo 添加SPU
//  POST /admin/product/updateSpuInfo 修改SPI
export const reqAddOrUpdateSpu = (spuInfo) => {
  //  携带的参数带有id ------修改spu
  if (spuInfo.id) {
    return request({
      url: `/admin/product/updateSpuInfo`,
      method: "POST",
      data: spuInfo,
    });
  } else {
    //  携带的参数不带id ------ 添加spu
    return request({
      url: `/admin/product/saveSpuInfo`,
      method: "POST",
      data: spuInfo,
    });
  }
};

//  删除SPU
// DELETE /admin/product/deleteSpu/{spuId}
export const reqDeteleSpu = (spuId) => {
  return request({
    url: `admin/product/deleteSpu/${spuId}`,
    method: "DELETE",
  });
};

//  获取销售属性的数据
//  GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => {
  return request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: "get",
  });
};

//  获取平台属性的数据
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });
};

//  保存sku
// POST /admin/product/saveSkuInfo
export const reqSaveSku = (category1Id, category2Id, category3Id) => {
  return request({
    url: `admin/product/saveSkuInfo`,
    method: "post",
  });
};

//  添加sku
// POST /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => {
  return request({
    url: `/admin/product/saveSkuInfo`,
    method: "post",
    data: skuInfo,
  });
};

//  获取SKU列表数据的接口
//  GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => {
  return request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: "get",
  });
};
