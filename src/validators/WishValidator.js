const { Validator } = require('node-input-validator');
const { validate, validations } = require("./index")

module.exports = () => {
    const validateWish = async (req, res, next) => {
      console.log(req.body);
        const v = new Validator(req.body, {
          partnerId: validations.general.requiredString,
          message: validations.general.requiredString,
          type: validations.general.requiredString,
          wishId: validations.wish.id

        });

        validate(v, res, next, req);
    }

    const validateWishId = async (req, res, next) => {
      console.log(req.body);
        const v = new Validator(req.body, {
          wishId: validations.general.requiredString

        });

        validate(v, res, next, req);
    }

    const validateDate = async (req, res, next) => {
      console.log(req.body);
        const v = new Validator(req.query, {
          date: validations.general.nullableDate

        });

        validate(v, res, next, req);
    }

    return {
        validateWish,
        validateWishId,
        validateDate
    }
}
