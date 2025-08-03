
# 🧪 V2 Adaptor Project Setup Guide

This guide walks you through setting up and running the **V2 Adaptor smart contract**, **subgraph**, and **frontend** locally using a forked network.

---

## 📁 Project Structure

```

/abi
/adaptor-subgraph/v2adaptor-subgraph
/contracts
/frontend

````

---

## 🔧 Step 1: Start Local Forked Hardhat Node

In the `/contracts` directory, run:

```bash
npx hardhat node --fork <FORK_URL> --hostname 0.0.0.0
````

Replace `<FORK_URL>` with your fork provider URL (e.g., from Alchemy or Infura).

---

## 🚀 Step 2: Deploy V2 Adaptor Contract

Still in the `/contracts` directory, deploy the adaptor contract to your local forked network:

```bash
npx hardhat ignition deploy ./ignition/modules/V2Adaptor.js --network localhost
```

---

## 💰 Step 3: Fund Your Wallet with Tokens

Use the provided script to impersonate whales and fund your wallet with tokens like WETH and USDC.

### Default Configuration (`contract/script/fundWallet.js`):

```js
let tokenA = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"; // WETH
let tokenB = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // USDC

let ethWhale = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
let usdcWhale = "0x25681Ab599B4E2CEea31F8B498052c53FC2D74db";
```

Run the script:

```bash
npx hardhat run script/fundWallet.js
```

---

## ✏️ Step 4: Update Addresses & Block Numbers

After deploying the contract, copy the deployed address and update it in:

1. **Subgraph Network Config**

   * File: `adaptor-subgraph/v2adaptor-subgraph/networks.json`
   * Field: `"address"`

2. **Subgraph Manifest**

   * File: `adaptor-subgraph/v2adaptor-subgraph/subgraph.yaml`
   * Field: `address`

3. **Frontend Environment**

   * File: `frontend/.env`
   * Field: `VITE_ADAPTOR_ADDRESS=<your_deployed_address>`

✅ Also update the `startBlock` in both `networks.json` and `subgraph.yaml` to a block number **older** than the contract's deployed block number (from your fork network).

---

## 🐳 Step 5: Start Graph Node (Docker)

In the `adaptor-subgraph/` directory, start the local Graph Node using Docker:

```bash
sudo docker-compose up
```

Wait for logs showing it's syncing with `eth_getTransactionReceipt`.

---

## 📡 Step 6: Create & Deploy Subgraph

Inside `/adaptor-subgraph/v2adaptor-subgraph`, run:

### 1. Create Subgraph

```bash
graph create --node http://localhost:8020/ v2Adaptor-subgraph
```

### 2. Deploy Subgraph

```bash
graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001 v2Adaptor-subgraph
```

You should see:

```
Queries (HTTP): http://localhost:8000/subgraphs/name/v2Adaptor-subgraph
```

---

## 🌐 Final Step: Start the Frontend

Go to the `/frontend` directory and run:

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✅ You're Done!

* ✅ Smart contracts deployed
* ✅ Wallet funded
* ✅ Subgraph indexing your events
* ✅ Frontend UI ready for interaction


```
