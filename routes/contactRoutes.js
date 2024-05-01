import express from "express";
import {
  getContacts,
  downloadContacts,
  createContact,
} from "../controllers/contactsController.js";

const router = express.Router();

router.get("/contacts", getContacts);
router.post("/contacts/download", downloadContacts);
router.post("/createContact", createContact);

export default router;
