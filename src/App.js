import React, { Component } from 'react';
import './App.css';

const STOCK_URL = 
  'https://yrg0sk9dd3.execute-api.us-east-1.amazonaws.com/dev/stocks';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: [],
      inputStockName: '',
      errors: undefined,
    };
  }

  componentDidMount() {
    fetch(STOCK_URL)
      .then(resp => resp.json())
      .then(resp => this.setState({ stocks: resp }));
  }

  bindInput = (el) => {
    this.input = el;
  }

  hasExisted(stockName) {
    return this.state.stocks.some(stock => stock.name === stockName);
  }

  handleAddStock = (ev) => {
    const name = this.state.inputStockName.trim();

    if (name === '') {
      this.setState({ errors: 'Stock name cannot be empty.'});
      this.input.focus();
      return;
    }

    if (this.hasExisted(name)) {
      this.setState({ errors: 'Stock has been added before.'});
      this.input.focus();
      return;
    }

    fetch(STOCK_URL, {
      method: 'POST',
      body: JSON.stringify({
        name,
      }),
    }).then(resp => {
      if (resp.status === 200) {
        this.setState({
          stocks: [
            ...this.state.stocks,
            { name }
          ],
          inputStockName: '',
        });
        this.input.focus();
        this.setState({ errors: '' });
      }
    }, (err) => {
      this.setState({ errors: err })
    });
  }

  handleInputChange = (ev) => {
    this.setState({
      inputStockName: ev.target.value,
    });
  }

  renderErrors() {
    return (
      <div className="alert alert-danger">
        {this.state.errors}
      </div>
    );
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
        { this.state.errors && this.renderErrors() }
        {this.renderInput()}
        {this.renderStocks()}
      </div>
    );
  }
}

export default App;
