export const environment = {
  authServer: {
    // authEndpoint: 'http://localhost:8002/oauth2/authorize',
    authEndpoint: 'http://bank.yemi-adeoye.com:8002/oauth2/authorize',
    // clientId: "ui-app-local",
    clientId: "ui-app-prod",
    // redirectUri: 'http://localhost:4200/accounts',
    redirectUri: 'http://bank-web-ui.yemi-adeoye.com/accounts',
    responseType: 'code',
    scope: 'openid'
  },
  // apiGatewayUrl: 'http://localhost:7000'
  apiGatewayUrl: 'http://bank.yemi-adeoye.com:7000'
}
