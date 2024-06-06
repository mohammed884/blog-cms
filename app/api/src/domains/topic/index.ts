import { Router } from "express";
import {
  getTopics,
  addTopic,
  addMultipleTopic,
  // editTopic,
  deleteTopic,
  deleteSubTopic,
  searchTopics,
} from "./controller";
import { isLoggedIn, role } from "../../middleware/auth";
const router = Router();
router.get("/", getTopics);
router.get("/:search", searchTopics);
router.use(isLoggedIn(true));
router.use(role("moderator"));
router.post("/add", addTopic);
router.post("/add/multiple", addMultipleTopic);
// router.patch("/edit/:id", editTopic);
router.delete("/delete/:id", deleteTopic);
router.delete("/delete/sub/:id", deleteSubTopic);
export default router;
