import React from 'react';
import logo from './logo.svg';
import './App.css';
import D3Graph from '../D3Graph/D3Graph';


class App extends Component {
  constructor(props) {
      super(props)
      this.state = {
          graphData: {},
          graphConfig: {},
          isLoading: false,
      };
  }

  onChangeData = data => { this.setState({ graphData: data }) };
  onLoading = isLoading => { this.setState({ isLoading }) };

  render() {
      return (
        Test D3 Graph
        <D3Graph data={this.state.graphData} config={this.state.graphConfig} loading={this.state.isLoading} />
      );
  }

}

export default App;