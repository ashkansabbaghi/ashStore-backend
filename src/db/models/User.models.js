const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }], // one to many
    discount: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" }, // one to one
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // one to many
    // comments : [{type: mongoose.Schema.Types.ObjectId, ref:"Comment"}],
    /* **************************** */
    isAdmin: { type: Boolean, default: false },
    username: { type: String, lowercase: true, required: true, unique: true },
    salt: { type: String, required: true }, //password
    hashedPassword: { type: String, required: true }, //password
    genders: { type: String, enum: ["man", "women", "diff"], default: "man" },
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
    image: { type: String, default: "/" },
    phone: { type: Number && String, required: true },
    userStatus: {
      type: String,
      enum: ["active", "blocked", "banned"],
      default: "active",
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "seller", "customer"],
      default: "customer",
    },
    codeSeller: { type: Number, default: 0 },
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
    role: this.role,
    codeSeller: this.codeSeller,
    discount: this.discount,

    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      genders: this.genders,
      email: this.email,
      phone: this.phone,
      role: this.role,
      userStatus: this.userStatus,
      isAdmin: this.isAdmin,
      role: this.role,
      codeSeller: this.codeSeller,
    },
    process.env.TOKEN_SEC,
    { expiresIn: "10d" }
  );
};

module.exports = mongoose.model("User", UserSchema);
