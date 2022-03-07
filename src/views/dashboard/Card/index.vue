<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <!-- el-card添加阴影 -->
        <el-card>
          <Detail title="总销售额" count="￥126560">
            <template slot="charts">
              <span>周同比&nbsp;56.67%</span>
              <i class="el-icon-top" style="color:green"></i>
              <span>&nbsp;日同比&nbsp;19.96%</span>
              <i class="el-icon-bottom" style="color:red"></i>
            </template>
            <template slot="footer">
              <span>日销售额 ￥1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarCharts></BarCharts>
            </template>
            <template slot="footer">
              <span>转化率 65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressCharts></ProgressCharts>
            </template>
            <template slot="footer">
              <span>周同比&nbsp;56.67%</span>
              <i class="el-icon-top" style="color:green"></i>
              <span>&nbsp;日同比&nbsp;19.96%</span>
              <i class="el-icon-bottom" style="color:red"></i>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineChart from './LineChart'
import BarCharts from './BarCharts'
import ProgressCharts from './ProgressCharts'
export default {
  name: 'Card',
  components: {
    Detail, LineChart, BarCharts, ProgressCharts
  }
}
</script>

<style>

</style>
