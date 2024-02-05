import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;
    switch (file.fieldname) {
      case "profileImage":
        folder = "profiles";
        break;
      case "productImage":
        folder = "products";
        break;
      case "document":
        folder = "documents";
        break;
      default:
        folder = "documents";
    }
    cb(null, `${__dirname}/public/${folder}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + file.originalname.split(".").pop()
    );
  },
});

const uploader = multer({ storage: storage });

export default uploader;
