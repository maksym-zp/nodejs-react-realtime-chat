const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Your username cannot be blank.'],
        trim: true,
        minLength: 3
    },
    avatar: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: [true, 'Your password cannot be blank.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Your email cannot be blank.'],
        unique: [true, 'The email address is already taken!'],
        lowercase: true,
        validate: {
            validator: () => Promise.resolve(function (value, isValid) {
                    const self = this;
                    return self.constructor.findOne({ email: value })
                        .exec(function(err, user){
                            if(err){
                                throw err;
                            }
                            else if(user) {
                                if(self.id === user.id) {
                                    return isValid(true);
                                }
                                return isValid(false);
                            }
                            else{
                                    return isValid(true);
                            }

                        })
            }),
            message:  'The email address is already taken!'
        },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
});

userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified || !user.isNew) {
        next();
    } else {
        bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) {
                next(err);
            } else {
                user.password = hash;
                next();
            }
        });
    }
});

userSchema.virtual('password_confirmation')
    .get(function() {
        return this.passwordConfirmation;
    })
    .set(function(value) {
        this.passwordConfirmation = value;
    });

userSchema.pre('validate', function(next) {
    if (this.password !== this.password_confirmation) {
        this.invalidate('password_confirmation', 'enter the same password');
    }
    next();
});


module.exports = mongoose.model('User', userSchema);




