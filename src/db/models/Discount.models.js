const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    code :{type: String , required: true},
    title : {type: String , required: true},
    description : {type: String},
    percentage :{type : Number}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", DiscountSchema);
