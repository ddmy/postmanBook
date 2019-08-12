const STS = require("qcloud-cos-sts")

const stsConfig = {
  secretId: "AKIDudBYsnCeeTcaN2f5VVLzd6P4Xq9NBRL5",
  secretKey: "7EOYM8UzrbElBEAzjLmAYItMk2DHE1hD",
  prox: "",
  durationSeconds: 1800,
  // 放行判断相关参数
  bucket: "fenglingdu-1259783871",
  region: "ap-beijing",
  allowPrefix: "*"
}
const shortBucketName = stsConfig.bucket.substr(
  0,
  stsConfig.bucket.lastIndexOf("-")
)
const appId = stsConfig.bucket.substr(1 + stsConfig.bucket.lastIndexOf("-"))

class GetStsToken {
  constructor() {
    this.policy = {
      version: "2.0",
      statement: [
        {
          action: [
            // 简单上传
            "name/cos:PutObject",
            "name/cos:PostObject",
            // 分片上传
            "name/cos:InitiateMultipartUpload",
            "name/cos:ListMultipartUploads",
            "name/cos:ListParts",
            "name/cos:UploadPart",
            "name/cos:CompleteMultipartUpload"
          ],
          effect: "allow",
          principal: { qcs: ["*"] },
          resource: [
            "qcs::cos:" +
              stsConfig.region +
              ":uid/" +
              appId +
              ":prefix//" +
              appId +
              "/" +
              shortBucketName +
              "/test/" +
              stsConfig.allowPrefix
          ]
        }
      ]
    }
  }
  static getToken() {
    return new Promise((resolve, reject) => {
      STS.getCredential(
        {
          ...stsConfig,
          policy: this.policy
        },
        (err, credential) => {
          if (err) {
            reject(err)
          } else {
            resolve(credential)
          }
        }
      )
    })
  }
}

module.exports = GetStsToken
