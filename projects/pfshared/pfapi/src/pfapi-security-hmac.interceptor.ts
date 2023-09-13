import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { NGXLogger } from "ngx-logger";
import { $pf } from "../models/PhotoFinaleContext";
import MD5 from "crypto-js/md5";
import HmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";
import * as moment from "moment";

@Injectable()
export class PFApiSecurityHMACInterceptor implements HttpInterceptor {
  constructor(private logger: NGXLogger) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith($pf.apiUrl)) {
      return next.handle(request);
    }

    // create authorizaton headers
    const secret = $pf.user.authSecret;
    const messageRepresentation = this.getMessageRepresentation(request);
    const requestSignature = this.getSignature(secret, messageRepresentation);
    const authorizationHeader = this.getAuthorizationHeader(
      "PFAPI",
      $pf.user.authKey,
      requestSignature
    );

    /*
        this.logger.debug(`
          messageRepresentation ==>
          ${messageRepresentation.stringToSign}
          <==
          requestSignature: "${requestSignature}"
          secret: "${secret}"`
        );
    */

    const clonedRequest = request.clone({
      setHeaders: {
        "Accept": request.headers["Accept"] || "application/json",
        "Content-Type": messageRepresentation.contentType,
        "$Date": messageRepresentation.currentDateTime,
        "Content-MD5": messageRepresentation.contentMD5,
        "Authorization": authorizationHeader
      }
    });

    return next.handle(clonedRequest);
  }

  private computeMD5Hash(content: string): string {
    const hash = MD5(content);
    const md5Hash = hash.toString();

    /*
        this.logger.debug(`
          request MD5 = ${md5Hash}
          content ==>
          ${content}
          <==`
        );
    */

    return md5Hash;
  }

  private getAuthorizationHeader(authScheme: string, accessToken: string, signature: string): string {
    return `${authScheme} ${accessToken}:${signature}`;
  }

  private getMessageRepresentation(request: HttpRequest<any>) {
    const messageRepresentation = {
      method: "",
      currentDateTime: "",
      contentType: "",
      contentMD5: "",
      stringToSign: ""
    };

    messageRepresentation.method = request.method.toUpperCase();
    messageRepresentation.currentDateTime = moment.utc().format().replace("T", " ");

    if (request.body) {
      messageRepresentation.contentType = "application/json";
      let content = request.body;
      if (typeof content === 'object') {
        content = JSON.stringify(content);
      }
      messageRepresentation.contentMD5 = this.computeMD5Hash(content);
    }

    let relativeUrl = request.url.replace($pf.apiUrl, "") + "?" + request.params.toString();
    relativeUrl = relativeUrl.startsWith("/") ? relativeUrl : `/${relativeUrl}`;

    messageRepresentation.stringToSign = this.buildMessageRepresentation(
      messageRepresentation.method,
      messageRepresentation.contentType,
      messageRepresentation.contentMD5,
      messageRepresentation.currentDateTime,
      relativeUrl
    );

    return messageRepresentation;
  }

  private getSignature(secret, messageRepresentation): string {
    const hmac = HmacSHA256(messageRepresentation.stringToSign, secret);
    const signature = hmac.toString(Base64);

    return signature;
  }

  private buildMessageRepresentation(verb: string, contentType: string, contentMD5: string, requestDate: string, relativeUrl: string): string {
    return `${verb}\n${contentType}\n${contentMD5}\n${requestDate}\n${relativeUrl}`;
  }
}