<template>
  <div>
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="选择快递"
      >
        <a-radio-group v-decorator="['radio-group']">
          <a-radio-button value="中通快递">
            中通快递
          </a-radio-button>
          <a-radio-button value="德邦快递">
            德邦快递
          </a-radio-button>
          <a-radio-button value="申通快递">
            申通快递
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12, offset: 5 }"
      >
        <a-button
          type="primary"
          html-type="submit"
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
      form: this.$form.createForm(this)
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
  },
};
</script>