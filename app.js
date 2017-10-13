var cors = require('cors');
var mongo = require('mongoose');
var jwt = require('jsonwebtoken');
var bp = require('body-parser');

var exp = require('express');

var obj = exp();
obj.use(cors());


var app = exp.Router();
var cport = 5050;
 
var iobj = {
    'jwtSecret': 'xtytzt00700tytx',
    'connStr': 'mongodb://localhost/Versalite'
};
 
mongo.connect(iobj.connStr);
var database = mongo.Connection; 
 
if (database == 'undefined') {
    console.log("Not connected Properly");
}

var user_schema = mongo.Schema({
    Email: String,
    Pass: String,
});
 
var um = mongo.model('um', user_schema);
var pschema = mongo.Schema({
    Id: String,
    Name: String,
    Email: String,
    Age: String
});
 
var pmodel = mongo.model('Person', pschema, 'Person');
 

obj.set('jwtSecret', iobj.jwtSecret);
obj.use(bp.urlencoded({ extended: false }));
obj.use(bp.json());


 
app.post('/createuser', function (request, response) {

    console.log('In process');
    var usr = new um({
        Email: request.body.Email,
        Pass: request.body.Pass
    });
 
    usr.save(function (error) {
        if (error) {
            console.log('Something is not right !');
            throw error;
        }
        console.log('New User is created now !');
        response.json({ createduccessfully: true });
    });
});
 
 
 
app.get('/users', function (req, res) {
    um.find({}, function (err, users) {
        res.json(users);
    });
});
 
app.post('/authuser', function (request, response) {

    um.findOne({
        Email: request.body.Email
    }, function (error, user) {
        if (error) { console.log('Error ! '); throw error; }
        if (!user) {
            response.json({
                authsuccess: false,
                description: 'User is not valid !'
            });
        } else if (user) {
        
            if (user.Pass != request.body.Pass) {
                response.json({
                    authsuccess: false,
                    description: 'Sorry, Password could not match with the username! '
                });
            } else {
        
                var accessToken = jwt.sign(user, obj.get('jwtSecret'), {
                    expiresIn: 4800  
                });
                
                console.log('welcome user! authentication done!');
 
                response.json({
                    authsuccess: true,
                    description: 'sending token',
                    accessToken: accessToken
                });
            }}});
});

app.get('/persons', load_data);
 
function load_data(req, resp) {
    console.log('In Load Person');
    pmodel.find({}, function (err, persons) {
        resp.json(persons);
    });
};
 



obj.use(app);
obj.listen(cport, function () {
    console.log('Running now!');
});
console.log('started on port number ' + cport);