const { Op } = require("sequelize");
const WishService = require("../services/WishService");
const helpers = require("../util/helpers");
const UserService = require("../services/UserService");
const FamilyService = require("../services/FamilyService");

module.exports = () => {
  const sendWish = async (req, res, next, transaction) => {
    console.log("WishController => add");
    let { partnerId,message,type,image,userId,wishId } = req.body;

    let wish_data = {userId,partnerId,type,image,message};

    if(!wishId){
      let result = await WishService().add(wish_data, transaction);

      let partner_details = await UserService().fetch(partnerId, transaction);
      if(partner_details){

        if(partner_details.notification_permission=="allow"){
          let title = "wish_title";
          let msg = "wish_message";

          let notification_result = helpers().sendNotification(partner_details.device_token,partner_details.device_type,title,msg,req.authUser.name,"wish",partner_details.id,partner_details.language,message)
          }
      }
      wishId = result.id;
      msg = "wish_added";
    }else {
      result = await WishService().update(wishId,wish_data, transaction);
      msg = "wish_updated";
    }
    wish = await WishService().fetch(wishId,transaction);

    req.rData = { wish };
    req.msg = msg;

    next();
}

const deleteWish = async (req, res, next, transaction) => {
  console.log("WishController => delete");
  let { userId,wishId } = req.body;

  let query = {userId,id:wishId};
  let result = await WishService().deleteWish(query, transaction);
  req.msg = "wish_deleted";
  next();
}


const wishList = async (req, res, next, transaction) => {
  console.log("WishController=>wishList");
    let { partnerId,page ,limit,type  } = req.query;
    let { userId  } = req.body;

    let filters = { userId,partnerId,page ,limit,type } ;

    data = await WishService().getList(filters,transaction);

    let total = data.count;
    let wish = data.rows;
    req.rData = { total,type, page, limit, wish };
    req.msg = 'wish_list';
    next();


  }

   const getUserForWish = async (req, res, next, transaction) => {
     console.log("WishController=>getUserForWish");
    let { date  } = req.query;
    let { userId,family_tree  } = req.body;
    let family_member = await FamilyService().fetchMemberByQuery({family_tree,added_by:"manual"}, transaction);
    let user_ids = await family_member.length>0?family_member.map(a=>a.registered_id):[];
    console.log("user_ids");
    console.log(user_ids);
    if(!date) date = await getTodayDate('1','','');
    let dates = date.split("-");
    const index = user_ids.indexOf(userId);
    if (index > -1) {
      user_ids.splice(index, 1);
    }
    let birthday_users = await WishService().getAllBirthdayUser(dates[2],dates[1],user_ids,transaction);
    if(birthday_users.length>0) birthday_users = await getAllUsers(birthday_users,userId,family_tree,"1", transaction);

    let aniversary_users = await WishService().getAllAniversaryUser(dates[2],dates[1],user_ids,transaction);
    if(aniversary_users.length>0) aniversary_users = await getAllUsers(aniversary_users,userId,family_tree,"2", transaction);

    let users = await birthday_users.concat(aniversary_users);
    //if(users.length>0) users = await getAllUsers(users,userId,family_tree, transaction);
    req.rData = {date, users };
    req.msg = 'user_list';
    next();


  }

    const getAllUsers =(data,userId, family_tree,type,transaction) => {
      console.log('WishController=>getAllUsers');
      let user_data = [];
        return new Promise( async function(resolve, reject){
          let year = await getTodayDate('','','1');
          data.forEach(async (item, i) => {
            let {id,name,email,mobile,countryCode,gender,dob,aniversary,image} = item;

            let member_details = await FamilyService().fetchSpouse({registered_id:id,status:true,family_tree,added_by:"manual"}, transaction);
            let spouseId = member_details.spouseId;
            let memberId = member_details.id;
            let spouse_query = {spouseId:memberId,status:true,family_tree,added_by:"manual"}
            if(spouseId) spouse_query = {id:spouseId,status:true,family_tree,added_by:"manual"}
            let spouse_details = await FamilyService().fetchSpouse(spouse_query, transaction);
          //  item.spouse_details = await spouse_details;
            let wished_data = await WishService().checkWishedUser(userId,id,year,type, transaction);

            if(wished_data.length==0 && userId!=id)
              user_data.push({id,name,email,mobile,countryCode,gender,dob,aniversary,image,type,spouse_details});
            if(i==data.length-1) resolve(user_data);
          });

        })
    }

  const getTodayDate =(onlyDate,onlyDateMonth,OnlyYear)=>{
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();

          if(onlyDate!='')
            return yyyy + '-' + mm + '-' + dd;
          if(onlyDateMonth!='')
            return  dd+'-'+mm;
          if(OnlyYear!='')
            return  yyyy;
  }

    return {
      sendWish,
      deleteWish,
      wishList,
      getUserForWish
    }
}
