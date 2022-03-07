<template>
  <div>
    <!-- 表格 -->
    <el-table :data="records" border style="width: 100%; margin: 20px auto">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="130">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column prop="prop" label="操作" width="300">
        <template slot-scope="{ row, $index }">
          <el-button
            v-if="row.isSale == 1"
            type="info"
            icon="el-icon-sort-down"
            size="mini"
            @click="cancel(row)"
          ></el-button>
          <el-button v-else type="success" icon="el-icon-sort-up" size="mini" @click="sale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      style="text-align: center"
    ></el-pagination>
    <!-- 右侧抽屉区 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              v-for="(attr, index) in skuInfo.skuAttrValueList"
              :key="attr.id"
              style="margin-right: 10px;
              margin-bottom:10px;"
            >
              {{ attr.attrId }}--{{ attr.valueId }}
            </el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px" arrow="always">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Sku',
  data() {
    return {
      //  当前页数
      page: 1,
      //  当前页面的数据条数
      limit: 10,
      //  数据总条数
      total: 0,
      //  sku列表数据
      records: [],
      //  sku详情
      skuInfo: {},
      //  抽屉显示隐藏
      show: false,
    }
  },
  methods: {
    //  获取sku列表
    async getSkuList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      let result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      } else {
        this.$message('获取sku列表失败')
      }
    },
    //  分页参数
    handleSizeChange(limit) {
      //  修改参数
      this.limit = limit
      //  获取数据
      this.getSkuList()
    },
    //  上架
    async sale(sku) {
      let result = await this.$API.sku.reqSale(sku.id)
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '上架成功',
        })
        sku.isSale = 1
      } else {
        this.$message('上架失败')
      }
    },
    //  下架
    async cancel(sku) {
      let result = await this.$API.sku.reqCancel(sku.id)
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '下架成功',
        })
        sku.isSale = 0
      } else {
        this.$message('下架失败')
      }
    },
    //  编辑
    edit() {
      this.$message('正在开发中...')
    },
    //  获取sku详情
    async getSkuInfo(sku) {
      let result = await this.$API.sku.reqSkuById(sku.id)
      if (result.code == 200) {
        //  存储数据
        this.skuInfo = result.data
        //  展示内容
        this.show = true
      } else {
        this.$message('获取sku详情失败')
      }
    },
  },
  mounted() {
    //  获取数据
    this.getSkuList()
  },
}
</script>
<style>
/* 跑马灯样式 */
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
<style scoped>
/* 抽屉内容样式 */
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
.el-col {
  margin: 10px 10px;
}
</style>
