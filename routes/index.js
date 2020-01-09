const express = require('express'),
    router = express.Router(),
    path = require('path');


const {MethodHandler} = require('../utils/methods'),
    handler = new MethodHandler();


router.post('/calc', function (req, res, next) {
    const params = req.body;
    let response;
    if (!params.method || !params.func) {
        response = {success: false, msg: 'All params don\'t set.'};
    } else {
        try {
            handler.setStrategy(params.method);
            handler.setLocalization(params.startPoint, params.endPoint);
            handler.setFunction(params.func);
            handler.setExactness(params.accuracy);
            const roots = handler.calculate();
            response =  {success: true, data: roots.logs, msg: roots.msg}
        }
        catch (err) {
            response = {success: false, msg: err.message};
        }
    }
    debugger;
    res.send(response);
});


/* GET home page. */
router.get('*/*', function(req, res, next) {
    console.log(path.join(__dirname, '../src/templates/index.html'));
    res.sendFile(path.join(__dirname, '../src/templates/index.html'));
});


module.exports = router;
