require("dotenv").config();
const { Web3Storage, File } = require("web3.storage");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load environment variables
const {
  PRIVATE_KEY,
  INFURA_RPC,
  WEB3STORAGE_TOKEN,
  CONTRACT_ADDRESS,
} = process.env;

// Load ABI (make sure it's compiled)
const abi = require("./CertificateNFT_ABI.json");

// Setup provider, signer, contract
const provider = new ethers.JsonRpcProvider(INFURA_RPC);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// Upload a file to IPFS and return the URL
async function uploadToIPFS(filePath) {
  const storage = new Web3Storage({ token: WEB3STORAGE_TOKEN });
  const content = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const files = [new File([content], fileName)];
  const cid = await storage.put(files);
  return `ipfs://${cid}/${fileName}`;
}

// Mint a certificate NFT
async function mintCertificate(recipient, tokenURI) {
  const tx = await contract.mintCertificate(recipient, tokenURI);
  await tx.wait();
  console.log(`Minted certificate for ${recipient} at ${tokenURI}`);
}

// Main logic
async function main() {
  const certFolder = path.join(__dirname, "api", "certificate");
  const files = fs.readdirSync(certFolder);

  const recipient = await signer.getAddress(); // use wallet for now

  for (const file of files) {
    const filePath = path.join(certFolder, file);
    const ipfsURL = await uploadToIPFS(filePath);
    await mintCertificate(recipient, ipfsURL);
  }
}

main().catch(console.error);
