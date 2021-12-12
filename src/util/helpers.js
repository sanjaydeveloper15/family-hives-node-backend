const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const fs = require("fs");
const serverConfig = require("../../config/server");
const messages = require("./messages");
const notification_messages = require("./notification_messages");
const { Op } = require("sequelize");
var FCM = require('fcm-push');
const NotificationService = require("../services/NotificationService")

var fcmServerkey = serverConfig.fcmServerkey; //put your server key here

var fcm = new FCM(fcmServerkey);
module.exports = function() {
    const resp = (response, lang, m = "success", data = {}, code = 1) => {
        return response.send({
            message: messages(lang)[m],
            data,
            code
        })
    }

    const getErrorMessage = (errors) => {
        console.log("Helpers => getErrorMessage");

        try {
            console.log(errors);
            for (var key in errors) {
                let rule = errors[key]['rule'];

                let exists = messages()[rule];
                if(exists) return messages()[rule](key)['en']

                return errors[key]['message'];
            }
        }catch(ex) {
            return "Something is wrong, Please try again later !!" + ex.message;
        }
    }


    const generateOTP = (length = 6) => {

        return Math.floor(100000 + Math.random() * 900000);
    }

    const createJWT = (payload) => {
        return jwt.sign(payload, serverConfig.jwtSecret, {
            expiresIn: '30d' // expires in 30 days
        });
    }
    const hashPassword = async password => {
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)
        return hash;
    }

    const checkPassword = async (password, hash) => {
        console.log("Helpers => checkPassword");

        let result = await bcrypt.compare(password, hash);
        return result;
    }

    const sendNotification = async (device_token,device_type,title,msg,name,type,userId,lang="en",additional_msg=null) => {
      console.log("Helpers => sendNotification");
      title = await notification_messages(lang)[title];
      let body = await notification_messages(lang,name)[msg];
      if(additional_msg) body = body+additional_msg;
      let data = {title,body,type}
      let notification_data = { device_token,device_type,title,body,data:JSON.stringify(data),userId,isRead:0 };
      let result = await NotificationService().addNotification(notification_data);
      data.message_id = result.id;
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
          to: device_token,
          //collapse_key: 'your_collapse_key',

          notification: {
              title: title,
              body: body
          },

          data: data
      }
      console.log(message);
      fcm.send(message, async function(err, response){
          if (err) {
              console.log("Something has gone wrong!",err)
          } else {
              console.log("Successfully sent with response: ", response)
          }
      })
    }

    function shuffle(array) {
      let currentIndex = array.length,  randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    }


      return {
        generateOTP,
        resp,
        getErrorMessage,
        createJWT,
        hashPassword,
        checkPassword,
        sendNotification,
        shuffle
    }
}
