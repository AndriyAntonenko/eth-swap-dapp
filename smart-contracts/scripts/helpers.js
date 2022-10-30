const fs = require("fs");
const path = require("path");

const DEFAULT_ADDRESS_DIR = path.join(__dirname, "..", "deployments");

async function saveDeploymentInfo(
  name,
  address,
  txHash,
  dir = DEFAULT_ADDRESS_DIR
) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const timestamp = Date.now();
  const fileName = `${timestamp}-${name}.json`;
  const info = { timestamp, name, address, txHash };
  fs.writeFileSync(path.join(dir, fileName), JSON.stringify(info, null, 2));
}

function logDeploymentInfo(name, address, hash) {
  console.info(
    `Successfully deployed ${name} smart contract to address ${address}. Tx hash: ${hash}`
  );
}

module.exports = { saveDeploymentInfo, logDeploymentInfo };
