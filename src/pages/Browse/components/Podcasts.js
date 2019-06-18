import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ReactComponent as Loading } from 'assets/svg/circles.svg'
import { ReactComponent as Add } from 'assets/svg/add-icon.svg'
import { useAlert } from 'react-alert'
import { useThrottle } from 'use-throttle'
import { customLayout, smartTruncate } from 'components/mixins'
import ScrollToTopOnMount from 'components/utils/ScrollToTopOnMount'

import he from 'he'

const Podcasts = props => {
  const {
    podcasts,
    searchTerm,
    podcastOffset,
    fetchPodcasts,
    searchPodcasts,
    createCollection,
  } = props
  const alert = useAlert()
  const [isLoading, setIsLoading] = useState(false)
  const [isImage, setIsImage] = useState(Array(podcasts.length))
  const [didMount, setDidMount] = useState(false)
  const throttledSearch = useThrottle(searchTerm, 1000)

  useEffect(() => {
    const asyncSearchPodcasts = async () => {
      //* Search resets offset=0
      const offset = 0
      searchPodcasts(searchTerm, offset)
      setIsLoading(false)
    }
    if (didMount) {
      setIsLoading(true)
      asyncSearchPodcasts()
    }
    setDidMount(true)
  }, [throttledSearch])

  useEffect(() => {
    setIsImage(Array(podcasts.length).fill(false))
  }, [podcasts])

  const handleClick = index => {
    setIsImage(prevIsImage =>
      prevIsImage.map((isImage, idx) => (idx === index ? !isImage : isImage))
    )
  }

  const hasMore = !Boolean(searchTerm) || Boolean(podcasts.length)

  const renderLoader = () => (
    <Loader>
      <Loading />
    </Loader>
  )

  const renderPodcasts = () => (
    <>
      <ScrollToTopOnMount />
      <InfiniteScroll
        dataLength={podcasts.length}
        next={() => fetchPodcasts(searchTerm, podcastOffset)}
        hasMore={hasMore}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {podcasts.map((podcast, index) => (
          <Card key={podcast.id}>
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '190px',
                    position: 'relative',
                    backgroundImage: `url(${podcast.image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: `blur(1.5rem)`,
                  }}
                />
                {!isImage[index] ? (
                  <img
                    onClick={() => handleClick(index)}
                    style={{
                      display: 'inline-block',
                      width: '150px',
                      height: '150px',
                      alignSelf: 'center',
                      justifySelf: 'center',
                      position: 'absolute',
                      top: '20px',
                      cursor: 'pointer',
                    }}
                    src={podcast.image}
                    alt='youtube'
                  />
                ) : (
                  <>
                    <audio
                      style={{
                        display: 'inline-block',
                        width: '80%',
                        height: '50px',
                        alignSelf: 'center',
                        justifySelf: 'center',
                        position: 'absolute',
                        top: '30%',
                      }}
                      src={podcast.audio}
                      controls
                    >
                      Your browser does not support the <code>audio</code>{' '}
                      element.
                    </audio>
                    <button
                      onClick={() => handleClick(index)}
                      style={{
                        display: 'inline-block',
                        width: '50px',
                        height: '20px',
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      close
                    </button>
                  </>
                )}
              </div>
              <a href={podcast.audio} target='_blank' rel='noopener noreferrer'>
                <h3>{smartTruncate(podcast.title_original, 75)}</h3>
              </a>
              <p>
                {smartTruncate(he.decode(podcast.description_original), 120)}
              </p>
            </div>
            <SaveIcon>
              <Add
                className='save-icon'
                onClick={() => {
                  createCollection({
                    type: 'podcast',
                    post_url: podcast.audio,
                    title: podcast.title_original,
                    description: he.decode(podcast.description_original),
                    thumbnail_url: podcast.image,
                  })
                  alert.success('Article added to Saved')
                }}
              />
            </SaveIcon>
          </Card>
        ))}
      </InfiniteScroll>
    </>
  )
  return <Cards>{isLoading ? renderLoader() : renderPodcasts()}</Cards>
}

export default Podcasts

const Loader = styled.div`
  margin: 75px auto;
  text-align: center;
`
const Cards = styled.div`
  ${customLayout('space-between')}
  flex-wrap: wrap;
  width: 100%;
  margin-top: -12px;
  @media (max-width: 768px) {
    margin: -12px auto 0;
  }
`
const Card = styled.div`
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  width: 22%;
  height: 350px;
  margin-bottom: 30px;
  background-color: #fff;
  position: relative;
  @media (max-width: 1500px) {
    width: 30%;
  }
  @media (max-width: 960px) {
    width: 45%;
  }
  @media (max-width: 570px) {
    width: 100%;
  }
  a {
    &:hover {
      h3 {
        text-decoration: underline;
      }
    }
  }
  img {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    width: 100%;
    height: 180px;
    object-fit: contain;
  }
  h3 {
    // border: 1px solid red;
    max-height: 50px;
    margin: 10px 0;
    padding: 0 3%;
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 25px;
    word-break: break-word;
    overflow: hidden;
  }
  p {
    padding: 0 4%;
    height: 60px;
    font-size: 1.5rem;
    line-height: 20px;
    color: #6d767e;
    overflow: hidden;
  }
`
const SaveIcon = styled.div`
  position: absolute;
  bottom: 10px;
  right: 15px;
  opacity: 0.8;
  transition: 200ms ease-out;
  &:hover {
    opacity: 1;
    transition: 200ms ease-in;
  }
`