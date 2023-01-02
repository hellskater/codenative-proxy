import { exec } from "child_process";
import { Request, Response } from "express";
import fs from "fs";

export class IpController {
  static async issueIp(req: Request, res: Response): Promise<void> {
    try {
      const { slug, ip } = req.body;

      if (!slug) {
        res.status(400).send({
          success: false,
          message: "provide slug",
        });
        return;
      }

      if (!ip) {
        res.status(400).send({
          success: false,
          message: "provide ip",
        });
        return;
      }

      const config = `server {
        listen 9080 ssl;
        server_name ${slug}.codenative.link;
    
        location / {
            proxy_pass http://${ip}:9080;
        }
    
        ssl_certificate /etc/letsencrypt/live/codenative.link/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/codenative.link/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    }
    
    server {
      listen 1338 ssl;
      server_name ${slug}.codenative.link;
  
      location / {
          proxy_pass http://${ip}:1338;
      }
  
      ssl_certificate /etc/letsencrypt/live/codenative.link/fullchain.pem; # managed by Certbot
      ssl_certificate_key /etc/letsencrypt/live/codenative.link/privkey.pem; # managed by Certbot
      include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
      ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  }`;

      fs.appendFileSync("/etc/nginx/conf.d/proxy.conf", config);

      // Reload Nginx to apply the changes
      exec("nginx -s reload", (error, stdout) => {
        if (error) {
          console.error(`Error reloading Nginx: ${error}`);
          return;
        }
        console.log(`Nginx reloaded: ${stdout}`);
      });

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
