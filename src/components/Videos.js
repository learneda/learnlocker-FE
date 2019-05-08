import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import youtube from '../apis/youtube';
import styled from 'styled-components';
import { customLayout, truncateText } from '../components/mixins';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ReactComponent as Loading } from '../assets/svg/circles.svg';
import { useDebouncedCallback } from 'use-debounce';

const Videos = ({ search }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [pageToken, setPageToken] = useState(null);

  const fetchMoreData = () => {
    youtube
      .get('/search', {
        params: {
          q: search || 'javascript',
          pageToken,
        },
      })
      .then(res => {
        setVideos(prevVideos => [...prevVideos, ...res.data.items]);
        setPageToken(res.data.nextPageToken);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    debouncedFunction(search);
  }, [search]);

  const [debouncedFunction] = useDebouncedCallback(query => {
    youtube
      .get('/search', {
        params: {
          q: query || 'javascript',
        },
      })
      .then(res => {
        setVideos(res.data.items);
        setPageToken(res.data.nextPageToken);
        setIsLoading(false);
      });
  }, 1500);

  const renderLoader = () => (
    <Loader>
      <Loading />
    </Loader>
  );

  const renderVideos = () => (
    <InfiniteScroll
      dataLength={videos.length}
      next={fetchMoreData}
      hasMore={true}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      {videos.map((video, index) => (
        <Card key={index}>
          <a
            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src={video.snippet.thumbnails.medium.url} alt='youtube' />
            <h3>{truncateText(video.snippet.title)}</h3>
            <p>{truncateText(video.snippet.description, 15)}</p>
          </a>
        </Card>
      ))}
    </InfiniteScroll>
  );

  return <Cards>{isLoading ? renderLoader() : renderVideos()}</Cards>;
};

const mapStateToProps = ({ searchTerm }) => ({
  search: searchTerm,
});

export default connect(
  mapStateToProps,
  null
)(Videos);

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
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  width: 22%;
  height: 350px;
  margin-bottom: 30px;
  background-color: #fff;
  cursor: pointer;
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
    object-fit: cover;
  }

  h3 {
    // border: 1px solid red;
    height: 50px;
    margin: 10px 0;
    padding: 0 3%;
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 25px;
    word-break: break-word;
    overflow: hidden;
  }

  p {
    padding: 0 3%;
    height: 45px;
    font-size: 1.2rem;
    line-height: 20px;
    color: #6d767e;
  }
`;