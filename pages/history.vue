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
      <span slot="action" slot-scope="{ record_id }">
        <a-button
          type="primary"
          shape="circle"
          icon="search"
          size="small"
          @click="toDetial(record_id)"
        />
        <a-button
          type="danger"
          shape="circle"
          icon="delete"
          size="small"
          @click="delRecord(record_id)"
        />
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: "时间",
    dataIndex: "time",
    width: "100px",
    customRender: text => {
      return new Date(text).toLocaleString()
    }
  },
  {
    title: "大小",
    dataIndex: "size",
    customRender: text => {
      return text === 1 ? "小件" : "大件"
    }
  },
  {
    title: "快递",
    dataIndex: "courier_name"
  },
  {
    title: "操作",
    width: "90px",
    slots: { filterIcon: 'courier_name' },
    scopedSlots: { customRender: "action" }
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
    },
    async toDetial (recordId) {
      this.$router.push({ name: 'record-recordId', params: { recordId} })
    },
    async delRecord (recordId) {
      const _this = this
      this.$confirm({
        title: '你确定要删除该记录吗?',
        content: '删除该记录将永远无法找回该记录！',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this.del()
        },
        onCancel() {}
      })
    },
    async del(recordId) {
      const result = await this.$api.couriers.deleteRecord(recordId)
      if (result.status === 200) {
        this.$message.success(result.message || '删除成功!')
        this.getHistory()
      } else {
        this.$message.error(result.message || '删除失败，请稍后再试!')
      }
    }
  }
}
</script>
