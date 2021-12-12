const wishRouter = require('express').Router();

const WishController = require("../controllers/WishController");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");
const WishValidator = require("../validators/WishValidator");
const AuthMiddleware = require("../middlewares/AuthMiddleware");


wishRouter.post('/sendWish',
AuthMiddleware().verifyToken,
WishValidator().validateWish,
ErrorHandlerMiddleware(WishController().sendWish),
ResponseMiddleware);

wishRouter.get('/wishList',
AuthMiddleware().verifyToken,
ErrorHandlerMiddleware(WishController().wishList),
ResponseMiddleware);

wishRouter.post('/deleteWish',
AuthMiddleware().verifyToken,
WishValidator().validateWishId,
ErrorHandlerMiddleware(WishController().deleteWish),
ResponseMiddleware);

wishRouter.get('/getUserForWish',
AuthMiddleware().verifyToken,
//WishValidator().validateDate,
ErrorHandlerMiddleware(WishController().getUserForWish),
ResponseMiddleware);


module.exports=wishRouter;
