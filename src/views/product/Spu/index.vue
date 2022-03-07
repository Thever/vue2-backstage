<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动已经是全局组件了 getCategoryId自定义事件返回分类内容 props show用来是否禁用下拉菜单 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <!-- 底部这里将来是有三部分进行切换的 -->
      <div v-show="scene == 0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table border :data="records" style="width: 100%; margin: 10px auto">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的按钮用hintButton替换 -->
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu所有sku列表" @click="handler(row)"></HintButton>
              <el-popconfirm title="是否要删除这个SPU？" @onConfirm="deleteSpu(row)">
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!--
            layout 中的 -> 表示占位空格，让后面的sizes, total靠右对齐
          -->
        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          layout="prev, pager, next, jumper, ->, sizes, total"
          style="text-align: center"
        ></el-pagination>
      </div>
      <SpuForm v-show="scene == 1" ref="spu" @changeScene="changeScene"></SpuForm>
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- table展示sku列表 -->
      <el-table v-loading="loading" border :data="skuList" style="width: 100%">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row, $index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
//  引入子组件
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  props: [],
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      //  分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      //  控制三级联动的可操作性
      // show: true,
      //  分页器相关
      //  当前第几页
      page: 1,
      //  每一页需要展示多少条数据
      limit: 3,
      //  spu列表数据
      records: [],
      //  数据总条数
      total: 0,
      //  展示场景切换 0展示SPU列表数据 1添加SPU|修改SPU 2添加SKU
      scene: 0,
      //  控制dialog对话框的显示隐藏
      dialogTableVisible:false,
      //  dialog spu信息容器
      spu:{},
      //  存储sku列表数据
      skuList:[],
      //  sku列表数据是否loading
      loading: true
    }
  },
  methods: {
    //  点击分页器的第几页按钮的回调
    // handleCurrentChange(page) {
    //   //  修改当前页
    //   this.page = page
    //   //  请求数据
    //   this.getSpuList()
    // },
    //  三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      //  根据参数获取属性
      //  categoryId:获取到一、二、三级分类的id
      //  level:为了区分几级id
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        //  获取SPU列表数据进行展示
        this.getSpuList()
      }
    },
    //  获取SPU列表数据
    //  @current-change回调会传入当前页数
    async getSpuList(pages = 1) {
      //  如果传入参数了就赋值
      this.page = pages
      //  保证请求页数至少为1，不为0
      this.page < 1 && (this.page = 1)
      //  解构出参数
      const { page, limit, category3Id } = this
      //  携带三个参数： page 第几页 limit 每一页展示多少条数据 category3Id 三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code == 200) {
        //  请求成功
        this.records = result.data.records
        this.total = result.data.total
      } else {
        //  请求失败
        this.$message('请求SPU列表数据失败')
      }
    },
    //  当分页器的某一页展示数据条数发生变化的回调
    handleSizeChange(limit) {
      //  修改参数
      this.limit = limit
      //  发请求
      this.getSpuList()
    },
    //  添加SPU按钮的回调
    addSpu(category3Id) {
      //  切换场景
      this.scene = 1
      //  通知子组件SpuForm发请求--两个
      this.$refs.spu.addSpuData(this.category3Id)
    },
    //  修改某一个SPU
    updateSpu(row) {
      //  获取子组件SpuForm子组件的方法，发送请求
      this.$refs.spu.initSpuData(row)
      //  切换场景
      this.scene = 1
    },
    //  自定义事件回调(SpuForm)
    changeScene({ scene, flag }) {
      //  flag形参为了曲风保存按钮是添加还是修改
      //  切换结构(场景)
      this.scene = scene
      //  重新请求数据刷新界面,停留在当前页
      // this.getSpuList(this.page)
      //  根据参数设置请求页数
      if (flag == '修改') {
        //  修改留在当前页
        this.getSpuList(this.page)
      } else {
        //  添加留在第一页
        this.getSpuList()
      }
    },
    //  删除spu的回调
    async deleteSpu(row) {
      //  请求接口删除
      let result = await reqDeteleSpu(row.id)
      if (result.code == 200) {
        //  提示
        this.$message({
          type: 'success',
          message: '删除成功！',
        })
        //  重新获取列表数据,当前列表数据大于1，停留在当前页，否则停留在上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      } else {
        this.$message('请求删除spu失败')
      }
    },
    //  添加SKU按钮的回调
    addSku(row) {
      //  切换场景为2
      this.scene = 2
      //  父组件调用子组件的方法，让子组件发请求----三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    //  skuform通知父组件修改场景
    changeScenes(scene) {
      //  切换场景
      this.scene = scene
    },
    //  查看SKU的按钮的回调
    async handler(spu){
      //  显示对话框
      this.dialogTableVisible = true
      //  传入信息
      this.spu = spu
      //  获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id)
      if(result.code == 200){
        this.skuList = result.data
        //  去除loading
        this.loading = false
      }else{
        this.$message('获取sku列表失败')
      }
    },
    //  关闭dialog处理
    close(done){
      //  加载loading
      this.loading = true
      //  清除数据
      this.skuList = []
      //  关闭对话框
      done()
    }
  },
}
</script>

<style>
</style>
