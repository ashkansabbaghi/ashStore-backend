const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    user :{type : mongoose.Schema.Types.ObjectId, ref: "User"},
    code :{type: String , default:"code-discount"},
    title : {type: String },
    description : {type: String},
    percentage :{type : Number , default:'5'}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", DiscountSchema);
