function pingServer() {
  return new Promise((resolve, reject) => {
    let isReachable = Math.random() < 0.5;
    setTimeout(() => {
      if (isReachable) {
        resolve(true);
      } else {
        reject(false);
      }
    }, 1000);
  });
}
async function checkServer() {
  for (let i = 0; i < 5; i++) {
    try {
      await pingServer();
      console.log(`Server successful after ${i + 1} attempts.`);
      return;
    } catch (error) {
      console.log("Server is unreachable.");
    }
    if (i === 4) {
      console.log("Server is unreachable after 5 attempts.");
    }
  }
}
checkServer();
