import { createEGG } from "#/controllers/eggs/eggs.controllers";
import { Router } from "express";

const router = Router();

router.route("/eggs").post(createEGG);
