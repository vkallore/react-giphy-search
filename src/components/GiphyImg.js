import React from 'react'

const GiphyImg = props => {
  const images = props.data.images
  const smallImage = images.downsized_still.url
  const giphyUrl = images.downsized_large.url
  const { searchParam, onClick } = props

  return (
    <div className="giphy-thumb" onClick={() => onClick(giphyUrl)}>
      <img src={smallImage} alt={searchParam} title={searchParam} />
    </div>
  )
}

export default GiphyImg
