<template>
  <div class="statistics-main">
    <div ref="canva" class="canva" />
  </div>
</template>

<script>
import _ from "lodash"
import echarts from "echarts"
import utils from "../plugins/utils"
import { mapState, mapMutations, mapActions } from "vuex"
import { clearTimeout, setTimeout } from 'timers';
export default {
  name: "Statistics",
  data() {
    return {
      couriersInfo: [],
      couriersRecordList: {},
      myChart: {},
      days: 7,
      options: {},
      timer: null
    }
  },
  computed: {
    ...mapState("statistics", ["courierPrice"])
  },
  created() {
    this.getCouriersList()
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (_.isEmpty(this.myChart)) return
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.myChart.resize({
          height: '400px'
        })
      }, 500)
    })
  },
  methods: {
    ...mapActions("statistics", ["getCourierPrice"]),
    async getCouriersList() {
      await this.getCourierPrice()
      const result = await this.$api.couriers.list()
      if (result.status === 200) {
        this.couriersInfo = result.data.list
        // 获取所有快递的最近记录数据
        this.getCouriersRecord()
      } else {
        this.$message.error("网络繁忙,请稍后再试!")
      }
    },
    async getCouriersRecord() {
      const result = await this.$api.couriers.search({
        sort: "last",
        courierId: this.couriersInfo.map(v => v.courier_id),
        day: this.days
      })
      this.filterData(result.data.list)
      this.initOptions()
      this.initCanva()
    },
    initCanva() {
      this.myChart = echarts.init(this.$refs.canva)
      this.myChart.setOption(this.options)
    },
    // 处理近n天的数据适用于echarts的格式
    filterData(data) {
      if (!Array.isArray(data))
        return this.$message.error("数据异常,请联系客服!")
      if (data.length === 0) return {}
      const templateData = {}
      this.couriersInfo.forEach(v => {
        templateData[v.courier_id] = {
          courier_name: v.courier_name,
          courier_id: v.courier_id,
          count: 0
        }
      })
      const result = {}
      let dayArr = data.map(v => new Date(v.time).getTime())
      let maxDay = Math.max(...dayArr)
      let minDay = Math.min(...dayArr)
      dayArr = utils.formatEveryDay(minDay, maxDay)
      dayArr.forEach(v => {
        result[v] = _.cloneDeep(templateData)
      })
      data.forEach(v => {
        let time = new Date(v.time)
        let day = time
          .toLocaleDateString()
          .split("/")
          .map(v => utils.getLenStr(v))
          .join("/")

        if (result[day]) {
          // 获取当前快递件的价格
          let price = 0
          let courier = this.courierPrice.find(item => item.courier_id === v.courier_id)
          if (v.size === 1) {
            price = courier.small
          } else if (v.size === 2) {
            price = courier.big
          }
          result[day][v.courier_id].count += price
          result[day].size = v.size
        } else {
          console.error(`日期错误:${day}`)
        }
      })
      this.couriersRecordList = result
      return result
    },
    initOptions() {
      let title = {
        text: "快递收入走势图"
      }
      let tooltip = {
        trigger: "axis"
      }
      let legend = {
        data: this.couriersInfo.map(v => v.courier_name)
      }
      let grid = {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      }
      let toolbox = {
        feature: {
          saveAsImage: {},
          restore: {}
        }
      }
      let xAxis = {
        type: "category",
        boundaryGap: false,
        data: Object.keys(this.couriersRecordList)
      }
      let yAxis = {
        type: "value"
      }
      let series = {}
      this.couriersInfo.forEach(v => {
        series[v.courier_id] = {
          name: v.courier_name,
          type: "line",
          stack: "单数",
          data: []
        }
      })
      for (let key in this.couriersRecordList) {
        this.couriersInfo.forEach(v => {
          series[v.courier_id].data.push(
            this.couriersRecordList[key][v.courier_id].count
          )
        })
      }
      series = Object.values(series)
      this.options = {
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
  }
}
</script>

<style lang="scss" scoped>
.canva {
  width: 100%;
  height: 400px;
}
</style>
