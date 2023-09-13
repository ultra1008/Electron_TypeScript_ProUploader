//!!!import $ from "jquery";
//!!!import angular from "angular";
import { DealerSettings } from "./DealerSettings";
import { OrderSource } from "./OrderSource";
import { ServiceLocator } from "pfshared/utility";

export class AvailableLanguage {
  public CultureName: string;
  public DisplayName: string;
  public Name: string;
}

export class PhotoFinaleContext {
  allowSharing: boolean;
  apiKey: string;
  apiUrl: string = "https://api3.photofinale.com";
  appId: string;
  basketId: string;
  basketAlbumId: string;
  cookieDomain: string;
  domain: string;
  facebookAppId: string;
  googleMapsApiKey: string;
  instagramAppId: string;
  isPrintNetwork: boolean;
  lpsUrl: string;
  orderSource: OrderSource;
  recaptchaSiteKey: string;
  secureDomain: string;
  serviceDomain: string;
  sourceApplication: string;
  trackingId: string;

  analytics = new class {
    dealerUa: string;
    domain: string;
    enabled: boolean;
    trackDealer: boolean;
    ua: string;
  };

  cultureInfo = new class {
    displayName: string = "English (United States)";
    lcid: number = 1033;
    name: string = "en-US";
    twoLetterISOLanguageName: string = "en";
  };

  dealer = new class {
    name: string;
    code: string;
    country: string = "US";
    currencyCode: string = "USD";
    currencySymbol: string = "$";
    email: string;
    hasEventLicense: boolean;
    id: number;
    phone: string;
    path: string;
    settings: DealerSettings;
    vdir: string;
    options = new class {
      checkout_data_protection_agreement: string;
      checkout_terms_and_conditions: string;
      cookie_terms_and_conditions: string;
      demandware: boolean;
      dpi_threshold: number;
      enable_imgly_editor: boolean;
      enable_kiosk_u2k_sms: boolean;
      enable_photo_archive: boolean;
      enable_web_u2k_sms: boolean;
      express_upload_dpi: number;
      external_content_enabled: boolean;
      fast_upload_dpi: number;
      hide_country_on_delivery: boolean;
      hide_print_cropping_options: boolean;
      hide_tax_when_zero: boolean;
      offer_prepayment_only_when_required: boolean;
      prevent_multiple_coupons: boolean;
      require_billing_address_for_payment: boolean;
      show_additional_shipping_instructions: boolean;
      show_company_on_delivery: boolean;
      skip_cart_after_prints: boolean;
      skip_pickup_if_a_single_store: boolean;
      upload_image_max_size: number;
      upload_image_quality: number;
    };
  };

  orderSummary = new class {
    confirmation: number;
    subTotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    balanceDue: number;
    coupons: string[];
    items: {
      productId: string;
      productName: string;
      quantity: string;
      price: string;
      type: string;
    }[];
  };

  regionInfo = new class {
    currencySymbol: string = "$";
    displayName: string = "United States";
    geoId: number = 244;
    isoCurrencySymbol: string = "USD";
    name: string = "US";
    twoLetterISORegionName: string = "US";
  };

  ui = new class {
    constructor(public __super: PhotoFinaleContext) {
    }

    availableLanguages: AvailableLanguage[];
    blockUploads: boolean;
    content: {
      hideFooter: boolean;
      hideHeader: boolean;
      metaDescription: string;
      metaKeywords: string;
      title: string;
    };
    enableLineBreakDebugger: boolean;
    enableLineSize: boolean;
    isBot: boolean;
    isLocal: boolean;
    isPFKiosk: boolean;
    isRiteAidMobile: boolean;
    links: { [key: string]: string; };
    photoEditors: string[] = [];
    resxCacheBuster: string = "";
    selectedLanguageName: string = "en-US";

    getAvailableLanguages(): AvailableLanguage[] {
      return this.availableLanguages;
    }

    languageSelect(selector): void {
      //!!!
      /*
            var $control = $(selector);

            $control.html("");

            this.availableLanguages.forEach((value: AvailableLanguage) => {
              $control.append(`<option value='${value.CultureName}'>${value.DisplayName}</option>`);
            });

            $control.val(this.__super.cultureInfo.name);

            $control.on("change", (evnt) => {
              var language: string = $(evnt.target).val() as string;
              this.setLanguage(language);
            });
      */
    }

    setAvailableLanguages(languages: AvailableLanguage[]): void {
      this.availableLanguages = languages;
    }

    setLanguage(languageName: string, redirect?: string): void {
      try {
        if (languageName != this.selectedLanguageName) {
          const globalDataService = this.__super.util.$$getInstance("globalDataService");
          if (globalDataService) {
            globalDataService.setLanguage(languageName).finally(() => {
              if (redirect) {
                window.location.href = redirect;
              } else {
                window.location.reload();
              }
            });
          }
        }
      } catch (e) { }
    }
  }(this);

