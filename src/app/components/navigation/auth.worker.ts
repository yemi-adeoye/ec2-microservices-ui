/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const TOKEN_EXPIRES_IN = 180000
  const REFRESH = 'REFRESH'
  let intervalId: any;

  if (data == 'LOGGED_IN') {
    setInterval(() => postMessage(REFRESH), TOKEN_EXPIRES_IN)
  }

  if (data == 'NOT_LOGGED_IN') {
    intervalId = intervalId || localStorage.getItem('intervalId')
  }

});
