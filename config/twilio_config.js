const env  =  require("dotenv")
    .config({path: __dirname + "/../.env"})
    .parsed

module.exports = {
  TWILIO_ACCOUNT_SID: "AC12c5e30431f315d483433476bb072376",
  TWILIO_AUTH_TOKEN: "cf7516c4c32e38d74859f91c270bd8f5",
  TWILIO_API_KEY: "SK7e572654ce90a1ca819ebc1c97b2ea61",
  TWILIO_API_SECRET: "DlywWqyZG1qcYUiAfgho5657dcSev5Ps",
  TWILIO_CHAT_SERVICE_SID: "ISa9f8a306340143499bcfa933872c4757", //ISfc2958324d744976949eedb86de0ae0e
  TWILIO_ADMIN_ROLE_SID: "RL665c4ef094bd48ae87a90737c65e5db3", //RL0447447132b448a6b8f8f6517af42cbe
  TWILIO_USER_ROLE_SID: "RL149bdb3b1b0f4ffabc0536f6f2494bab", //RL0c7eb64269b64e0992597e2644e45dc6
  TWILIO_PHONE_NUMBER_SID: "PN75f43e6e392a46ed1de0555582c142db",
  TWILIO_NOTIFICATION_SERVICE_SID: "ISda068265f9c2832591072c31c1a8ca43",
  TWILIO_NOTIFY_ANDROID_SID:"CRfc126fcddd9e38c8a45ad26e5500f2b8",
  TWILIO_MESSAGING_SID:"MG91bbf62ba391eef04801f3deced03010",
  TWILIO_SYNC_SERVICE_SID: env.TWILIO_SYNC_SERVICE_SID || 'default',
  TWILIO_PHONE_NUMBER : "+14156049935",
  virgil:{
    appId: env.APP_ID,
    appKey: env.APP_KEY,
    appKeyId: env.APP_KEY_ID
  }
}
