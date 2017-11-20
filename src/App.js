import React, { Component } from 'react';
import './App.css';

const STOCK_POOL_URL = 
  'https://jopfne5hyb.execute-api.us-east-1.amazonaws.com/dev/stocks';

const STOCK_DATA_URL =
  'https://rrw2yi3hgj.execute-api.us-east-1.amazonaws.com/dev/stocks';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: [],
      inputStockName: '',
      inputStockSymbol: '',
      errors: undefined,
      stockDetailVisibility: {},
      stockDetails: {},
    };
  }

  componentDidMount() {
    fetch(STOCK_POOL_URL)
      .then(resp => resp.json())
      .then(stocks => {
        const stockDetailVisibility = {};
        stocks.forEach(stock => {
          stockDetailVisibility[stock.symbol] = false;
        });

        this.setState({
          stocks,
          stockDetailVisibility,
        })
      });
  }

  bindInputName = (el) => {
    this.inputName = el;
  }

  bindInputSymbol = (el) => {
    this.inputSymbol = el;
  }

  hasExisted(stockName, stockSymbol) {
    return this.state.stocks.some(stock =>
      stock.name === stockName || stock.symbol === stockSymbol);
  }

  handleAddStock = (ev) => {
    const name = this.state.inputStockName.trim();
    const symbol = this.state.inputStockSymbol.trim();

    if (name === '') {
      this.setState({ errors: 'Stock name cannot be empty.'});
      this.inputName.focus();
      return;
    }

    if (symbol === '') {
      this.setState({ errors: 'Stock symbol cannot be empty.'});
      this.inputSymbol.focus();
      return;
    }

    if (this.hasExisted(name, symbol)) {
      this.setState({ errors: 'Stock has been added before.'});
      this.inputName.focus();
      return;
    }

    fetch(STOCK_POOL_URL, {
      method: 'POST',
      body: JSON.stringify({
        name,
        symbol,
      }),
    }).then(resp => {``
      if (resp.status === 200) {
        this.setState({
          stocks: [
            ...this.state.stocks,
            { name, symbol }
          ],
          inputStockName: '',
          inputStockSymbol: '',
          stockDetailVisibility: {
            ...this.state.stockDetailVisibility,
            [symbol]: false,
          },
        });
        this.inputName.focus();
        this.setState({ errors: '' });
      }
    }, (err) => {
      this.setState({ errors: err })
    });
  }

  handleInputNameChange = (ev) => {
    this.setState({
      inputStockName: ev.target.value,
    });
  }

  handleInputSymbolChange = (ev) => {
    this.setState({
      inputStockSymbol: ev.target.value,
    });
  }

  showStockDetail(symbol) {
    if (!this.state.stockDetails[symbol]) {
      fetch(`${STOCK_DATA_URL}/${symbol}`)
        .then(resp => resp.json())
        .then(resp => this.setState({
          stockDetailVisibility: {
            ...this.state.stockDetailVisibility,
            [symbol]: true,
          },
          stockDetails: {
            ...this.state.stockDetails,
            [symbol]: resp,
          }
        }));
    } else {
      this.setState({
        stockDetailVisibility: {
          ...this.state.stockDetailVisibility,
          [symbol]: true,
        },
      });
    }
  }

  hideStockDetail(symbol) {
    this.setState({
      stockDetailVisibility: {
        ...this.state.stockDetailVisibility,
        [symbol]: false,
      },
    });
  }

  toggleStockDetail = (symbol) => {
    if (this.state.stockDetailVisibility[symbol]) {
      this.hideStockDetail(symbol);
      return;
    }
    this.showStockDetail(symbol);
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
        <label htmlFor="stockName" className="col-form-label">Stock Name</label>
        <div className="col-3">
          <input 
            id="stockName"
            type="text"
            className="form-control"
            value={this.state.inputStockName}
            onChange={this.handleInputNameChange}
            ref={this.bindInputName}
          />  
        </div>
        <label htmlFor="stockSymbol" className="col-form-label">Stock Symbol</label>
        <div className="col-3">
          <input 
            id="stockSymbol"
            type="text"
            className="form-control"
            value={this.state.inputStockSymbol}
            onChange={this.handleInputSymbolChange}
            ref={this.bindInputSymbol}
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
      <div className="form-group" key={stock.symbol}>
        <button
          type="button"
          className="d-block btn btn-link"
          onClick={() => {
            return this.toggleStockDetail(stock.symbol);
          }}
        >
          {`${stock.name}  (${stock.symbol})`}
        </button>
        {
          this.state.stockDetailVisibility[stock.symbol] && 
          <div>
            {JSON.stringify(this.state.stockDetails[stock.symbol])}
          </div>
        }
      </div>
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
