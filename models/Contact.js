import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  email: { type: String, required: false },
  tags: [String],
  source: {
    type: String,
    default: "API",
  },
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
