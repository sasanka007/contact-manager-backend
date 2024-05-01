import Contact from "../models/Contact.js";
import XLSX from "xlsx";

export const getContacts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const contacts = await Contact.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Contact.countDocuments();
    res.json({
      contacts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalNoOfContacts: count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadContacts = async (req, res) => {
  const contacts = await Contact.find({ _id: { $in: req.body.contactIds } });

  const dataForExcel = contacts.map((contact) => ({
    Name: contact.name,
    MobileNumber: contact.mobileNumber,
    Tags: contact.tags.join(", "),
    Source: contact.source,
  }));
  const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", 'attachment; filename="contacts.xlsx"');
  res.send(buffer);
};

export const createContact = async (req, res) => {
  const { name, mobileNumber, email, tags, source } = req.body;
  const newContact = new Contact({
    name,
    mobileNumber,
    email,
    tags,
    source,
  });

  try {
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
