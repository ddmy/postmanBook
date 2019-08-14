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
            v-decorator="[
              'upload',
              {
                valuePropName: 'fileList',
                getValueFromEvent: normFile
              }
            ]"
            list-type="picture-card"
            multiple
            :custom-request="toOss"
            @preview="handlePreview"
          >
            <div v-if="fileList.length < 3">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                添加图片
              </div>
            </div>
          </a-upload>
          <a-modal
            :visible="previewVisible"
            :footer="null"
            @cancel="handleCancel"
          >
            <img alt="example" style="width: 100%" :src="previewImage"/>
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
import { mapState } from "vuex"
import COS from "cos-js-sdk-v5"

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
      previewImage: "",
      fileList: [],
      recordId: null
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
    },
    ...mapState(["userInfo"])
  },
  created() {
    this.getCouriersList()
    // 获取初始化参数
    this.getRecordDetail()
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true
          // 先验证是否有图片正在上传
          if (!this.checkUploadIng()) {
            this.$message.warning("请等待图片上传完成!")
            this.loading = false
            return false
          }
          const result = await this.$api.couriers.record({
            couriersName: values["courier-name"],
            courierSize: values["courier-size"],
            upload: values["upload"].map(v => v.url || v.response.Location),
            recordId: this.recordId ? this.recordId : ''
          })
          if (result.status === 200) {
            this.$message.success(result.message)
            this.form.resetFields()
            this.$router.push('/record')
          } else {
            this.$message.error(result.message || "添加失败,请联系客服!")
          }
          this.loading = false
        }
      })
    },
    checkUploadIng() {
      const upload = this.form.getFieldValue("upload")
      if (!upload || upload.length === 0) return true
      // 如果有未上传完成的图片返回false
      return !upload.some(v => v.percent < 100)
    },
    handleSelectChange(value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === "male" ? "man" : "lady"}!`
      })
    },
    async getCouriersList() {
      const result = await this.$api.couriers.list()
      if (result.status === 200) {
        this.couriersInfo = result.data.list
      } else {
        this.$message.error("网络繁忙,请稍后再试!")
      }
    },
    couriesChange(e) {
      this.currentCourieId = e.target.value
    },
    handleCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    normFile(e) {
      console.log("Upload event:", e)
      if (Array.isArray(e)) {
        this.fileList = e
        return e
      }
      this.fileList = e.fileList
      return e && e.fileList
    },
    toOss({
      action,
      data,
      file,
      filename,
      headers,
      onError,
      onProgress,
      onSuccess,
      withCredentials
    }) {
      const cos = new COS({
        getAuthorization: async (options, callback) => {
          const stsResult = await this.$api.user.sts()
          if (stsResult.status === 200) {
            callback({
              TmpSecretId:
                stsResult.data.credentials &&
                stsResult.data.credentials.tmpSecretId,
              TmpSecretKey:
                stsResult.data.credentials &&
                stsResult.data.credentials.tmpSecretKey,
              XCosSecurityToken:
                stsResult.data.credentials &&
                stsResult.data.credentials.sessionToken,
              ExpiredTime: stsResult.data.expiredTime
            })
          } else {
            this.$message.error("上传文件失败，请稍后再试！")
          }
        }
      })
      // 分片上传文件
      cos.sliceUploadFile(
        {
          Bucket: "fenglingdu-1259783871",
          Region: "ap-beijing",
          Key: `/users/user-${this.userInfo.uid}/${file.name}`,
          // Key: `/test/user-${this.userInfo.uid}/${file.name}`,
          Body: file,
          onHashProgress: function(progressData) {
            console.log("校验中", JSON.stringify(progressData))
          },
          onProgress: function(progressData) {
            console.log("上传中", JSON.stringify(progressData))
            onProgress(
              {
                percent: Math.round(
                  ((progressData.loaded / progressData.total) * 100).toFixed(2)
                )
              },
              file
            )
          }
        },
        function(err, data) {
          if (!err) {
            console.log(data)
            onSuccess(data, file)
          } else {
            onError(err)
          }
        }
      )
    },
    async getRecordDetail () {
      this.recordId = this.$route.params.recordId || null
      if (!this.recordId) return
      const result = await this.$api.couriers.detail(this.recordId)
      if (result.status === 200) {
        this.form.setFieldsValue({
          "courier-name": result.data.courier_id,
          "courier-size": result.data.size
        })
        if (result.data.image) {
          this.form.setFieldsValue({
            upload: JSON.parse(result.data.image).map((v, i) => ({
              uid:  -1 - i,
              name: v.slice(v.lastIndexOf('/') + 1),
              status: 'done',
              url: '//' + v
            }))
          })
        }
      } else {
        this.$message.error('该记录异常!')
        this.$router.push('record')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.record-mian {
  padding: 10px;
}
</style>
