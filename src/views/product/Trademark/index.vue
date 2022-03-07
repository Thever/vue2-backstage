<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>
    <!--
      表格组件
      data:表格罪案将来需要展示的数据-------数组类型
      border:给表格欠佳边框
      column属性：
        label:显示的标题
        width:对应列的宽度
        align:文字对齐方式
        注意1：elementUI当中的table组件，展示的数据是以一列进行展示数据
    -->
    <el-table border :data="list" style="width: 100%">
      <el-table-column type="index" prop="prop" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- 渲染图片使用作用域插槽来实现，接收 row 参数行信息， $index当前序号, 不能使用其他的名字 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" :title="$index" style="width: 100px; heihgt: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <!-- 同理解构出参数 -->
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTrademark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrdeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页器
      当前第几页、数据总条数、每一页展示条数、连续页码数
      @size-change="handleSizeChange" 更改当前页面渲染数量
      @current-change="handleCurrentChange" 当前页改变触发
      current-page:分页器当前页数
      total:分页器数据总条数
      page-size:每一页展示多少条数据
      page-sizes:设置每一页展示多少条数据
      layout:实现分页器布局
      pager-count:按钮的数量 如果9 连续页面数量为7 因为最前最后各包含一个按钮
      layout 中的 -> 表示占位空格，让后面的sizes, total靠右对齐
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes,total"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!--
        form表单 model属性，这个属性的作用是，把表单的数据收集到哪个对象的身上，将来表单验证也需要这个属性
        Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
      -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!--
            :on-success="handleAvatarSuccess" 图片上传之后回调
            :before-upload="beforeAvatarUpload" 图片上传之前回调
          -->
          <!--
            这里收集数据：不能使用v-model，因为不是表单元素
            action:设置图片上传的地址,注意这里写的地址要写全，不会添加请求前缀，不会被代理转发
            :on-success:可以监测图片上传成功，当图片上传成功，会执行一次
            :before-upload:可以在上传图片之前，会执行一次
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Trademark',
  data() {
    //  自定义校验规则 --- 品牌名称
    var validateTmName = (rule, value, callback) => {
      //  rule规则 value用户输入的内容 callback通过放行函数
      //  自定义校验规则
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称2-10位'))
      } else {
        callback()
      }
    }
    return {
      //  分页器第几页
      page: 1,
      //  当前页数展示数据的条数
      limit: 3,
      //  总共数据条数
      total: 0,
      //  列表展示的数据
      list: [],
      //  是否显示对话框
      dialogFormVisible: false,
      //  上传图片使用的属性
      imageUrl: '',
      //  收集品牌信息,对象身上的属性，要参考接口传参
      tmForm: {
        tmName: '',
        logoUrl: '',
      },
      //  表单验证规则
      rules: {
        //  品牌名称验证规则
        //  require:必须要校验的字段(前面五角星有关系) message提示信息 trigger用户行为设置
        //  min最小长度 max最大长度
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          //  自定义校验规则
          { validator: validateTmName, trigger: 'change' },
        ],
        //  品牌logo验证规程
        logoUrl: [{ required: true, message: '请上传品牌logo' }],
      },
    }
  },
  //  组件挂载完毕
  mounted() {
    //  获取列表数据
    this.getPageList()
  },
  methods: {
    //  请求列表数据
    async getPageList(pager = 1) {
      //  如果没有传入pager,就将当前页数设置为1，否则使用传入的pager参数
      this.page = pager
      //  不能按照上述方法处理limit参数，因为下面结构已经定义过 limit 参数了
      //  解构出参数
      const { page, limit } = this
      //  获取品牌列表接口
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (result.code === 200) {
        //  分别展示数据的总条数与列表数据
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    //  当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit) {
      console.log(limit)
      //  整理参数
      this.limit = limit * 1
      //  请求数据
      this.getPageList()
    },
    //  显示dialog,点击添加品牌
    showDialog() {
      //  清除旧数据
      this.tmForm = {
        tmName: '',
        logoUrl: '',
      }
      //  显示dialog
      this.dialogFormVisible = true
    },
    //  修改某一品牌
    updateTrademark(row) {
      //  row：当前用户选中的品牌信息
      //  console.log(row)
      //  将已有的品牌信息赋值给tmForm用来展示
      //  为啥没确定保存，取消关闭dialog也会修改表格数据？
      //  将服务器返回的品牌信息，直接赋值给了tmForm进行展示
      //  也就是说tmForm即为服务器返回的品牌信息
      // this.tmForm = row
      //  深拷贝不能拷贝Observer
      // this.tmForm = JSON.stringify(JSON.parse(row))
      //  使用浅拷贝解决
      this.tmForm = { ...row }
      //  打开dialog
      this.dialogFormVisible = true
    },
    //  上传图片成功回调
    handleAvatarSuccess(res, file) {
      //  res: 上传成功之后返回给前端数据
      //  file: 上传成功之后服务器返回前端数据
      // console.log(res)
      // console.log(file)
      //  收集品牌图片的链接地址，因为将来需要带给服务器
      this.tmForm.logoUrl = res.data
      //  原本处理图片的方法
      //  this.imageUrl = URL.createObjectURL(file.raw);
    },
    //  图片上传前回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //  添加或修改品牌
    addOrUpdateTrademark() {
      //  验证表单
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          //  验证通过
          //  发请求(添加品牌|修改品牌)
          const result = await this.$API.trademark.reqAddOrUpdateTrademark(this.tmForm)
          if (result.code === 200) {
            //  隐藏对话框
            this.dialogFormVisible = false
            //  弹出信息提示,添加品牌成功、修改品牌成功
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功',
            })
            //  刷新列表数据
            //  如果是添加品牌就停留在第一页，修改品牌应该留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          //  验证失败
          console.log('error submit!!')
          // this.$message.error('表单验证失败')
          return false
        }
      })
    },
    //  删除品牌
    deleteTrdeMark(row) {
      //  提示弹框
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          //  点击确定按钮
          //  发送删除请求
          const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            //  再次获取品牌列表数据
            //  删除品牌产品数至少为2，停留在当前页，否则就前往上一页
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          //  点击取消按钮
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style>
/* el-upload组件 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
