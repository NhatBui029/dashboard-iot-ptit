const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb://127.0.0.1/dashboard-iot',{});
        console.log('connect successful');
    }catch(error){
        console.log("failed")
    }
}

module.exports = {connect}