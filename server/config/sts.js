const config = require("../../config")
const STS = require("qcloud-cos-sts")

const {
  secretId,
  secretKey,
  prox,
  durationSeconds,
  bucket,
  region,
  allowPrefix
} = config.sts
const stsConfig = {
  secretId,
  secretKey,
  prox,
  durationSeconds,
  // 放行判断相关参数
  bucket,
  region,
  allowPrefix
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
  getToken(ctx) {
    let userInfo = ctx.session.uid
    if (userInfo && userInfo.uid) {
      this.policy.statement[0].resource = [
        "qcs::cos:" +
          stsConfig.region +
          ":uid/" +
          appId +
          ":prefix//" +
          appId +
          "/" +
          shortBucketName +
          "/users/user-" +
          userInfo.uid +
          "/" +
          stsConfig.allowPrefix
      ]
    }
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

module.exports = new GetStsToken()
