import React, { Component } from "react";
import Web3 from "web3";

import Token from "../abis/Token.json";
import Usdt from "../abis/Usdt.json";
import EthSwap from "../abis/Swap.json";

//import EthSwap from '../abis/EthSwap.json'
import Navbar from "./Navbar";
import Main from "./Main";
import ClipLoader from "react-spinners/ClipLoader";
import LoadWallet from "./LoadWallet";
import Home from "./Home";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getPrice } from "./price";

// import 'react-toastify/dist/ReactToastify.css';

const web3 = new Web3();

class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    // this.notify = this.notify.bind(this);
    this.state = {
      account: "", //contract deployer account[0]
      token: {}, //Deployed instance of GCN contract in KOVAN
      usdt: {}, //Deployed instance of GCN contract in KOVAN
      ethSwap: {}, //Deployed instance of ethSwap contract in KOVAN
      ethBalance: "0",
      tokenBalance: "0",
      tokenBalanceusdt: "0",
      loading: true,
      walletLoaded: false,
      txState: "",
      price: "",
      nkrPrice: null,
      priceStable: "",
      web3Socket: {},
      ethSwapWebSocket: {},
      lastReceivedEvent: { Event: "no event" },
    };
  }

  //  notify = () => toast("Wow so easy!");

  async loadWallet() {
    this.setState({ loading: true });
    await this.loadWeb3();
    await this.loadBlockchainData();
    //  await this.loadEthSwapWebSocket();

    //subscribe to event TokenPurchased
    // await this.state.ethSwapWebSocket.events.TokensPurchased({})
    // .on('data', async (event) =>{
    //     let amount = event.returnValues._value.toString()
    //     window.alert('GCN Token purchased: ' + window.web3.utils.fromWei(amount, 'Ether'))
    //     console.log('GCN TokenPurchase tx confirmed \n')
    //     console.log('From account: ', event.returnValues._from.toString())
    //     console.log('Amount in GCN: ', window.web3.utils.fromWei(amount, 'Ether') )
    //     this.setState({ lastReceivedEvent : event.returnValues})
    //     console.log(event.returnValues)
    // })
    // .on('error', (error) => {
    //   this.setState({ lastReceivedEvent : error})
    //   console.log(error);
    // })

    //subscribe to event TokenSold
    // await this.state.ethSwapWebSocket.events.TokensSold({})
    // .on('data', async (event) =>{
    //     let amount = event.returnValues._value.toString()
    //     window.alert('GCN Token Sold: ' + window.web3.utils.fromWei(amount, 'Ether'))
    //     console.log('GCN TokenPurchase tx confirmed \n')
    //     console.log('From account: ', event.returnValues._from.toString())
    //     console.log('Amount in GCN: ', window.web3.utils.fromWei(amount, 'Ether') )
    //     this.setState({ lastReceivedEvent : event.returnValues})
    //     console.log(event.returnValues)
    // })
    // .on('error', (error) => {
    //   this.setState({ lastReceivedEvent : error});
    //   console.log(error);
    // })

    this.setState({ loading: false });
  }

  //  getPrice = async () => {
  //   const apiKey = 'bc093fe3-1948-4939-8638-2c01e69a1afa';
  // const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?convert_id=2796&id=24638`;

  // const headers = {
  //   Accepts: 'application/json',
  //   'X-CMC_PRO_API_KEY': apiKey,
  // };
  //  const data = await fetch(url, { headers , mode:"no-cors" })
  //   .then(response => response.json())
  //   .then(data => {
  //     if (data.data) {
  //       const nrkInrData = Math.round(data.data[24638].quote[2796].price * 100);
  //       return nrkInrData
  //     } else {
  //       console.log('Error fetching data.');
  //     }
  //   })
  //   .catch(error => {
  //     console.log('Error:', error);
  //   });
  //   console.log("this is data", data)
  //  return data
  // }

  //Load EthSwap instance via infura webSocket API
  async loadEthSwapWebSocket() {
    console.log(this.state.price);
    const URL = `https://mainnet-rpc.nordekscan.com/`;
    let web3Socket = new Web3(new Web3.providers.WebsocketProvider(URL));

    if (web3Socket) {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      // const ethSwapWebSocketData = EthSwap.networks[networkId]
      // if(ethSwapWebSocketData) {

      // =========== contract address ===========
      const ethSwapWebSocket = await new web3Socket.eth.Contract(
        EthSwap,
        "0x17Df908598A3a6f7DAD31B7F39f530fd9164e4A7"
      );
      this.setState({ ethSwapWebSocket });

      //   } else {
      //     window.alert('EthSwap contract not deployed to detected network.')
      //   }
      // } else{
      //   window.alert('Could not establish web socket connection to infura')
    }
  }

  //Load EthSwap and GCN token instances via Metamask web3
  async loadBlockchainData() {
    console.log("loadb start");
    // this.setState({loading : false})
    const priceNkr = await getPrice();
    this.setState({ nkrPrice: priceNkr });
    console.log("nkr price is", this.state.nkrPrice);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    console.log("acc", accounts[0]);
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });

    console.log("bal", ethBalance);

    // Load GCN Token
    const networkId = await web3.eth.net.getId();
    // const tokenData = Token.networks[networkId]
    // if(tokenData) {
    const token = new web3.eth.Contract(
      Token,
      "0x01A0930263b9F19C87Fb16F33fBE2D9A6a0963c8"
    );
    this.setState({ token });
    let tokenBalance = await token.methods.balanceOf(this.state.account).call();
    this.setState({ tokenBalance: tokenBalance.toString() });
    //  console.log("GCN Token address: ", tokenData.address)
    // } else {
    //   window.alert('Token contract not deployed to detected network.')
    // }

    console.log("token bal", tokenBalance);

    // Load EthSwap
    // const ethSwapData = await EthSwap.networks[networkId]
    // if(ethSwapData) {
    const ethSwap = new web3.eth.Contract(
      EthSwap,
      "0x17Df908598A3a6f7DAD31B7F39f530fd9164e4A7"
    );
    this.setState({ ethSwap });
    console.log(
      "ethSwap.options.address:" + this.state.ethSwap.options.address
    );
    // } else {
    //   window.alert('EthSwap contract not deployed to detected network.')
    // }
    const price = await ethSwap.methods.price().call();
    // const totalSupply = await instance.methods.totalSupply().call();
    // this.setState({ totalSupply: totalSupply });
    this.setState({ price: price });
    console.log("price is", price);
    const priceStable = await ethSwap.methods.priceStable().call();
    this.setState({ priceStable: priceStable });
    console.log("stableprice is", priceStable);

    //load USDT
    const usdt = new web3.eth.Contract(
      Usdt,
      "0x01A0930263b9F19C87Fb16F33fBE2D9A6a0963c8"
    );
    this.setState({ usdt });
    let tokenBalanceusdt = await usdt.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ tokenBalanceusdt: tokenBalanceusdt.toString() });
    // console.log("GCN Token address: ", tokenData.address)
    console.log("loadb end");
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      //window.web3 = new Web3("http://localhost:8545")
      //window.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
      await window.ethereum.enable();
      await window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        this.setState({ loading: false });
      });
      this.setState({ walletLoaded: true });
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      this.setState({ walletLoaded: false });
    }
  }

  // buyTokens = async (etherAmount) => {
  //   this.setState({ loading: true })
  //   await this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account })
  //     .on('transactionHash', (hash) => {
  //       this.setState({ txState: 'onTxHash' })
  //     })
  //     .on('confirmation', async (confirmationNumber, receipt) =>{
  //       this.setState({ txState: 'onConfirmation' })
  //       const web3 = window.web3
  //       const ethBalance = await web3.eth.getBalance(this.state.account)
  //       let tokenBalance = await this.state.token.methods.balanceOf(this.state.account).call()
  //       this.setState({
  //         ethBalance : ethBalance ,
  //         tokenBalance: tokenBalance.toString() ,
  //        })
  //       console.log("BuyTokens.on.Confirmation: ConfirmationNumber: " + confirmationNumber + " -> Receip.events: " + JSON.stringify(receipt))
  //     })
  //   this.setState({
  //     txState: '',
  //     loading: false
  //     })
  // }

  sellTokens = async (tokenAmount) => {
    console.log(
      "this.state.ethSwap.address: " + this.state.ethSwap.options.address
    );
    this.setState({ loading: true });
    const price = await getPrice();

    await this.state.token.methods
      .approve(this.state.ethSwap.options.address, tokenAmount / 10 ** 16)
      .send({ from: this.state.account })
      .on("transactionHash", async (hash) => {})
      .then(async () => {
        this.setState({ txState: "onTxHash" });
        await this.state.ethSwap.methods
          .tokenToCoin(tokenAmount / 10 ** 16, price)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ txState: "onTxHash" });
          })
          .on("confirmation", async (confirmationNumber, receipt) => {
            this.setState({ txState: "onConfirmation" });
            const web3 = window.web3;
            const ethBalance = await web3.eth.getBalance(this.state.account);
            let tokenBalance = await this.state.token.methods
              .balanceOf(this.state.account)
              .call();
            this.setState({
              ethBalance: ethBalance,
              tokenBalance: tokenBalance.toString(),
            });
            console.log(
              "SellTokens.on.Confirmation: ConfirmationNumber: " +
                confirmationNumber +
                " -> Receip.events: " +
                JSON.stringify(receipt)
            );
          });
        this.setState({
          loading: false,
          txState: "",
        });
      });
  };

  // ===============Buy================
  buyTokens = async (tokenAmount) => {
    console.log(
      "this.state.ethSwap.address: " + this.state.ethSwap.options.address
    );
    this.setState({ loading: true });

    const bnb = tokenAmount / 10 ** 18;
    const price = await getPrice();

    console.log("this is price", price);
    // }).then(async ()=>{
    this.setState({ txState: "onTxHash" });
    await this.state.ethSwap.methods
      .coinToToken(price)
      .send({ from: this.state.account, value: web3.utils.toWei(`${bnb}`) })
      .on("transactionHash", (hash) => {
        this.setState({ txState: "onTxHash" });
      })
      .on("confirmation", async (confirmationNumber, receipt) => {
        this.setState({ txState: "onConfirmation" });
        const web3 = window.web3;
        const ethBalance = await web3.eth.getBalance(this.state.account);
        let tokenBalance = await this.state.usdt.methods
          .balanceOf(this.state.account)
          .call();
        this.setState({
          ethBalance: ethBalance,
          tokenBalance: tokenBalance.toString(),
        });
        console.log(
          "SellTokens.on.Confirmation: ConfirmationNumber: " +
            confirmationNumber +
            " -> Receip.events: " +
            JSON.stringify(receipt)
        );
      });
    this.setState({
      loading: false,
      txState: "",
    });
  };
  // ================== Buy end ==============

  async handleClick() {
    if (!this.state.walletLoaded) {
      await this.loadWallet();
    } else {
      this.setState({ walletLoaded: false });
    }
    console.log("TypeOf: ", typeof this.state.lastReceivedEvent);
  }

  render() {
    let content;
    if (this.state.walletLoaded) {
      if (this.state.loading) {
        let txStatus;
        switch (this.state.txState) {
          case "onTxHash":
            txStatus = "Transaction Hash received from Blockchain  network...";
            break;
          case "onConfirmation":
            txStatus = "Confirmation received from Blockchain network...";
            break;
          case "onReceipt":
            txStatus =
              "Tx receipt received from Blockchain network. See console logs...";
            break;
          case "onError":
            txStatus =
              "Tx error received from Blockchain network. Tx reverted...";
            break;
          default:
            txStatus = "";
        }
        content = (
          <div>
            {/* <ClipLoader color={'#16BE9C'} loading={true}  size={70} /> */}
            <p id="loader" className="text-center">
              <ClipLoader color={"#000000"} loading={true} size={50} />
            </p>
            <br />
            <p className="tx">{txStatus}</p>
          </div>
        );
      } else {
        const events = this.state.lastReceivedEvent;
        content = (
          <div
            className="row"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="col-md-6">
              <Main
                ethBalance={this.state.ethBalance}
                tokenBalance={this.state.tokenBalance}
                buyTokens={this.buyTokens}
                sellTokens={this.sellTokens}
                price={this.state.price}
                priceStable={this.state.priceStable}
              />
            </div>
            {/* <div className="col-md-6" >
            <LoadWallet handleClick={this.handleClick} walletLoaded={this.state.walletLoaded} />  
            <br/>
            
            <ul>
            {Object.keys(events).map((event, index) => <li key={index}>{event} : {events[event]}</li>)}
            </ul>           
          </div> */}
          </div>
        );
      }
    } else {
      content = (
        <div style={{ alignItems: "center" }}>
          <div className="container">
            <h3>Welcome</h3>
            <ul>
              <li>
                <h5>Click the button below to connect Metamask wallet.</h5>
              </li>
              {/* <li><h5>Don't forget to select "RinkeyBy Test Network" in Metamask App.</h5></li>                       */}
            </ul>
            <LoadWallet
              handleClick={this.handleClick}
              walletLoaded={this.state.walletLoaded}
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "1000px" }}
            >
              <div className="content mr-auto ml-auto">
                <a
                  href="http://alejoacosta.ar"
                  tGCNet="_blank"
                  rel="noopener noreferrer"
                ></a>

                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
