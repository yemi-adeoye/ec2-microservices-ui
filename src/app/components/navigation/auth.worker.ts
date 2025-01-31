/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  let intervalId: any;

  console.log({ data })

  if (data == 'LOGGED_IN') {
    intervalId = setInterval(() => postMessage("computation"), 2000)
    console.log({ intervalId })
    localStorage.setItem('intervalId', intervalId)
  }

  if (data == 'NOT_LOGGED_IN') {
    intervalId = intervalId || localStorage.getItem('intervalId')
  }


  // const response = `worker response to ${data}`;
  // postMessage('response from worker');
});
