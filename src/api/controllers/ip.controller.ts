import { exec } from "child_process";
import { Request, Response } from "express";
import fs from "fs";

export class IpController {
  static async createEntry(req: Request, res: Response): Promise<void> {
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

      const config = `
      server {
        listen 9080 ssl;
        server_name ${slug}.codenative.link;
    
        location / {
            proxy_pass http://${ip}:9080;
        }
    
        ssl_certificate /etc/letsencrypt/live/codenative.link/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/codenative.link/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    } server {
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
      exec("sudo nginx -s reload", (error, stdout) => {
        if (error) {
          console.error(`Error reloading Nginx: ${error}`);
          return;
        }
        console.log(`Nginx reloaded: ${stdout}`);
      });

      res.status(200).send({
        success: true,
        message: `Added ${slug}.codenative.link`,
      });
    } catch (error: any) {
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteEntry(req: Request, res: Response) {
    try {
      const { slug } = req.body;

      if (!slug) {
        res.status(400).send({
          success: false,
          message: "provide slug",
        });
        return;
      }
      const domain = `${slug}.codenative.link`;

      // Read the Nginx configuration file
      const config = fs.readFileSync("/etc/nginx/conf.d/proxy.conf", "utf8");

      const regex = new RegExp(
        `server\\s*\\{[\\s\\S]*?listen\\s*\\d+\\s*ssl[\\s\\S]*?server_name\\s*${domain}[\\s\\S]*?location\\s*\\/\\s*\\{[\\s\\S]*?\\}[\\s\\S]*?ssl_[^\\s]*[\\s\\S]*?\\}`,
        "g"
      );

      // Replace the server block with an empty string
      const modifiedConfig = config.replace(regex, "");

      // Rewrite the configuration file with the updated lines
      fs.writeFileSync("/etc/nginx/conf.d/default.conf", modifiedConfig);

      // Reload Nginx to apply the changes
      exec("sudo nginx -s reload", (error, stdout) => {
        if (error) {
          console.error(`Error reloading Nginx: ${error}`);
          return;
        }
        console.log(`Nginx reloaded: ${stdout}`);
      });

      res.status(200).send({
        success: true,
        message: `Deleted ${domain}`,
      });
    } catch (error: any) {
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }
}
