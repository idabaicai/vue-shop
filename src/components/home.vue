<template>
    <div>
    <h2>欢迎您</h2>
    <button @click="logout">退出</button>
    </div>
</template>
<script>
export default {
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
h2{
    color: pink;
}
</style>
