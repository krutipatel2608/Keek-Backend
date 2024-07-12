const userController = require('../controllers/auth');

module.exports = (app, router) => {
    router.post("/register-user", userController.signUp);
    router.post("/register", userController.createUser);
    router.post("/send-otp", userController.sendOTP);
    // router.post("/login", userController.login);
    router.get("/get-user/:username", userController.fetchUserData);
    router.get("/get-user", userController.youtubeData);
    router.get("/login", userController.instaLogin);
    router.get("/authoauth2callbackAPI", userController.instaAuth);
  
    app.use(router);
  };
  
