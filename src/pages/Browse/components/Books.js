import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ReactComponent as Loading } from 'assets/svg/circles.svg'
import { ReactComponent as Add } from 'assets/svg/add-icon.svg'
import { useAlert } from 'react-alert'
import { useThrottle } from 'use-throttle'
import { customLayout, smartTruncate } from 'components/mixins'
import ScrollToTopOnMount from 'components/utils/ScrollToTopOnMount'

const Books = props => {
  const {
    books,
    searchTerm,
    bookOffset,
    fetchBooks,
    searchBooks,
    createCollection,
  } = props
  const alert = useAlert()
  const [isLoading, setIsLoading] = useState(false)
  const [didMount, setDidMount] = useState(false)
  const throttledSearch = useThrottle(searchTerm, 1000)
  //* Performs throttled search and prevents search on initial mount
  useEffect(() => {
    const asyncSearchBooks = async () => {
      //* Search resets offset=0
      const offset = 0
      await searchBooks(searchTerm, offset)
      setIsLoading(false)
    }
    if (didMount) {
      setIsLoading(true)
      asyncSearchBooks()
    }
    setDidMount(true)
  }, [throttledSearch])
  //* hasMore false only when searchQuery returns no matches
  const hasMore = !Boolean(searchTerm) || Boolean(books.length)

  const renderLoader = () => (
    <Loader>
      <Loading />
    </Loader>
  )

  const renderBooks = () => (
    <>
      <ScrollToTopOnMount />
      <InfiniteScroll
        dataLength={books.length}
        next={() => fetchBooks(searchTerm, bookOffset)}
        hasMore={hasMore}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {books.map((book, index) => {
          return (
            <Card key={index}>
              <a href={book.link} target='_blank' rel='noopener noreferrer'>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      height: '200px',
                      width: '100%',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundImage: `url(${book.thumbnail}`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: `blur(1.5rem)`,
                    }}
                  />
                  <img
                    style={{
                      position: 'absolute',
                      padding: '0px',
                      top: '10px',
                    }}
                    alt={book.title}
                    src={book.thumbnail}
                  />
                </div>
                <h3 style={{ marginTop: '20px' }}>
                  {smartTruncate(book.title, 75)}
                </h3>
                <p>{smartTruncate(book.description, 120)}</p>
              </a>
              <SaveIcon>
                <Add
                  className='save-icon'
                  onClick={() => {
                    createCollection({
                      type: 'book',
                      post_url: book.link,
                      title: book.title,
                      description: book.description,
                      thumbnail_url: book.thumbnail,
                    })
                    alert.success('Book added to Saved')
                  }}
                />
              </SaveIcon>
            </Card>
          )
        })}
      </InfiniteScroll>
    </>
  )
  return <Cards>{isLoading ? renderLoader() : renderBooks()}</Cards>
}

export default Books

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
  overflow-y: hidden;
  position: relative;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  width: 22%;
  height: 350px;
  margin-bottom: 30px;
  background-color: #fff;
  cursor: pointer;
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
    padding: 10px;
  }
  h3 {
    max-height: 50px;
    margin: 0px 0 10px;
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
  // border: 1px solid red;
  /* ${customLayout('flex-end')} */
  position: absolute;
  right: 15px;
  bottom: 10px;
  opacity: 0.8;
  transition: 200ms ease-out;
  &:hover {
    opacity: 1;
    transition: 200ms ease-in;
  }
`