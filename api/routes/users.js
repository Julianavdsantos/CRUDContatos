import  express from "express";
import { getUsers, addUser, updateUser, deleteUser, searchUsers } from "../controllers/user.js";


const router = express.Router();

router.get("/", getUsers)

router.post("/", addUser)

router.put("/:ID", updateUser);

router.delete("/:ID", deleteUser)


router.get("/search", searchUsers);



export default router;

