<template>
  <div>
    <!--
      inline:代表的是行内表单，代表一行可以放置多个表单元素
    -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option v-for="(c1, index) in list1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option v-for="(c2, index) in list2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option v-for="(c3, index) in list3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      //  一级分类的数据
      list1: [],
      //  二级分类的数据
      list2: [],
      //  三级分类的数据
      list3: [],
      //  手机相应的一级二级三级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    //  挂载完毕获取一级分类数据
    this.getCategory1List()
  },
  methods: {
    //  获取一级分类数据
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      } else {
        this.$message('获取一级分类数据失败')
      }
    },
    //  一级分类的select事件回调(当一级分类的option发生变化的时候获取相应二级分类的数据)
    async handler1() {
      //  解构出一级分类的id
      const { category1Id } = this.cForm
      //  通过一级分类id拿到二级分类的数据
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        //  填充二级分类数据
        this.list2 = result.data
        //  清除三级分类数据
        this.list3 = []
        //  清除选中的二级、三级分类选中
        this.cForm.category2Id = ''
        this.cForm.category3Id = ''
        //  给父组件传值
        this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      } else {
        this.$message('获取二级分类数据失败')
      }
    },
    //  二级分类的select事件回调
    async handler2() {
      //  解构出二级分类的id
      const { category2Id } = this.cForm
      //  通过二级分类id拿到三级分类的数据
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        //  填充三级分类数据
        this.list3 = result.data
        //  清除选中的三级分类数据
        this.cForm.category3Id = ''
        //  给父组件传值
        this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      } else {
        this.$message('获取三级分类数据失败')
      }
    },
    //  三级分类的select事件回调
    handler3() {
      //  结构赋值
      const { category3Id } = this.cForm
      //  给父组件传值
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style>
</style>
