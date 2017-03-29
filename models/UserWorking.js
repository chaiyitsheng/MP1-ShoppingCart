var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    uuidv1: String,
    uuCreationDate: String,
    email: String,
    password: String,
    controlObj: {
        uuRole: String,
        isVerified:Boolean,
    },
    infoObj: {
        uuLastName: String,
        uuFirstName: String,
        uuIcNo: String,
        uuDob: String,
        uuAdd1: String,
        uuAdd2: String,
        uuPostcode: String,
        uuTowncity: String,
        uuState: String,
        uuHomeTelNo: String,
        uuMobileTelNo: String,
        uuGender: String,
        uuShipAdd1: String,
        uuShipAdd2: String,
        uuShipPostcode: String,
        uuShipTowncity: String,
        uuShipState: String
    }
});

UserSchema.methods.toJSON = function() {
    var user = this.toObject();
    delete user.password;
    // console.log(user);
    return user;
}

UserSchema.methods.comparePasswords = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
}


UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        })

    })
})

module.exports = mongoose.model('User', UserSchema);