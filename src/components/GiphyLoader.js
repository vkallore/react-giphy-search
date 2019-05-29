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
      searchPlaced: false,
      noMoreResults: false
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
      const { prevSearchParam } = this.state
      // Avoid hitting API if search keywords remain same before debounce
      if (searchKeywords === prevSearchParam) {
        return
      } else {
        // If keywords changed, reset values
        this.setState({
          prevSearchParam: searchKeywords,
          giphyResults: [],
          searchOffset: 0
        })
        const { imageClickHandler } = this.props
        imageClickHandler('')
      }

      this.fetchAndSetData(searchKeywords)
    }, 1000)()
  }

  // Fetch and set data for both fresh & repeat searches
  fetchAndSetData(searchKeywords) {
    searchKeywords =
      typeof searchKeywords === 'undefined'
        ? this.state.searchKeywords || ''
        : searchKeywords

    let { searchOffset, giphyResults } = this.state
    const { limitCount } = this.state

    // Set as loading
    this.setState({ isLoading: true, searchPlaced: true })

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

    const endPoint = searchKeywords !== '' ? 'search' : 'trending'

    // Hit the API
    fetch(`https://api.giphy.com/v1/gifs/${endPoint}?${searchQuery}`)
      .then(res => {
        if (res.status !== 200) return []
        return res.json()
      })
      .then(json => {
        // Update searchOffset to next if total count is greater than
        searchOffset = searchOffset + 1 * limitCount
        const totalGiphys = json.pagination.total_count

        this.setState({
          isLoading: false,
          giphyResults: [...giphyResults, ...json.data],
          searchOffset,
          noMoreResults: searchOffset >= totalGiphys
        })
      })
      .catch(err => {
        console.error(`Error occurred`)
        console.log(err)
        this.setState({
          isLoading: false,
          searchOffset
        })
      })
  }

  componentDidMount() {
    this.fetchAndSetData()
  }

  render() {
    const {
      isLoading,
      searchPlaced,
      giphyResults,
      searchParam,
      noMoreResults
    } = this.state

    // PROPS DRILLING!
    const { imageClickHandler } = this.props

    const htmlGiphyResults = giphyResults.map(giphyResult => {
      const giphyId = giphyResult.id
      return (
        <GiphyImg
          key={giphyId}
          data={giphyResult}
          searchParam={searchParam}
          onClick={imageClickHandler}
        />
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

          {searchPlaced && (
            <div className="giphy-container">
              {searchParam === '' && (
                <span className="trending">Trending!</span>
              )}
              {htmlGiphyResults}
              {!isLoading && giphyResults.length === 0 && (
                <h4>No GIF Found!</h4>
              )}
              {isLoading && <Loader />}
              {!isLoading && !noMoreResults && (
                <a className="btn btn-show-more" onClick={this.fetchAndSetData}>
                  Show More >>
                </a>
              )}
            </div>
          )}
        </div>
      </>
    )
  }
}

let timeout

/**
 * Handle debounce
 * @param {*} func
 * @param {*} wait
 */
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
