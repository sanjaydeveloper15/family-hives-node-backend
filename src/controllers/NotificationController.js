const { Op,QueryTypes  } = require("sequelize");
const NotificationService = require("../services/NotificationService")
const UserService = require("../services/UserService")
const helpers = require("../util/helpers.js");

module.exports = () => {


const getNotification = async (req, res, next, transaction) => {
  console.log("NotificationController => getNotification");
  let {page,limit,search,user_type} = req.query;
  page = parseInt(page) ; //for next page pass 1 here
  limit = parseInt(limit) ;
  let notification = null;
  let {userId} = req.body;
  query = {userId}
  if(search) query.title =  { $regex: '.*' + search + '.*', '$options' : 'i' };
  notification = await NotificationService().getNotification(query,page,limit, transaction);
  let notification_id = await notification?notification.map(a=>a.id):[];
  console.log('notification_id');
  console.log(notification_id);
  if(notification_id.length>0){
    let  update_query = { "id": {[Op.in]:notification_id} }
    let update_reult = await NotificationService().updateMultipleNotification(update_query,{isRead:true}, transaction);
  }
  req.rData = {notification};
  req.msg = 'notification_list';
  next();
}

const setNotificationPermission = async (req, res, next) => {
  console.log("NotificationController => setNotificationPermission");
  let {userId,notification_permission} = req.body;
  data = {notification_permission}
  let result = await UserService().updateProfile(userId,data);

  req.rData = {notification_permission}
  req.msg = 'notification_permission_changed';
  next();
}

const updateNotification = async (req, res, next) => {
  console.log("NotificationController => getNotification");
  let {message_id,isRead} = req.body;
  let data = {isRead}
  notification = await NotificationService().updateNotification(message_id,data);

  req.msg = 'notification_updated';
  next();
}

const getUnreadNotificationCount = async (req, res, next) => {
  console.log("NotificationController => getUnreadNotificationCount");
  let {userId} = req.body;
  query = {userId:userId,isRead:'0'}
  let notification = await NotificationService().countNotification(query);
  req.rData = {notification};



  req.msg = 'notification_count';
  next();
}

const createNotification = async (req, res, next) => {
  console.log("NotificationController => createNotification");
  let {subject,message,sentTo,user} = req.body;
  let data = {subject,message,sentTo}
  try {
    if(user) user = JSON.parse(user.replace(/\\/g,""))

  } catch (e) {

  }

  data.user = user
  notification = await NotificationService().addAdminNotification(data);
  for (var i = 0; i < user.length; i++) {
    let userId = user[i];
    let user_data = await UserService().fetch(userId);
    if(user_data.device_token!=null){
      data ={};
      result = await helpers().sendNotification(user_data.device_token,user_data.device_type,subject,message,data,user_data._id);
    }
  }

  req.msg = 'notification_created';
  next();
}

const deleteNotification = async (req, res, next) => {
  console.log("NotificationController => deleteNotification");
  let { notification_id} = req.body;
  notification = await NotificationService().deleteNotification(notification_id);

  req.msg = 'notification_deleted';
  next();


}

const getAdminNotification = async (req, res, next) => {
  console.log("NotificationController => getAdminNotification");
  let {page,limit,subject} = req.query;
   page = parseInt(page) ; //for next page pass 1 here
   limit = parseInt(limit) ;
  let query = {}
  if(subject) query.subject = { $regex: '.*' + subject + '.*', '$options' : 'i' };;
  notification = await NotificationService().getAdminNotification(query,page,limit);
  let total_notification = await NotificationService().countAdminNotification(query,page,limit);
  notification = await validateNotification(notification);
  req.rData= {page,limit,subject,total_notification,notification}
  req.msg = 'notification_list';
  next();


}

const getAdminNotificationDetails = async (req, res, next) => {
  console.log("NotificationController => getAdminNotificationDetails");
  let { notification_id} = req.query;

  notification = await NotificationService().getAdminNotificationDetails(notification_id);
  let {subject,_id,message,sentTo,time,user} = notification;
  notification = {subject,_id,message,sentTo,time,user};
  req.rData= {notification}
  req.msg = 'notification_details';
  next();


}

const validateNotification = (data) => {
    let notificationData = []
      return new Promise(async function(resolve, reject){
        for (var i = 0; i < data.length; i++) {
          console.log('data[i]');
          console.log(data[i]);
          let {subject,_id,message,sentTo,time,user} = data[i];
          notificationData.push({subject,_id,message,sentTo,time,user});
          if(i==data.length-1)
          resolve(notificationData);
        }

      })
  }


return {
  getNotification,
  setNotificationPermission,
  updateNotification,
  getUnreadNotificationCount,
  createNotification,
  deleteNotification,
  getAdminNotification,
  getAdminNotificationDetails,
}

}
