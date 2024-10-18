const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // this will give us created at and updated at timestamps
  }
);

// Pre-save hook to auto-increment the id field
urlSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastUrl = await mongoose.model("Url").findOne().sort({ id: -1 });
    this.id = lastUrl ? lastUrl.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Url", urlSchema);
