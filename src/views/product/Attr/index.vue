<template>
  <div>
    <el-card class="box-card" style="margin: 20px 0">
      <!-- 使用自定义事件获取数据返回 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"/>
    </el-card>
    <el-card class="box-card">
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性值</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table border style="width: 100%; margin: 20px 0" :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="attrValueList" label="属性值列表" width="width">
            <!-- 自定义内容需要用到作用域插槽 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin-top: 10px; margin-right: 10px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">
          添加属性值
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table border style="width: 100%; margin: 20px 0" :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里结构需要用到span与inout进行来回的切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Attr',
  data() {
    return {
      //  接受三级联动属性
      category1Id: '',
      category2Id: '',
      category3Id: '',
      //  接受平台属性
      attrList: [],
      //  是否显示表格区域
      isShowTable: true,
      //  收集新增属性|修改属性
      attrInfo: {
        //  属性名
        attrName: '',
        //  属性值，属性值有多个，因此用数组
        //  每一个属性值都是一个对象，需要attrId,valueName
        //  attrId 属性名id valueName 对一个能属性名
        attrValueList: [
          // {
          //   attrId: 0,
          //   valueName: 'string',
          // },
        ],
        //  三级分类id
        categoryId: '',
        //  默认三级分类，为3,给服务器区分id
        categoryLevel: 3,
      },
    }
  },
  methods: {
    //  自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //  根据参数获取属性
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        //  发请求获取平台属性的数据
        this.getAttrList()
      }
    },
    //  获取平台属性的数据
    async getAttrList() {
      //  解构参数
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code == 200) {
        //  赋值
        this.attrList = result.data
      } else {
        this.$message('获取平台属性失败')
      }
    },
    //  添加属性值
    addAttrValue() {
      //  向属性值数组里添加元素
      //  attrId: 对应属性的id,添加新的属性没有对应id返回undefined,修改属性内容会携带
      //  valueName:相应的属性值的名称
      //  flag:记录input与span的切换状态，默认为真,显示input
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true,
      })
      //  让新增的属性值获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    //  添加属性按钮的回调
    addAttr() {
      //  清除数据
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        //  收集三级分类id
        categoryId: this.category3Id,
        categoryLevel: 3,
      }
      //  切换table显示与隐藏
      this.isShowTable = false
    },
    //  修改某个属性
    updateAttr(row) {
      //  将选中的属性赋值给attrInfo
      //  由于数据结构当中存在对象里面套数组，数组里面有套对象，因此需要深拷贝来解决这个问题
      this.attrInfo = JSON.parse(JSON.stringify(row))
      //  将控制显示的属性添加起来
      this.attrInfo.attrValueList.forEach((item) => {
        //  这样书写可以添加flag字段，但是视图不会跟着变化 ==> flag不是响应式数据
        //  item.flag = false
        //  使用$set来添加响应式数据
        //  第一个参数：对象 第二个参数：添加新的响应式属相 第三个参数：新的属性的属性值
        this.$set(item, 'flag', false)
      })
      //  切换显示
      this.isShowTable = false
    },
    //  失去焦点的事件 ---- 切换为查看模式, 展示span
    toLook(row) {
      //  row:形参是当前用户添加的最新的属性值
      //  如果属性值为空，不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() == '') {
        this.$message('请输入一个正常的属性值')
        return
      }
      //  新增的属性值不能与已有的属性值重复
      //  如果有重复的话 isRepeat为true 否则为false
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        //  需要将row从数组里面判断的时候去除
        //  row是最新新增的属性值[数组的最后一项元素]
        //  判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName
        }
      })
      if (isRepeat) {
        this.$message('请勿输入相同属性值')
        return
      }
      //  修改对应的状态，让编辑模式转换成查看模式
      row.flag = false
    },
    //  点击span的回调，变为编辑模式
    toEdit(row, index) {
      //  切换编辑模式
      row.flag = true
      //  聚焦对应的input
      //  注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重排需要消耗事件
      //  点击psan的时候，重绘重排一个input需要耗费事件，因此我们不可能一点击span就立马获取到input
      //  用$nextTick来解决渲染延迟问题,在input渲染完成后执行
      this.$nextTick(() => {
        //  让对应的input获取焦点
        this.$refs[index].focus()
      })
    },
    //  气泡确认框确定按钮的回调
    //  注意比对当前项目与文档手册的element-ui的版本号
    //  最新版本的ElementUI ---- 2.15.6 目前模板中的版本号2.13.x
    deleteAttrValue(index) {
      //  从数组中删除对应内容
      //  不需要请求接口，因为最后会有保存或取消的操作，保存会将状态提交给后台
      this.attrInfo.attrValueList.splice(index, 1)
    },
    //  保存按钮：进行添加属性或修改属性的操作
    async addOrUpdateAttr() {
      //  整理参数
      //  1.如果用户添加了很多属性值，且属性值为空的不应该提交给服务器
      //  2.提交给服务器数据中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        //  过滤掉属性值不为空的
        if(item.valueName.trim()!=''){
          //  删除掉flag属性
          delete item.flag
          return true
        }
      })
      try {
        //  发请求保存数据，系统设定的属性不能修改
        //  使用的是 家用电器 厨卫大电 油烟机，接口可以跑通
        const result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        if(result.code === 200){
          //  提示
          this.$message({
            message: '保存数据成功！',
            type: 'success'
          });
          //  视图切换
          this.isShowTable = true
          //  刷新数据
          this.getAttrList()
        }else{
          this.$message('保存数据失败！')
        }
      } catch (error) {

      }
    }
  },
}
</script>

<style>
</style>
