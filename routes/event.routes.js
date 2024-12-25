import express from "express"
import { deleteEvent, getEventsBtIdAndLatest, postEvent, updateEvent } from "../controller/event.controller.js";
import { upload } from "../config/fileConfig.js";
const router = express.Router();

router.route("/events").post( upload, postEvent)
router.route("/events").get(getEventsBtIdAndLatest);
router.route("/events/:id").put(upload, updateEvent);
router.route("/events/:id").delete(deleteEvent);


export default router;