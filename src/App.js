import React, { useEffect, useState, Fragment } from "react";
import { ethers } from "ethers";
import axios from "axios";
import "./App.less";



const ethereum = window.ethereum;
console.log('ethereum', ethereum);

//DEV:
// const aWSBTokenAddress = AWSB_TOKEN_ADDRESS_TEST;
// const aWSBAirDropContractAddress = AWSB_AIRDROP_CONTRACT_ADDRESS_TEST;
// const FairyAirDropContractAddress = FAIRY_CONTRACT_ADDRESS_TEST;

let ethersProvider;
let signer;
if (ethereum) {
  ethersProvider = new ethers.providers.Web3Provider(ethereum, "any");
  signer = ethersProvider.getSigner();
  console.log("signer", signer);
}
console.log("🚀 ~ file: App.tsx ~ line 33 ~ ethersProvider", ethersProvider);


const formatAddress = (address) => {
  return address.substr(0, 8) + "..." + address.substr(address.length - 8, 8);
};

const getGlpBalance = async (address) => {
    let queryParams = {
        account: address
    }
    let config = {
      headers: {
        "ngrok-skip-browser-warning": true
      }
    }
    let response = await axios.get('https://839d-35-79-17-63.jp.ngrok.io/get_glp_balance?account=' + address, config) // build transaction
    let glpBalance = response.data;
    console.log("getGlpBalance", glpBalance);
    return glpBalance;
}

const getAccountComposite = async (address) => {
    let config = {
      headers: {
        "ngrok-skip-browser-warning": true
      }
    }
    let response = await axios.get('https://839d-35-79-17-63.jp.ngrok.io/get_account_composite?account=' + address, config) // build transaction
    let accountComposite = response.data;
    console.log("accountComposite", accountComposite);
    return accountComposite;
}


function App() {
  const [address, setAddress] = useState("");
  const [noWallet, setNotWallet] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState();
  const [glpBalance, setGlpBalance] = useState("0");
  const [accountComposite, setAccountComposite] = useState({});


  useEffect(() => {
    if (!ethereum) {
      setNotWallet(true);
      setConnecting(false);
      return;
    }
    let chainId;
    setConnecting(true);
    const getNetWork = async () => {
      chainId = (await ethersProvider.getNetwork()).chainId;
      console.log("chainId", chainId)
    };
    getNetWork();
    async function getAccount() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsMetaMaskConnected(Boolean(ethereum.selectedAddress));
      setConnecting(false);
    }
    getAccount();
  }, []);

  const change = (accounts) => {
    setIsMetaMaskConnected(
      accounts.length > 0 && Boolean(ethereum.selectedAddress)
    );
    if (!(accounts.length > 0 && Boolean(ethereum.selectedAddress))) {
      setAddress("");
    }
  };
  if (ethereum) {
    ethereum.on("accountsChanged", change);
  }

  const getAccountInfo = async () => {
    if (isMetaMaskConnected) {
      let walletAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(walletAccounts[0]);
      let glpBalance = await getGlpBalance(walletAccounts[0]);
      setGlpBalance(glpBalance);

      let accountComposite = await getAccountComposite(walletAccounts[0]);
      setAccountComposite(accountComposite)

    }
  }

  useEffect(() => {
    // 获取合约相关信息
    getAccountInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMetaMaskConnected]);

  const connectWallet = async () => {
    return await ethereum.request({
      method: "eth_requestAccounts",
    });
  };


  return (
    <div className="App">
      <div className="main">
        <div className="airdrop">
          <div className="title">
            <span style={{ fontWeight: 900 }}>aWSB</span>
            <span style={{ fontWeight: 300, marginLeft: "10px" }}>
              AirDrop Event
            </span>
            <div className="version">1.1.0</div>
          </div>

          <div className="address-info">
            <div className="key address-text">
              <div
                className="connected"
                style={{
                  background: address ? "#52c41a" : "#E1694E",
                }}
              ></div>
              {connecting && "Connecting..."}
              {noWallet && "Wallet not found!"}
              {address
                ? formatAddress(String(address))
                : !noWallet
                ? "Please Unlock Wallet."
                : ""}
            </div>
            {address && (
              <Fragment>
                <div className="key token-balance">
                  Balance:{" "}
                  <span style={{ fontWeight: 600, marginLeft: 10 }}>
                    {glpBalance} GLP
                  </span>
                </div>
              </Fragment>
            )}
          </div>
          {address ? (
            <button
              className="claim-button"
              onClick={() => {}}
              disabled={true}
              style={{
                background: false
                  ? "#858da1"
                  : "#ec615b",
              }}
            >
            </button>
          ) : noWallet ? (
            <button
              className="claim-button"
              disabled
              style={{
                background: "#858da1",
              }}
            >
              {noWallet
                ? "Please Install MetaMask."
                : "Please Switch NetWork to BSC."}
            </button>
          ) : (
            <button
              className="claim-button"
              style={{
                background: "#4B2CC8",
              }}
              onClick={connectWallet}
              disabled={connecting}
            >
              {connecting ? "Connecting..." : "Unlock Wallet"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
