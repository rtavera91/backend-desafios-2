import { Router } from "express";
import { usersManager } from "../dao/managers/usersManager.js";
// import { hashData, compareData } from "../utils.js";
import {
  findUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  updateToPremium,
} from "../controllers/users.controller.js";
import documentUploader from "../middlewares/documentUploader.js";
import passport from "passport";
import config from "../config/config.js";

const router = Router();

// login github
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github",
  passport.authenticate("github", { failureRedirect: "/error" }),
  (req, res) => {
    console.log("req.user", req.user); // prueba de que el usuario está logueado
    res.session.user = req.user;
    res.redirect("/products");
  }
);

// sistema de logout
router.get("/logout", async (req, res) => {
  try {
    if (req.session.email) {
      //actualizar last connection en la base de datos
      await usersManager.updateOne(req.session.email, {
        last_connection: new Date(),
      });
    }
    req.session.destroy(async (err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }

      res.redirect("/"); // Redirige al usuario a la página de inicio después de cerrar la sesión
    });
  } catch (error) {
    console.error("Error updating last_connection:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", findUsers);
router.get("/:uid", findUserById);
router.post("/", createUser);
router.put("/:uid", updateUser);
router.delete("/:uid", deleteUser);
router.post("/login", loginUser);
router.post("/:uid/documents", documentUploader);
router.put("/:uid/premium", updateToPremium);

// router.get("/", async (req, res) => {
//   try {
//     const users = await usersManager.findAll();
//     res.status(200).json({ message: "Users", users });
//   } catch (error) {
//     res.status(500).json({ error: "Error", error });
//   }
// });

// router.get("/:idUser", async (req, res) => {
//   const { idUser } = req.params;
//   try {
//     const user = await usersManager.findById(idUser);
//     res.status(200).json({ message: "User found", user });
//   } catch (error) {
//     res.status(500).json({ error: "Error", error });
//   }
// });

// // login con passport
// router.post("/", async (req, res) => {
//   const { password } = req.body;
//   try {
//     const hashedPassword = await hashData(password);
//     const createdUser = await usersManager.createOne({
//       ...req.body,
//       password: hashedPassword,
//     });
//     res.status(200).json({ message: "User created", user: createdUser });
//   } catch (error) {
//     res.status(500).json({ error: "Error", error });
//   }
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const userDB = await usersManager.findByEmail(email);
//     if (!userDB) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const isValid = await compareData(password, userDB.password);
//     if (!isValid) {
//       return res.status(401).json({ message: "Invalid Credentials" });
//     }
//     res.status(200).json({ message: `Welcome ${userDB.first_name}!` });
//   } catch (error) {
//     res.status(500).json({ error: "Error", error });
//   }
// });

//signup con passport
router.post(
  "signup",
  passport.authenticate("signup", {
    successRedirect: "/products",
    failureRedirect: "/error",
  })
);

// router.post("/", async (req, res) => {
//   const { first_name, last_name, email, password } = req.body;
//   if (!first_name || !last_name || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     const createdUser = await usersManager.createOne(req.body);
//     res.redirect(`/index/${createdUser._id}`);
//   } catch (error) {
//     res.status(500).json({ error: "Error", error });
//   }
// });

// sistema de login para usuarios existentes
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDB = await usersManager.findByEmail(email);
  if (!userDB) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  req.session["email"] = email;
  req.session["first_name"] = userDB.first_name;
  if (email === config.admin_email && password === config.admin_password) {
    req.session["isAdmin"] = true;
  }
  res.redirect("/products");
});

// sistema de signup para usuarios nuevos
router.post("/signup", createUser);

export const usersRouter = router;
