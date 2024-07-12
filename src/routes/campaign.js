const compaignController = require('../controllers/campaign');

module.exports = (app, router) => {
    router.post("/add-campaign", compaignController.add);
    
    
    app.use("/api", router);
  };
  
