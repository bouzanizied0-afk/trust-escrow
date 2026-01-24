// ethereum.js
import { ethers } from "ethers";

// 1️⃣ نضع رابط شبكة Ethereum (عام)
const RPC_URL = "https://cloudflare-eth.com";

// 2️⃣ نُنشئ اتصال بالشبكة
const provider = new ethers.JsonRpcProvider(RPC_URL);

// 3️⃣ دالة تجيب رصيد عنوان
async function getEthBalance(address) {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

// 4️⃣ نجرب على عنوان حقيقي (عام)
async function run() {
  const address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  const balance = await getEthBalance(address);
  console.log("الرصيد:", balance, "ETH");
}

run();
