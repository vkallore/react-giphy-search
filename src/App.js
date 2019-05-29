import React from 'react'
import './App.scss'

import GiphyLoader from 'components/GiphyLoader'

class App extends React.Component {
  constructor() {
    super()

    this.showGiphy = this.showGiphy.bind(this)
    this.state = {
      showGiphy: false
    }
  }

  showGiphy() {
    const { showGiphy } = this.state
    this.setState({ showGiphy: !showGiphy })
  }

  render() {
    const { showGiphy } = this.state
    const classGiphyActive = showGiphy ? 'active' : ''
    return (
      <div className="App">
        <header className="App-header">React Programming Challenge</header>
        <div className="container">
          <div className="card">
            <textarea placeholder="Write something here..." />
            <a className={`btn ${classGiphyActive}`} onClick={this.showGiphy}>
              <span className="label label-gif">GIF</span>GIF
            </a>
            {/* <div className="giphy-preview">
          </div> */}
          </div>
          {showGiphy && <GiphyLoader />}
        </div>
      </div>
    )
  }
}

export default App
