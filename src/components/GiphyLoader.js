import React from 'react'

import Loader from 'components/Loader'
import GiphyImg from 'components/GiphyImg'

class GiphyLoader extends React.Component {
  constructor() {
    super()
    this.searchGiphy = this.searchGiphy.bind(this)
    this.fetchAndSetData = this.fetchAndSetData.bind(this)

    this.state = {
      isLoading: false,
      searchOffset: 0,
      searchParam: '',
      prevSearchParam: '',
      giphyResults: [],
      currentPage: 1,
      limitCount: 5,
      searchPlaced: false
    }
  }

  searchGiphy(event) {
    const searchKeywords = event.target.value

    this.setState({
      searchParam: searchKeywords
    })
    // Avoid hitting API if no search keywords removed
    if (searchKeywords === '') {
      this.setState({
        giphyResults: []
      })
      return
    }

    // Debounce to avoid hitting the API while typing
    debounce(() => {
      this.fetchAndSetData(searchKeywords)
    }, 1000)()
  }

  // Fetch and set data for both fresh & repeat searches
  fetchAndSetData(searchKeywords) {
    searchKeywords =
      typeof searchKeywords === 'undefined'
        ? this.state.searchKeywords
        : searchKeywords

    let { searchOffset, giphyResults } = this.state
    const { limitCount, prevSearchParam } = this.state
    console.log(searchKeywords === prevSearchParam)
    // Avoid hitting API if search keywords remain same before debounce
    if (searchKeywords === prevSearchParam) {
      return
    } else {
      // If keywords changed, reset values
      giphyResults = []
      searchOffset = 0
    }

    // Set as loading
    this.setState({ isLoading: true })

    // Construct the query params
    const giphyUrlParam = {
      api_key: process.env.REACT_APP_GIPHY_API_KEY,
      q: searchKeywords,
      limit: limitCount,
      offset: searchOffset
    }
    let searchQuery = ''
    for (const key in giphyUrlParam) {
      if (searchQuery !== '') {
        searchQuery += '&'
      }
      searchQuery += key + '=' + encodeURIComponent(giphyUrlParam[key])
    }

    // Hit the API
    fetch(`https://api.giphy.com/v1/gifs/search?${searchQuery}`)
      .then(res => {
        if (res.status !== 200) return []
        return res.json()
      })
      .then(json => {
        // Update searchOffset to next if total count is greater than
        console.log({ ...giphyResults, ...json.data })
        this.setState({
          isLoading: false,
          searchPlaced: true,
          giphyResults: [...giphyResults, ...json.data],
          prevSearchParam: searchKeywords,
          searchOffset
        })
      })
      .catch(err => {
        console.error(`Error occurred`)
        console.log(err)
        this.setState({
          isLoading: false,
          searchPlaced: true,
          prevSearchParam: searchKeywords,
          searchOffset
        })
      })
  }

  render() {
    const { isLoading, searchPlaced, giphyResults, searchParam } = this.state
    console.log(typeof giphyResults)
    const htmlGiphyResults = giphyResults.map(giphyResult => {
      const giphyId = giphyResult.id
      return (
        <GiphyImg key={giphyId} data={giphyResult} searchParam={searchParam} />
      )
    })
    return (
      <>
        <div className="card">
          <input
            type="text"
            className="input-w-200"
            placeholder="Enter your search keyword"
            onChange={this.searchGiphy}
            value={searchParam}
          />

          <div className="giphy-container">
            {htmlGiphyResults}
            {searchPlaced && giphyResults.length === 0 && (
              <h4>No GIF Found!</h4>
            )}
            {isLoading && <Loader />}
            <div id="scrollFinder" />
          </div>
        </div>
      </>
    )
  }
}

let timeout
const debounce = (func, wait) => {
  return function() {
    const context = this,
      args = arguments
    const later = function() {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default GiphyLoader
