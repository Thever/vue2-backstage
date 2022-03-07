//  将product四个模块请求的接口函数统一暴露
import * as trademark from "./product/trademark";
import * as attr from "./product/attr.js";
import * as sku from "./product/sku";
import * as spu from "./product/spu";

//  引入权限相关的接口文件
import * as user from "./acl/user";
import * as role from "./acl/role";
import * as permission from "./acl/permission";

//  对外暴露
export default { trademark, attr, sku, spu, user, role, permission };
