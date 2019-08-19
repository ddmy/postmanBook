<template>
  <div class="statistics-main">
    <div ref="canva" class="canva" />
  </div>
</template>

<script>
import _ from "lodash"
import echarts from "echarts"
import utils from "../plugins/utils"
export default {
  name: "Statistics",
  data() {
    return {
      couriersInfo: [],
      couriersRecordList: {},
      myChart: {},
      days: 7,
      options: {}
    }
  },
  created() {
    this.getCouriersList()
  },
  mounted() {},
  methods: {
    async getCouriersList() {
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
      console.log(this.options)
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
          result[day][v.courier_id].count += 1
        } else {
          console.error(`日期错误:${day}`)
        }
      })
      this.couriersRecordList = result
      console.log("this.couriersRecordList", this.couriersRecordList)
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
      // series = [
      //   {
      //     name: "邮件营销",
      //     type: "line",
      //     stack: "总量",
      //     data: [120, 132, 101, 134, 90, 230, 210]
      //   },
      //   {
      //     name: "视频广告",
      //     type: "line",
      //     stack: "总量",
      //     data: [150, 232, 201, 154, 190, 330, 410]
      //   },
      //   {
      //     name: "搜索引擎",
      //     type: "line",
      //     stack: "总量",
      //     data: [820, 932, 901, 934, 1290, 1330, 1320]
      //   }
      // ]
      // console.log(legend)
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
