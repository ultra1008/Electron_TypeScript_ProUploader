declare const InstallTrigger: any;

export class BrowserInfo {
    constructor() {
        this.initBrowserInfo();
    }

    isAndroid: boolean;
    isBlackBerry: boolean;
    isBlink: boolean;
    isChrome: boolean;
    isEdge: boolean;
    isFirefox: boolean;
    isIE: boolean;
    isiOS: boolean;
    isMac: boolean;
    isMobile: boolean;
    isOpera: boolean;
    isSafari: boolean;
    isTablet: boolean;
    name: string;
    userAgent: string;
    version: string;

    private initBrowserInfo(): void {
        const ua = this.userAgent = navigator.userAgent;

        this.isAndroid = ua.match(/Android/i) != null;
        this.isBlackBerry = ua.match(/BlackBerry/i) != null;
        this.isiOS = ua.match(/iPhone|iPad|iPod/i) != null;
        this.isOpera = (!!(window as any).opr && !!((window as any).opr.addons) || !!(window as any).opera || (ua.indexOf(" OPR/") >= 0));
        this.isFirefox = typeof InstallTrigger !== "undefined";
        this.isIE = /*@cc_on!@*/false || !!(document as any).documentMode;
        this.isEdge = !this.isIE && !!(window as any).StyleMedia;
        this.isChrome = !!(window as any).chrome && (!!(window as any).chrome.webstore || !!(window as any).chrome.runtime);
        this.isBlink = (this.isChrome || this.isOpera) && !!(window as any).CSS;
        this.isMac = /Mac OS/.test(ua);
        this.isMobile = /Mobi/.test(ua);
        this.isSafari = navigator.vendor == "Apple Computer, Inc.";
        this.isTablet = (ua.match(/ipad/i) != null) || (ua.match(/android/i) != null && ua.match(/mobile/i) != null) || (ua.match(/arm/i) != null);

        let tem;
        let m = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(m[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            this.name = "IE";
            this.version = (tem[1] || "");
            return;
        }
        if (m[1] === "Chrome") {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) {
                this.name = tem[1].replace("OPR", "Opera");
                this.version = tem[2];
                return;
            }
        }
        m = m[2] ? [m[1], m[2]] : [navigator.appName, navigator.appVersion, "-?"];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            m.splice(1, 1, tem[1]);
        }

        [this.name, this.version] = m;
    }
}

export const $browser = new BrowserInfo();
