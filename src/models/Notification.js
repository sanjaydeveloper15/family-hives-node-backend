const Sequelize = require('sequelize');
const SequelizeP = require("sequelize-paginate");
module.exports = function (sequelize) {
    const Notification = sequelize.define('notification', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        userId: {
            type: Sequelize.INTEGER
        },
        title: {type: Sequelize.STRING(100)},
        device_token: {type: Sequelize.STRING},
        device_type: {type: Sequelize.STRING},
        body: {type: Sequelize.STRING},
        data: {type: Sequelize.STRING,allowNull:true},
        isRead: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
    },
    {
        timestamps: true,
        defaultScope: {
            attributes: {
                exclude: ['updatedAt']
            }
        }
      }
      );

    return Notification;
};
