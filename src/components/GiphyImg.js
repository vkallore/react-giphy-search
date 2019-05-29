import React from 'react'

const GiphyImg = props => {
  const smallImage = props.data.images.downsized_still.url
  const { searchParam } = props
  return (
    <div className="giphy-thumb">
      <img src={smallImage} alt={searchParam} title={searchParam} />
    </div>
  )
}

export default GiphyImg
