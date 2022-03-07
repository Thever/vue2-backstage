<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'Dashboard',
  components: {
    Card, Sale, Observe
  },
  mounted(){
    //  这里是用mock模拟数据，但是使用了之后原本的登录接口会异常，注意在vue.config.js中切换配置
    this.$store.dispatch('getData');
  }
}
</script>

<style lang="scss" scoped>

</style>
