const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://devzshah:1234@devz-4kadi.mongodb.net/MERNStack?retryWrites=true&w=majority',
{useNewUrlParser:true}).then(()=>console.log('Database Connected')).catch(err=> console.log(err));

app.get('/',(req,res)=>{
    res.send('hello world');
});

app.listen(5000);