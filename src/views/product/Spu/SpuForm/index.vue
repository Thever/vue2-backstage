<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option v-for="(tm, index) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="text-area" rows="4" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 照片墙 -->
        <!--
          上传图片
          action:设置图片上传的地址,注意这里写的地址要写全，不会添加请求前缀，不会被代理转发
          list-type:文件列表类型， picture-card照片墙
          file-list:照片墙需要展示的数据[数组：数组里面的元素务必要有name、url属性]
          on-preview:图片预览时触发
          on-remove:删除图片时触发
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" style="margin-left: 10px; margin-bottom: 10px" @click="addSaleAttr">
          添加销售属性
        </el-button>
        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table border style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column type="index" prop="prop" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="120"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- el-tag:用户展示已有属性值列表的数据的 -->
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 底下结构可以当成理解成span与input的切换 -->
              <!-- @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)"
              ></el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">+添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="120">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'SpuForm',
  data() {
    return {
      //  照片预览图片地址
      dialogImageUrl: '',
      //  是否显示照片预览遮罩
      dialogVisible: false,
      //  存储Spu信息属性,默认为空对象,在修改SPU的时候，会向服务器发请求，返回SPU信息(对象)，在修改的时候可以利用服务器返回的这个对象手机最新的数据提交给服务器
      //  添加SPU，如果是添加SPU时候并没有向服务器发请求，数据也收集到SPU,收集数据也需要有对应的属性
      spu: {
        //  三级分类的id
        category3Id: 0,
        //  品牌id
        tmId: '',
        //  描述
        description: '',
        //  spu名称
        spuName: '',
        //  spu名字列表
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   spuId: 0,
          // },
        ],
        //  平台属性与属性值
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      //  存储品牌信息
      tradeMarkList: [],
      //  存储Spu图片的数据
      spuImageList: [],
      //  销售属性数据
      saleAttrList: [],
      //  收集未选择的销售属性id ----
      attrIdAndAttrName:'',
    }
  },
  methods: {
    //  照片墙删除照片
    handleRemove(file, fileList) {
      //  file删除的图片
      //  fileList照片墙删掉照片后剩余的其他图片
      //  收集照片墙图片的数据
      //  对于已有的照片[照片墙中显示的图片：有name、url字段的]，因为照片墙显示数据务必要有这两个属性
      //  对于服务器而言，不需要name、url字段，将来对于有的图片的数据再提交给服务器的时候，需要处理的。
      this.spuImageList = fileList
    },
    //  照片墙图片预览的回调
    handlePictureCardPreview(file) {
      //  替换照片预览的图片路径
      this.dialogImageUrl = file.url
      //  显示照片预览
      this.dialogVisible = true
    },
    //  照片墙图片上传成功回调
    handlerSuccess(response, file, fileList){
      //  response 图片上传成功接口回调
      //  file 上传成功的图片信息
      //  fileList 图片上传成功后，照片墙的照片信息
      //  收集照片墙图片的数据
      //  对于已有的照片[照片墙中显示的图片：有name、url字段的]，因为照片墙显示数据务必要有这两个属性
      //  对于服务器而言，不需要name、url字段，将来对于有的图片的数据再提交给服务器的时候，需要处理的。
      this.spuImageList = fileList
    },
    //  初始化SpuForm数据
    async initSpuData(spu) {
      //  获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code == 200) {
        //  赋予spu属性
        this.spu = spuResult.data
      }
      //  获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList()
      if (trademarkResult.code == 200) {
        this.tradeMarkList = trademarkResult.data
      }
      //  获取Spu图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code == 200) {
        //  由于照片墙显示图片的数据需要数据，数组里面的元素需要有name与url字段
        //  需要把服务器返回的数据进行修改
        let listArr = spuImageResult.data
        listArr.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        //  数组进行变更或替换，可以被检测到
        this.spuImageList = listArr
      }
      //  获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    //  添加新的销售属性
    addSaleAttr() {
      //  已经手机需要添加的销售属性的信息
      //  把收集到的销售属性数据进行分割
      const [ baseSaleAttrid, saleAttrName ] = this.attrIdAndAttrName.split(':')
      //  向SPU对象的spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr = { baseSaleAttrid, saleAttrName, spuSaleAttrValueList:[]}
      //  添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      //  清空数据
      this.attrIdAndAttrName = ''
    },
    //  添加按钮的回调
    addSaleAttrValue(row){
      //  点击销售属性值当中添加按钮的时候，需要由button变为input，通过当前销售属性的inputVisible控制
      //  挂载在销售属性身上的响应式数据inputVisible，控制button与input的切换
      this.$set(row,'inputVisible',true)
      //  通过响应式数据inputValue字段收集现在的销售属性值
      this.$set(row,'inputValue','')
    },
    //  el-input失去焦点的事件
    handleInputConfirm(row){
      //  解构出销售属性当中的数据
      const { baseSaleAttrId, inputValue } = row
      //  新增的销售属性值的名称不能为空
      if(inputValue.trim() == ''){
        this.$message('属性值不能为空')
        return
      }
      //  添加的属性值不能重复
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
      if(!result){
        this.$message('添加的属性值不能重复')
        return
      }
      //  整理数据结构
      let newSaleAttrValue = {baseSaleAttrId, saleAttrValueName:inputValue}
      //  新增数据
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      //  修改inputVisible为false,就显示button了
      row.inputVisible = false
    },
    //  保存按钮的回调
    async addOrUpdateSpu(){
      //  整理参数：需要整理照片墙的数据
      //  携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName:item.name,
          imgUrl:(item.response&&item.response.data)||item.url
        }
      })
      //  发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code == 200){
        //  提示
        this.$message({
          type:'success',
          message:'保存成功'
        })
        //  父组件切换场景
        this.$emit('changeScene', {scene:0,flag:this.spu.id?'修改':'添加'})
        //  重置组件状态
        Object.assign(this._data, this.$options.data())
      }else{
        this.$message(`添加或编辑失败`)
      }
    },
    //  点击添加Spu按钮的时候，发请求的函数
    async addSpuData(category3Id){
      //  添加spu的时候收集三级分类的id
      this.category3Id = category3Id
      //  获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList()
      if (trademarkResult.code == 200) {
        this.tradeMarkList = trademarkResult.data
      }
      //  获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    //  取消按钮
    cancel(){
      //  切换场景为0
      this.$emit('changeScene', {scene:0,flag:''})
      //  清空数据
      //  Object.assign(a,b):es6中合并对象的方法，把b对象合并到a当中
      //  组件实例this._data,可以操作data当中响应式数据，返回当前组件的响应式数据
      //  this.$options 当前组件的配置对象 this.$options.data() 配置对象中的data函数，也就是返回data函数的初始值
      //  合并当前data数据与data默认值，也即是将当前数据恢复默认，也就是清空数据了
      Object.assign(this._data, this.$options.data())
    }
  },
  computed:{
    //  计算出还未选择的销售属性
    unSelectSaleAttr(){
      //  整个平台的销售属性一共三个：颜色、尺寸、版本 ---- saleAttrList
      //  当前SPU拥有的属于自己的销售属性SPU.spuSaleAttrList ---- 颜色
      //  通过数组过滤来实现,可以从已有的数组当中过滤出用户需要的元素，并且返回一个新的数组
      //  return true 表示需要的元素 return false表示不需要的元素
      //  循环整个销售属性
      let result = this.saleAttrList.filter(item => {
        //  every数组的方法，会返回一个布尔值，取决于判断结果
        //  如果当前销售属性不存在于整个平台销售属性就，就返回
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  }
}
</script>

<style scoped>
/* tag标签样式 */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
