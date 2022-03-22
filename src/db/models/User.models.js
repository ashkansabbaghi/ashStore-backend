const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    //address id
    isAdmin: { type: Boolean, default: false },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    genders: {
      type: String,
      enum: ["man", "women", "diff"],
      // required: [true, "Please specify user role"]
    },
    email: {
      type: String,
      unique: [true, "email already exists in database!"],
      lowercase: true,
      trim: true,
      required: [true, "email not provided"],
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "{VALUE} is not a valid email!",
      },
    },
    image_avatar: {
      type: String,
    },
    phone: {
      type: Number && String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

// UserSchema.methods.sendUserModel = () => {
//   return {
//     userId: this._id,
//     username: this.username,
//     phone: this.phone,
//     email: this.email,
//     createdAt: this.createdAt,
//     updatedAt: this.updatedAt,
//   };
// };
