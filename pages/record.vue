<template>
  <div class="record-mian">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="选择快递">
        <a-radio-group
          v-decorator="[
            'courier-name',
            {
              rules: [
                {
                  required: true,
                  message: '请选择快递名称'
                }
              ]
            }
          ]"
          button-style="solid"
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
      <a-form-item label="类型">
        <a-radio-group
          v-decorator="[
            'courier-size',
            {
              rules: [
                {
                  required: true,
                  message: '请选择快递大小'
                }
              ]
            }
          ]"
          button-style="solid"
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
      <a-form-item
        label="签收照片"
        extra="如有需要，可以选择上传快递签收证明照片"
      >
        <div class="clearfix">
          <a-upload
            v-decorator="['upload', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
            }]"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 3">
              <a-icon type="plus" />
              <div class="ant-upload-text">添加图片</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading" block>
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "Recode",
  data() {
    return {
      form: this.$form.createForm(this),
      couriersInfo: [],
      currentCourieId: false,
      courierSize: {
        1: "small",
        2: "big",
        small: 1,
        big: 2
      },
      loading: false,
      previewVisible: false,
      previewImage: '',
      fileList: [{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
    }
  },
  computed: {
    currentCourie() {
      let current = this.couriersInfo.find(
        v => v.courier_id === this.currentCourieId
      )
      if (!this.currentCourieId || !current) {
        return {
          small: 1,
          big: 1
        }
      }
      let courierSize = this.form.getFieldValue("courier-size")
      // 如果当前选中的快递不支持对应的size
      if (current[this.courierSize[courierSize]] === 0) {
        this.form.resetFields("courier-size")
      }
      return current
    }
  },
  created() {
    this.getCouriersList()
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log(values)
          const stsResult = await this.$api.user.sts()
          console.log('sts------_>', stsResult)
          this.loading = true
          const result = await this.$api.couriers.record({
            couriersName: values["courier-name"],
            courierSize: values["courier-size"]
          })
          if (result.status === 200) {
            this.$message.success(result.message)
          } else {
            this.$message.error(result.message || "添加失败,请联系客服!")
          }
          this.loading = false
        }
      })
    },
    handleSelectChange(value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === "male" ? "man" : "lady"}!`
      })
    },
    async getCouriersList() {
      const result = await this.$api.couriers.list()
      console.log("result", result)
      if (result.status === 200) {
        this.couriersInfo = result.data.list
      } else {
        this.$message.error("网络繁忙,请稍后再试!")
      }
    },
    couriesChange(e) {
      this.currentCourieId = e.target.value
    },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      this.fileList = fileList
    },
    normFile  (e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
  }
}
</script>

<style lang="scss" scoped>
.record-mian {
  padding: 10px;
}
</style>
