const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//keys
const config = require('./config/keys')

const {User} = require('./models/user'); //Required to post data into mongodb database
const {auth} = require('./middleware/auth');

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

// app.get('/', (req,res)=>{
//     res.json({"hello":"world"})
// })

app.get('/api/user/auth', auth, (req,res)=>{
    res.status(200).json({
        _id: req.user._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

app.post('/api/users/register', (req,res)=>{

    const user = new User(req.body);
//=========Before saving into database we do password hashing in this area. check userSchema.pre() in user.js in models====================
    user.save((err, userData)=>{
        if(err) return res.json({success:false, err});

        return res.status(200).json({success:true, userData});
    });

});


app.post('/api/user/login', (req, res)=>{
    
    //find the email
    User.findOne({email: req.body.email}, (err, user)=>{
        if(!user) return res.json({
            loginSuccess: false,
            message: "Authentication Failed, Email not found!"
        });

    //comparePassword
    user.comparePassword(req.body.password, (err, isMatch)=>{
        if(!isMatch){
            return res.json({loginSuccess: false, message: "Wrong Password"});
        }
    })


    //generateToken
    user.generateToken((err, user)=>{
        if(err) return res.status(400).send(err);
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true});

    });

    })

});


app.get('/api/user/logout', auth, (req,res)=>{

    User.findOneAndUpdate({_id: req.user._id}, {token:''}, (err, doc)=>{
        if(err) return res.json({success: false, err})
        return res.status(200).send({
            success: true
        })
    })
})

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server running at port: ${port}`)
});