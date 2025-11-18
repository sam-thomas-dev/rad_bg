// handles routing & http requests, send data to be used in json to view, performs relevant model functions
const dbFunctions = require("../database/model.js");
const express = require("express");

const router = express.Router();

router.get("/get/byID/:id", (req, res) => {
    const locationID = Number(req.params.id);
    
    if(isNaN(locationID)){
        res.status(404).send(`/get/byID/'id' must be number`);
    } else{
        res.set('Content-Type', 'application/json');
        res.json(dbFunctions.getLocationByID(locationID));
    }
});

router.get("/get/byFilter/:filter", (req, res) => { 
    if(req.params.filter.trim() == 0){
        res.status(404).send(`/get/byFilter/'filter' must contain text characters`);
    } else{
        filterResults = dbFunctions.getLocationsBySubString(req.params.filter);   
        res.set('Content-Type', 'application/json');
        res.json({data: filterResults});
    }
});

module.exports = router;