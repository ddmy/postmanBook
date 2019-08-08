<template>
  <div>
    <a-table :columns="columns" :dataSource="historyData">
      <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a>
      <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" color="blue" :key="tag">{{tag}}</a-tag>
      </span>
      <span slot="action">
        <a href="javascript:;">Delete</a>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [{
  title: '记录编号',
  dataIndex: 'record_id',
  key: 'record_id',
}, {
  title: '时间',
  dataIndex: 'time',
  key: 'time',
}, {
  title: '大小包',
  dataIndex: 'size',
  key: 'size',
}, {
  title: '快递',
  key: 'courier_name',
  dataIndex: 'courier_name',
}, {
  title: '操作',
  key: 'record_id',
}];

export default {
  name: 'history',
  data() {
    return {
      historyData: [],
      columns,
    }
  },
  created () {
    this.getHistory()
  },
  methods: {
    async getHistory () {
      const result = await this.$api.couriers.history({
        page: 0,
        pageSize: 10
      })
      if (result.status === 200) {
        this.historyData = result.data.list
      } else {
        this.$message.error('获取历史记录失败,请稍后再试!')
      }
    }
  }
}
</script>
