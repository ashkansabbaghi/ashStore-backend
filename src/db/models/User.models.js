const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");


const UserSchema = new Schema(
  {
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    isAdmin: { type: Boolean, default: false },
    username: { type: String, lowercase: true, required: true, unique: true },
    salt: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    genders: { type: String, enum: ["man", "women", "diff"] },
    email: {
      type: String,
      unique: [true, "email already exists in database!"],
      lowercase: true,
      trim: true,
      required: [true, "email not provided"],
      validate: {
        validator: (v) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "{VALUE} is not a valid email!",
      },
    },
    image: { type: String },
    phone: { type: Number && String, required: true },
    userStatus: {
      type: String,
      enum: ["active", "blocked", "banned"],
      default: "active",
    },
  },
  { timestamps: true }
);

UserSchema.methods.sendUserModel = function () {
  return {
    userId: this._id,
    username: this.username,
    genders: this.genders,
    phone: this.phone,
    email: this.email,
    userStatus: this.userStatus,
    image: this.image,
    addresses: this.addresses,

    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
    },
    process.env.TOKEN_SEC,
    { expiresIn: "3d" }
  );
};

module.exports = mongoose.model("User", UserSchema);
