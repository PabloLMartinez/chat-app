import React, { Component } from 'react';

import Chat from './components/Chat'

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentUsername: ['Laura', 'Rob']
    }
  }

  render() {
    return (
      <div className="App row">
        <Chat currentUsername={this.state.currentUsername[0]} />
        <Chat currentUsername={this.state.currentUsername[1]} />
      </div>
    );
  }
}

export default App;
