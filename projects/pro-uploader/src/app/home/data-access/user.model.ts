export class User {
  constructor(
    private dealerCode: string,
    private username: string,
    private authorizationKey: string
  ) {}

  get AuthorizationKey() {
    return this.authorizationKey;
  }

  get DealerCode() {
    return this.dealerCode;
  }

  get UserName() {
    return this.username;
  }
}
