import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
import { getPrice } from './price'

class SellForm extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      output: '0',
      price:'0.1355'
    }
  }

   handleInputChange = async (event) => {
    let inputAmount = event.target.value;
    // Remove any non-numeric characters
    inputAmount = inputAmount.replace(/[^0-9.]/g, '');

    // Split the value by the decimal point and limit to two decimal places
    const parts = inputAmount.split('.');
    if (parts.length > 1) {
      inputAmount = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    this.input.value = inputAmount; // Update the input element's value
    const tokenAmount = parseFloat(inputAmount);
    if (!isNaN(tokenAmount)) {
      const price = await getPrice();
      this.setState({
        output: (tokenAmount * 100 / price).toFixed(2), // Fix output to two decimal places
      });
    }
  };

  render() {
    return (
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let etherAmount
          etherAmount = this.input.value.toString()
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          this.props.sellTokens(etherAmount)
        }}>
        <div>
          <label className="float-left"><b>Input   </b></label>
          <span className="float-right text-muted">
            {/* Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')} */}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={this.handleInputChange}
            ref={(input) => { this.input = input }}
            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="input-group-text">
              {/* <img src={tokenLogo} height='32' alt=""/> */}
              &nbsp; RP
            </div>
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            {/* Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')} */}
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output }
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              {/* <img src={ethLogo} height='32' alt=""/> */}
              &nbsp;&nbsp;&nbsp; NRK
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">1 RP = {  this.state.price}  NRK </span>
        </div>
        <button className="swapButton">SWAP!</button>
      </form>
    );
  }
}

export default SellForm;
