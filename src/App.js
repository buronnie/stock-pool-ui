import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: [],
      inputStockName: '',
    };
  }

  bindInput = (el) => {
    this.input = el;
  }

  handleAddStock = (ev) => {
    const name = this.state.inputStockName.trim();

    if (name === '') {
      return;
    }

    this.setState({
      stocks: [
        ...this.state.stocks,
        { name }
      ],
      inputStockName: '',
    });
    this.input.focus();
  }

  handleInputChange = (ev) => {
    this.setState({
      inputStockName: ev.target.value,
    });
  }

  renderInput() {
    return (
      <div className="form-group row">
        <label htmlFor="stockName" className="col-form-label">Add Stock</label>
        <div className="col-3">
          <input 
            id="stockName"
            type="text"
            className="form-control"
            value={this.state.inputStockName}
            onChange={this.handleInputChange}
            ref={this.bindInput}
          />  
        </div>
        <button 
          type="button"
          className="btn btn-link"
          onClick={this.handleAddStock}
        >Add</button>
      </div>
    );
  }

  renderStockRow(stock) {
    return (
      <div key={stock.name}>{stock.name}</div>
    );
  }

  renderStocks() {
    return this.state.stocks.map(stock => this.renderStockRow(stock));
  }

  render() {
    return (
      <div className="m-5">
        {this.renderInput()}
        {this.renderStocks()}
      </div>
    );
  }
}

export default App;
