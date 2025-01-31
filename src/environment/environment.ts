export const environment = {
  authServer: {
    authEndpoint: 'http://localhost:8002/oauth2/authorize',
    clientId: "ui-app-local",
    redirectUri: 'http://localhost:4200/accounts',
    responseType: 'code',
    scope: 'openid'
  }
}
