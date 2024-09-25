const mongoose =require('mongoose')


function    connects(){

    mongoose.connect('mongodb://localhost:27017/CompassionLink_Donation_Platform')
    .then(()=>console.log('Mongodb connected...'))
    .catch((error)=>{console.log(error)})
}

module.exports = connects
    