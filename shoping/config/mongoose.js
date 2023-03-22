

const DB='mongodb://localhost:27017/dummy'

const mongoose = require('mongoose');

mongoose.connect(DB,{})
    .then(()=>{
        console.log('Connected to Mongo');
    })
    .catch(err =>{
        console.log('Error connecting to Mongo');
    });

