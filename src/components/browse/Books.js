import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import styled from 'styled-components';
import { customLayout, truncateText } from '../mixins';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ReactComponent as Loading } from '../../assets/svg/circles.svg';
import { useDebouncedCallback } from 'use-debounce';
import { ReactComponent as Add } from '../../assets/svg/add-icon.svg';
import { post as URL } from '../../services/baseURL';
axios.defaults.withCredentials = true;

const Books = ({ search, handleSaveMedia, alert }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    debouncedFunction(search);
  }, [search]);

  const [debouncedFunction] = useDebouncedCallback(query => {
    axios
      .get(`${URL}/api/books/search`, {
        params: {
          q: query || 'javascript',
        },
      })
      .then(res => {
        setBooks(res.data);
        setOffset(0);
        setIsLoading(false);
      })
      .catch(err => console.log(err));
  }, 1000);

  const fetchMoreData = () => {
    const limit = 12;
    axios
      .get(`${URL}/api/books/search`, {
        params: {
          q: search || 'javascript',
          offset,
        },
      })
      .then(res => {
        setBooks(prevBooks => [...prevBooks, ...res.data]);
        setOffset(offset + limit);
      });
  };

  const renderLoader = () => (
    <Loader>
      <Loading />
    </Loader>
  );

  const renderBooks = () => (
    <InfiniteScroll
      dataLength={books.length}
      next={fetchMoreData}
      hasMore={true}
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
                  overflow: 'hidden',
                  paddingTop: '56.25%',
                  position: 'relative',
                }}
              >
                <img
                  style={{
                    border: '0px',
                    height: '100%',
                    left: '0px',
                    position: 'absolute',
                    top: '0px',
                    width: '100%',
                  }}
                  width='560'
                  height='315'
                  alt={book.title}
                  src={book.thumbnail}
                />
              </div>
              <h3 style={{ marginTop: '20px' }}>{truncateText(book.title)}</h3>
              <p>{book.description}</p>
            </a>
            <SaveIcon>
              <Add
                className='save-icon'
                onClick={() => {
                  handleSaveMedia({
                    type: 'book',
                    post_url: book.link,
                    title: book.title,
                    description: book.description,
                    thumbnail_url: book.thumbnail,
                  });
                  alert.success('Book added to Bookmarks');
                }}
              />
            </SaveIcon>
          </Card>
        );
      })}
    </InfiniteScroll>
  );

  return <Cards>{isLoading ? renderLoader() : renderBooks()}</Cards>;
};

const mapStateToProps = ({ searchTerm }) => ({
  search: searchTerm,
});

export default connect(
  mapStateToProps,
  null
)(Books);

const Loader = styled.div`
  margin: 75px auto;
  text-align: center;
`;

const Cards = styled.div`
  border-top: 1px solid #bdbdbd;
  ${customLayout('space-between')}
  flex-wrap: wrap;
  width: 100%;
  margin: 0 6px;
  margin-top: -12px;
  padding: 40px 0;
  @media (max-width: 768px) {
    margin: -12px auto 0;
  }
`;

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
    font-size: 1.5rem;
    line-height: 20px;
    color: #6d767e;
    height: 60px;
    overflow-y: hidden;
  }
`;

const SaveIcon = styled.div`
  // border: 1px solid red;
  ${customLayout('flex-end')}
  position: absolute;
  right: 15px;
  bottom: 15px;
  opacity: 0.8;
  transition: 200ms ease-out;
  &:hover {
    opacity: 1;
    transition: 200ms ease-in;
  }
`;