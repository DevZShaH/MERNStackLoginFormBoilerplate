const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//keys
const config = require('./config/keys')

const {User} = require('./models/user'); //Required to post data into mongodb database

// CONNECT DB
mongoose.connect(config.mongoURI,
{useNewUrlParser:true,useUnifiedTopology: true}).then(()=>console.log('Database Connected')).catch(err=> console.log(err));
mongoose.set('useCreateIndex', true);

// MIDDLEWARES
//Body-parser and Cookie-parser
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

// ROUTES

app.get('/', (req,res)=>{
    res.json({"hello":"world"})
})
app.post('/api/users/register', (req,res)=>{

    const user = new User(req.body)
    user.save((err, userData)=>{
        if(err) return res.json({success:false, err});

        return res.status(200).json({success:true});
    });

})



app.listen(5000);