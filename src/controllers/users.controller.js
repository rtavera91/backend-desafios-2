import {
  findAll,
  findById,
  createOne,
  updateOne,
  deleteOne,
  findByEmail,
  updateLastConnection,
  getInactiveUsers,
} from "../services/users.service.js";
import { transporter } from "../nodemailer.js";
import config from "../config/config.js";
import UserDTO from "../dto/user.dto.js";

export const findUsers = async (req, res) => {
  const users = await findAll();
  if (!users.length) {
    res.status(200).json({ message: "No Users Found" });
  } else {
    const filteredUsers = users.map((user) => {
      return new UserDTO({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      });
    });

    res.status(200).json({ message: "Users found", filteredUsers });
  }
};

export const findUserById = async (req, res) => {
  const { uid } = req.params;
  const user = await findById(+uid); // Pasa el ID del usuario
  if (user) {
    res.status(200).json({ message: "User found", user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const createdUser = await createOne(req.body);
  if (createdUser) {
    res.status(200).json({ message: "User created", user: createdUser });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const { uid } = req.params;
  const { email, password } = req.body;
  const updatedUser = await updateOne(uid, email, password);
  if (updatedUser) {
    res.status(200).json({ message: "User updated", user: updatedUser });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const deleteUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await deleteOne(uid);
    if (result) {
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDB = await findByEmail(email);
    if (!userDB) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isValid = await compareData(password, userDB.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    await updateLastConnection(email);

    res.status(200).json({ message: `Welcome ${userDB.email}!` });
  } catch (error) {
    res.status(500).json({ error: "Error", error });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { uid } = req.params;
    const { filename } = req.file;

    await usersManager.updateOne(uid, { document: filename });
    res.status(200).json({ message: "Document uploaded" });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateToPremium = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await usersManager.findById(uid);
    if (
      !user.documents ||
      !user.documents.identification ||
      !user.documents.addressProof ||
      !user.documents.bankStatement
    ) {
      return res.status(400).json({ message: "Missing required documents" });
    }
    await usersManager.updateOne(uid, { role: "premium" });
  } catch (error) {
    console.error("Error updating to premium:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
    const inactiveUsers = await getInactiveUsers();
    console.log("Inactive users:", inactiveUsers);

    for (const user of inactiveUsers) {
      const mailOptions = {
        from: config.gmail_user,
        to: user.email,
        subject: "Account Deletion",
        text: `Hello ${user.first_name}, your account has been deleted due to inactivity.`,
      };
      await transporter.sendMail(mailOptions);
    }
    const result = await usersManager.deleteMany(inactiveUsers);
    res.status(200).json({ message: "Users deleted", result });
  } catch (error) {
    console.error("Error deleting inactive users:", error);
    res.status(500).send("Internal Server Error");
  }
};
