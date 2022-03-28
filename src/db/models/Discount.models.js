const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    code :{type: String , default:"code-discount"},
    title : {type: String },
    description : {type: String},
    percentage :{type : Number , default:'5'}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", DiscountSchema);
