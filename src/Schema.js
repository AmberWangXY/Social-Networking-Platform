const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  created: {
    type: Date,
    required: [true, 'Created date is required']
  },
  password: {
    type: String,
    default: ""
  },
  googleId:{ type: String, default: "" },


})

const User = mongoose.model('User', userSchema);
const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  headline: { type: String, default: "This guy is cool." }, // 确保有默认值
  avatar: { type: String, default: "" },   // 确保有默认值
  dob: {
    type: Date,
    required: [true, 'DOB is required']
  },
  email: {
    type: String,
    required: [true, 'email is required']
  },
  phone: {
    type: String,
    default: ""
  },
  zipcode: {
    type: String,
    default: ""
  },
  following: { type: [String], default: [] },

})
const Profile = mongoose.model('Profile', profileSchema);

const articleSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  author: { type: String, required: true },
  title: { type: String, default: "" },
  image: { type: String, default: "" },
  text: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  comments: [
    {
      id: Number,
      author: String,
      text: String,
    },
  ],
});


const Article = mongoose.model('Article', articleSchema);

module.exports = { User, Article ,Profile};
