const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const officerSchema=new Schema({
    name:String,
    password:String,
    email:String,
})
const userSchema = new Schema({
    name: String,
    password: String, 
    email: String,
});

const postSchema = new mongoose.Schema({
    description: {
      type: String,
      required: true,
      trim: true
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
const UserModel=mongoose.model("User",userSchema);
const OfficerModel=mongoose.model("Officer",officerSchema);
const PostModel=mongoose.model("Post",postSchema);

module.exports = {
  UserModel,
  OfficerModel,
  PostModel
};
