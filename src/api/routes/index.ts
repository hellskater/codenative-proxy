import express from "express";

import IpRoutes from "@api/routes/ip";

const router = express.Router();

router.use("/ip", IpRoutes);

export default router;
