import React from 'react'
import './App.scss'

import GiphyLoader from 'components/GiphyLoader'

class App extends React.Component {
  constructor() {
    super()

    this.showGiphy = this.showGiphy.bind(this)
    this.setSelectedGiphy = this.setSelectedGiphy.bind(this)
    this.state = {
      showGiphy: false,
      selectedGiphy: ''
    }
  }

  showGiphy() {
    const { showGiphy } = this.state
    this.setState({ showGiphy: !showGiphy })
  }

  setSelectedGiphy(giphyUrl) {
    this.setState({ selectedGiphy: giphyUrl })
  }

  render() {
    const { showGiphy, selectedGiphy } = this.state
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
            {selectedGiphy !== '' && (
              <div className="giphy-preview">
                <img
                  src={selectedGiphy}
                  alt="Selected Giphy"
                  className="giphy-selected"
                />
              </div>
            )}
          </div>
          {showGiphy && (
            <GiphyLoader imageClickHandler={this.setSelectedGiphy} />
          )}
        </div>
      </div>
    )
  }
}

export default App
