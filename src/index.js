import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers";


export const main = async ({ path = "vitalik.eth" }) => {
  const ensDomain = path.split("/").pop();
  // Check if the path is a valid string
  if (typeof ensDomain !== "string" || !ensDomain.endsWith(".eth")) {
    throw new Error("Invalid ENS domain");
  }

  const provider = new JsonRpcProvider("https://cloudflare-eth.com");

  try {
    // Resolve the ENS name to an Ethereum address
    const address = await provider.resolveName(ensDomain);

    if (!address) {
      throw new Error(`No address found for ENS domain: ${ensDomain}`);
    }

    // Get the Ethereum balance in Wei
    const balance = await provider.getBalance(address);

    // Convert balance from Wei to Ether
    const ethBalance = ethers.formatEther(balance);

    // Reverse lookup the ENS name from the Ethereum address
    const reverseName = await provider.lookupAddress(address);

    return `<html>
    <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f0f0f0; padding: 20px;">
      <h1 style="color: #333;">ENS Lookup</h1>
      <p style="font-size: 18px;">ENS domain: <strong>${ensDomain}</strong></p>
      <p style="font-size: 18px;">Address: <strong>${address}</strong></p>
      <p style="font-size: 18px;">Balance: <strong>${ethBalance} ETH</strong></p>
      ${
        reverseName
          ? `<p style="font-size: 18px;">Reverse ENS: <strong>${reverseName}</strong></p>`
          : ""
      }
    </body>
    </html>`;
  } catch (error) {
    console.error("Error:", error.message);
    return `<html>
    <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f0f0f0; padding: 20px;">
      <h1 style="color: red;">Error</h1>
      <p style="font-size: 18px;">${error.message}</p>
    </body>
    </html>`;
  }
};
