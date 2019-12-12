const LocalStratergy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('users');

module.exports = function(passport){
    //this is used to define the local stratergy 
    passport.use(new LocalStratergy({usernameField: 'email'}, (email,password,done)=>{
        //match user
        User.findOne({
            email:email
        }).then(user=>{
            if(!user){
                //done takes error as first para and user as the second para(here no user therefore null)
                return done(null,false,{message: "No user found"});
            }

            //match passpord
            bcrypt.compare(password, user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                }else{
                    return done(null,false,{message: "Password Incorrect"});

                }
            })
        })
    })); 

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
          //findById is a mongoose function if u r using some other orm then you might have to change this
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}