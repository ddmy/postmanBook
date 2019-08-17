<template>
  <div class="statistics-main">
    <div class="canva" ref="canva"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: "statistics",
  data() {
    return {
      couriersInfo: [],
      myChart: {}
    }
  },
  computed: {
    options() {
      let title = {
        text: '快递收入走势图'
      }
      let tooltip = {
        trigger: 'axis'
      }
      let legend = {
        data: this.couriersInfo.map(v => v.courier_name)
      }
      let grid = {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      }
      let toolbox = {
          feature: {
              saveAsImage: {},
              restore: {}
          }
      }
      let xAxis = {
          type: 'category',
          boundaryGap: false,
          data: ['周一','周二','周三','周四','周五','周六','周日']
      }
      let yAxis = {
          type: 'value'
      }
      let series = [
          {
              name:'邮件营销',
              type:'line',
              stack: '总量',
              data:[120, 132, 101, 134, 90, 230, 210]
          },
          {
              name:'视频广告',
              type:'line',
              stack: '总量',
              data:[150, 232, 201, 154, 190, 330, 410]
          },
          {
              name:'搜索引擎',
              type:'line',
              stack: '总量',
              data:[820, 932, 901, 934, 1290, 1330, 1320]
          }
      ]
      console.log(legend)
      return {
        title,
        tooltip,
        legend,
        grid,
        toolbox,
        xAxis,
        yAxis,
        series
      }
    }
  },
  created() {
    this.getCouriersList()
  },
  mounted() {
  },
  methods: {
    async getCouriersList() {
      const result = await this.$api.couriers.list()
      if (result.status === 200) {
        this.couriersInfo = result.data.list
        // 获取所有快递的最近记录数据
        this.getCouriersRecord()
        this.initCanva()
      } else {
        this.$message.error("网络繁忙,请稍后再试!")
      }
    },
    async getCouriersRecord() {
      const result = await this.$api.couriers.search({
        sort: "last",
        courierId: this.couriersInfo.map(v => v.courier_id)
      })
      console.log(result)
    },
    initCanva() {
      this.myChart = echarts.init(this.$refs.canva)
      this.myChart.setOption(this.options)
    }
  }
}
</script>

<style lang="scss" scoped>
.canva {
  width: 100%;
  height: 400px;
}
</style>