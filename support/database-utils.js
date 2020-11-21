import { querySudo as query } from '@lblod/mu-auth-sudo';
const pingDbInterval = process.env.PING_DB_INTERVAL || 2;

const isDatabaseUp = async function() {
  let isUp = false;
  try {
    await sendDumyQuery();
    isUp = true;
  } catch (e) {
    console.log("Waiting for database... ");
  }
  return isUp;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const waitForDatabase = async function(callback) {
  let loop = true;
  while (loop) {
    loop = !(await isDatabaseUp());
    await sleep(pingDbInterval*1000);
  }
  callback();
};

const sendDumyQuery = async function() {
  try {
    const result = await query(`
      SELECT ?s
      WHERE {
        GRAPH ?g {
          ?s ?p ?o
        }
      }
      LIMIT 1
    `);
  } catch (e) {
    throw new Error(e.toString());
  }
};

export { waitForDatabase }
