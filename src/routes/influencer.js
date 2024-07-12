const influencerController = require('../controllers/influencer');

module.exports = (app, router) => {
    router.post("/add-influencer", influencerController.add);
    
    app.use("/api", router);
  };
  
