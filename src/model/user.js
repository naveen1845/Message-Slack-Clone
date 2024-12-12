import bcrypt from 'bcrypt';
import mongoose from "mongoose"; 

const userModel = new mongoose.Schema({
        email: {
            type: String,
            required: [true, 'email is Required'],
            unique: [true, 'email already exists'],
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'invalid email signature'
            ],
        },
        password: {
            type: String,
            required: [true, 'password is required']
        },
        username: {
            type: String,
            unique: [true, 'username already exists'],
            required: [true, 'username is required'],
            match: [
                /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/,
                'username must contain alphabets, numbers and underscores only'
            ]
        },
        avatar: {
            type: String
        }
    }, 
    { timestamps: true }
)

userModel.pre('save', async function saveUser(next){
    const user = this;

    const salts = bcrypt.genSaltSync(9);

    const hashedPassword = bcrypt.hashSync(user.password, salts);

    user.password = hashedPassword;

    user.avatar = `https://robohash.org/${user.username}`

    next()
})


const User = mongoose.model('User', userModel);

export default User;