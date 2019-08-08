<template>
  <div class="record-mian">
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="选择快递"
      >
        <a-radio-group
          v-decorator="[
            'courier-name',
             {
               rules: [{
                 required: true,
                  message: '请选择快递名称'
               }]
             }
          ]"
          buttonStyle="solid"
          @change="couriesChange"
        >
          <a-radio-button
            v-for="item in couriersInfo"
            :key="item.courier_id"
            :value="item.courier_id"
          >
            {{ item.courier_name }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="类型"
      >
        <a-radio-group
          v-decorator="[
            'courier-size',
            {
              rules: [{ 
                required: true,
                message: '请选择快递大小'
              }]
            }
          ]"
          buttonStyle="solid"
        >
          <a-radio-button
            :value="courierSize.small"
            :disabled="!currentCourie.small"
          >
            小件
          </a-radio-button>
          <a-radio-button
            :value="courierSize.big"
            :disabled="!currentCourie.big"
          >
            大件
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          block
        >
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'recode',
  data () {
    return {
      form: this.$form.createForm(this),
      couriersInfo: [],
      currentCourieId: false,
      courierSize: {
        1: 'small',
        2: 'big',
        small: 1,
        big: 2
      }
    }
  },
  created () {
    this.getCouriersList()
  },
  computed: {
    currentCourie () {
      let current = this.couriersInfo.find(v => v.courier_id === this.currentCourieId)
      if (!this.currentCourieId || !current) {
        return {
          small: 1,
          big: 1
        }
      }
      let courierSize = this.form.getFieldValue('courier-size')
      // 如果当前选中的快递不支持对应的size
      if (current[this.courierSize[courierSize]] === 0) {
        this.form.resetFields('courier-size')
      }
      return current
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleSelectChange (value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`
      });
    },
    async getCouriersList () {
      const result = await this.$api.couriers.list()
      console.log('result', result)
      if (result.status === 200) {
        this.couriersInfo = result.data.list
      } else {
        this.$message.error('网络繁忙,请稍后再试!')
      }
    },
    couriesChange (e) {
      this.currentCourieId = e.target.value
    }
  }
}
</script>

<style lang="scss" scoped>
  .record-mian {
    padding: 10px
  }
</style>
