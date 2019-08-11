<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="historyData"
      :row-key="_ => _.record_id"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
      <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :key="tag" color="blue">{{ tag }}</a-tag>
      </span>
      <span slot="action">
        <a href="javascript:;">Delete</a>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: "时间",
    dataIndex: "time",
    customRender: text => {
      return new Date(text).toLocaleString()
    }
  },
  {
    title: "大小包",
    dataIndex: "size"
  },
  {
    title: "快递",
    dataIndex: "courier_name"
  },
  {
    title: "操作"
  }
]

export default {
  name: "History",
  data() {
    return {
      historyData: [],
      columns,
      pagination: {
        total: 0,
        current: 1,
        defaultCurrent: 1,
        hideOnSinglePage: true,
        pageSize: 10
      },
      loading: false
    }
  },
  created() {
    this.getHistory(this.pagination.current, this.pagination.pageSize)
  },
  methods: {
    async getHistory(page = 1, pageSize = 10) {
      this.loading = true
      const result = await this.$api.couriers.history({
        page,
        pageSize
      })
      if (result && result.status === 200) {
        this.historyData = result.data.list
        this.pagination.total = result.data.total
      } else {
        this.$message.error(
          result.message || "获取历史记录失败,请稍后再试![002]"
        )
      }
      this.loading = false
    },
    async handleTableChange(pagination) {
      const pager = { ...pagination }
      this.pagination.current = pager.current
      this.getHistory(pager.current, pager.pageSize)
    }
  }
}
</script>
