import { Request, Response } from "express";

export class IpController {
  static async issueIp(req: Request, res: Response): Promise<void> {
    try {
      const { user, projectName } = req.body;

      if (!user) {
        res.status(400).send({
          success: false,
          message: "provide username",
        });
        return;
      }

      if (!projectName) {
        res.status(400).send({
          success: false,
          message: "provide projectName",
        });
        return;
      }

      res.status(200).send({
        success: true,
      });
    } catch (error: any) {
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async destroyIp(req: Request, res: Response) {
    try {
      const { taskArn } = req.body;

      if (!taskArn) {
        res.status(400).send({
          success: false,
          message: "provide taskArn",
        });
        return;
      }

      res.status(200).send({
        success: true,
      });
    } catch (error: any) {
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }
}
