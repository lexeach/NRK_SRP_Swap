import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
import { getPrice } from './price'

class BuyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0',
      price:'7.36'
    }
  }



  render() {
    return (
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let etherAmount ;
          etherAmount = this.input.value.toString()
           etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          this.props.buyTokens(etherAmount)
        }}>
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            {/* Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')} */}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={async (event) => {
              const etherAmount = this.input.value.toString()
              const price = await getPrice()
              this.setState({
                output: (etherAmount * price/100 ) ,
                price:(
                  1 * price/100
                )
              })
            }}
            ref={(input) => { this.input = input }}
            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="input-group-text">
              {/* <img src={ethLogo} height='32' alt=""/> */}
              &nbsp;&nbsp;&nbsp; NRK
            </div>
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            {/* Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')} */}
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
              {/* <img src={tokenLogo} height='32' alt=""/> */}
              &nbsp; SRP
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">1 NRK = { this.state.price }  SRP</span>
        </div>
        <button className="swapButton">SWAP!</button>
      </form>
    );
  }
}

export default BuyForm;
