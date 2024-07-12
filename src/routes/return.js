const returnController = require('../controllers/return');

module.exports = (app, router) => {
    router.post("/add-return", returnController.add);
    router.get("/daily-return", returnController.currentDayReturn);
    router.get("/monthly-roi", returnController.monthlyROI);
    
    app.use("/api", router);
  };
  
