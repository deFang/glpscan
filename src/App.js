import React, { useEffect, useState, Fragment } from "react";
import { ethers } from "ethers";
import axios from "axios";
import "./App.css";
import gmx from "./asset/gmx.png";
import {
  Image,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
} from "@chakra-ui/react";

const toFixed = (digit, bits = 3) => {
  return Math.round(digit * Math.pow(10, bits)) / Math.pow(10, bits);
};

const formatDecimal = (digit, decimals = 18) => {
  return digit / Math.pow(10, decimals);
};

const formatAddress = (address) => {
  return address.substr(0, 8) + "..." + address.substr(address.length - 8, 8);
};

const getSum = (array) => {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
      sum += array[i][2]
    }
    return sum
  }

const getGlpBalance = async (address) => {
  let queryParams = {
    account: address,
  };
  let config = {
    headers: {
      "ngrok-skip-browser-warning": true,
    },
  };
  let response = await axios.get(
    "https://839d-35-79-17-63.jp.ngrok.io/get_glp_balance?account=" + address,
    config
  ); // build transaction
  let glpBalance = response.data;
  return glpBalance;
};

const getAccountComposite = async (address, detail) => {
  let config = {
    headers: {
      "ngrok-skip-browser-warning": true,
    },
  };
  let response;
  if (detail) {
    response = await axios.get(
      "https://839d-35-79-17-63.jp.ngrok.io/get_account_composite?account=" +
        address +
        "&detail=" +
        detail,
      config
    );
  } else {
    response = await axios.get(
      "https://839d-35-79-17-63.jp.ngrok.io/get_account_composite?account=" +
        address,
      config
    );
  }
  let accountComposite = response.data;
  return accountComposite;
};

function App() {
  const [address, setAddress] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [glpBalance, setGlpBalance] = useState("0");
  const [accountComposite, setAccountComposite] = useState([
    ["Stable Coins", 0, 0],
    ["WBTC", 0, 0],
    ["WETH", 0, 0],
    ["LINK", 0, 0],
    ["UNI", 0, 0],
  ]);

  const getAccountInfo = async () => {
    if (ethers.utils.isAddress(address)) {
      setIsValidAddress(true);
      let formatAddress = ethers.utils.getAddress(address);
      let userGlpBalance = await getGlpBalance(formatAddress);
      setGlpBalance(userGlpBalance);

      let userAccountComposite = await getAccountComposite(
        formatAddress,
        !isChecked
      );
      console.log("userAccountComposite", userAccountComposite);
      setAccountComposite(userAccountComposite);
      console.log(accountComposite);
    } else {
      setIsValidAddress(false);
    }
  };

  useEffect(() => {
    // 获取合约相关信息i
    getAccountInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked, address]);

  return (
    <div className="App">
      <div className="main">
        <div>
          <header className="head">
            <div display={"flex"}>
              <Image className="image" src={gmx} />
              <div className="title">GLP Scaner</div>
            </div>
            <div className="icon">
              <a target="_blank" href="https://twitter.com/Dzerohash">
                <i
                  className="fa fa-twitter"
                  aria-hidden="true"
                  style={{ paddingRight: "8px" }}
                ></i>
              </a>
              <a href="https://weibo.com/6989957363" target="_blank">
                <i
                  className="fa fa-weibo"
                  aria-hidden="true"
                  style={{ paddingRight: "8px" }}
                ></i>
              </a>
              <a href="https://github.com/deFang" target="_blank">
                <i className="fa fa-github" aria-hidden="true"></i>
              </a>
            </div>
          </header>
          <div className="subtilte">Know what your GLPs are made of</div>
          <section className="mainbody">
            <FormControl>
              <h2>Enter an Arbitrum Address</h2>
              <div>
                <Input
                  placeholder="Input Your Address"
                  variant="outline"
                  w={"50%"}
                  h={"1.8rem"}
                  marginTop={"1rem"}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
              {isValidAddress ? (
                <div style={{ marginTop: "1rem" }}>
                  You have
                  <b> {formatDecimal(glpBalance)} GLP</b>
                </div>
              ) : address ? (
                <div style={{ marginTop: "1rem" }}>Invalid Address</div>
              ) : (
                <div></div>
              )}
            </FormControl>
          </section>
          {isValidAddress && glpBalance > 0 && (
            <section className="mainbody">
              <h2>List of Ingredients</h2>
              <div
                style={{
                  textAlign: "right",
                  marginRight: "2rem",
                  marginBottom: "1rem",
                }}
              >
                <label className="switch">
                  <span> Consolidate LINK&UNI into ETH </span>
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      setIsChecked(event.target.checked);
                    }}
                    checked={isChecked}
                  />
                </label>
              </div>
              <div style={{paddingBottom:"10%"}}>
              <table
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  display: "table",
                  borderSpacing: "2px",
                  borderColor: "#000000",
                  textAlign: "left",
                }}
              >
                <thead
                  style={{
                    borderColor: "#000000",
                    boxSizing: "border-box",
                    verticalAlign: "middle",
                    display: "table-header-group",
                  }}
                >
                  <tr>
                    <th
                      colSpan="2"
                      style={{
                        padding: "0.75rem",
                        borderTop: "1px solid #dee2e6",
                        borderBottom: "2px solid #dee2e6",
                        verticalAlign: "bottom",
                      }}
                    >
                      Address
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "0.75rem",
                        borderTop: "1px solid #dee2e6",
                        borderBottom: "2px solid #dee2e6",
                        verticalAlign: "bottom",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accountComposite.map((comp) => {
                    return (
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            padding: "0.75rem",
                            borderBottom: "1px solid #dee2e6",
                            verticalAlign: "top",
                          }}
                        >
                          {comp[0]}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "0.75rem",
                            borderBottom: "1px solid #dee2e6",
                            verticalAlign: "top",
                          }}
                        >
                          {toFixed(comp[1], 2)} (${toFixed(comp[2], 2)})
                        </td>
                      </tr>
                    );
                  })}
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            padding: "0.75rem",
                            borderBottom: "2px solid #dee2e6",
                            verticalAlign: "top",
                          }}
                        >
                          SUM
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "0.75rem",
                            borderBottom: "2px solid #dee2e6",
                            verticalAlign: "top",
                          }}
                        >
                          ${
                            toFixed(getSum(accountComposite),2)
                          }
                        </td>
                      </tr>
                </tbody>
              </table>
                </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