  user = new class {
    address: string;
    authKey: string;
    authSecret?: string;
    authSignature: string;
    city: string;
    company: string;
    country: string;
    dateCreated: Date;
    email: string;
    firstName: string;
    id: number;
    isAuthenticated: boolean;
    lastName: string;
    nickname: string;
    personId: number;
    phone: string;
    state: string;
    userName: string;
    zip: string;
  };

  util = new class {
    constructor(public __super: PhotoFinaleContext) {
    }

    $$getInstance(name: string) {
      return ServiceLocator.injector.get(name);
    }

    getFirstBrowserLanguage(): string {
      const nav = window.navigator;
      const browserLanguagePropertyKeys = ["language", "browserLanguage", "systemLanguage", "userLanguage"];
      let i: number;
      let language: string & any | any;

      // support for HTML 5.1 "navigator.languages"
      if (Array.isArray(nav.languages)) {
        for (i = 0; i < nav.languages.length; i++) {
          language = nav.languages[i];
          if (language && language.length) {
            return language;
          }
        }
      }

      // support for other well known properties in browsers
      for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
        language = nav[browserLanguagePropertyKeys[i]];
        if (language && language.length) {
          return language;
        }
      }

      return null;
    }

    getAdobeAnalyticsUrl(): string {
      return "NOT IMPLEMENTED";
      //!!!
      /*
            if (DEVELOPMENT) {
              return "https://assets.adobedtm.com/launch-ENa76bbca6b5054bdeb7d2ded47094599d-development.min.js";
            }

            if (SANDBOX) {
              return "https://assets.adobedtm.com/launch-ENa76bbca6b5054bdeb7d2ded47094599d-development.min.js";
              //return "https://assets.adobedtm.com/launch-EN85d87374de6845f9842d2df844976174-staging.min.js";
            }

            return "https://assets.adobedtm.com/launch-EN4efda6f2cbca476181c1a5830cfc3e9d.min.js";
          }

          getGoogleMapsUrl(): string {
            if (DEVELOPMENT) {
              return "https://maps.googleapis.com/maps/api/js?v=3&libraries=weather,geometry,visualization";
            }

            return "https://maps.googleapis.com/maps/api/js?v=3&libraries=weather,geometry,visualization&key=" + this.__super.googleMapsApiKey;
      */
    }

    getPlatform(): string {
      var platform = "web";

      if (this.__super.ui.isPFKiosk) {
        try {
          const kioskSessionService = this.$$getInstance("kioskSessionService");
          if (kioskSessionService && kioskSessionService.fulfillment) {
            platform = `kiosk-${kioskSessionService.fulfillment.type}`;
          }
        } catch (e) { }
      }

      return platform;
    }

    uuid(): string {
      var d = new Date().getTime();
      if (typeof performance !== "undefined" && typeof performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
        c => {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
  }(this);

  languageSelect(selector): void {
    this.ui.languageSelect(selector);
  }

  setAvailableLanguages(languages: AvailableLanguage[]): void {
    this.ui.setAvailableLanguages(languages);
  }

  setLanguage(region: string): void {
    this.ui.setLanguage(region);
  }
};

export const $pf = new PhotoFinaleContext();