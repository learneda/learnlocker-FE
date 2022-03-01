import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import socket from 'App/socket'
import styled from 'styled-components'
import HelpScreen from 'components/Screens/HelpScreen'
import OnlineFriendsSVG from 'assets/svg/online_friends.svg'
import InfiniteScroll from 'react-infinite-scroll-component'
import ScrollToTopOnMount from 'components/Utils/ScrollToTopOnMount'
import PostContainer from './Post/'
import FeedPlaceholder from './Post/FeedPlaceholder'
import { handlePostReactions } from 'App/store/appActions'
const Feed = props => {
  const {
    auth,
    user,
    tag,
    posts,
    offset,
    hasmore,
    fetchMoreFeed,
    fetchMoreTagFeed,
    handlePostReactions,
  } = props

  const handleSubmit = (event, post_id, comment, postOwnerId) => {
    const body = comment.trim()
    if (body) {
      const comment = {
        action: 'create',
        content: body,
        user_id: auth.id,
        post_id: post_id,
        username: user.username,
        postOwnerId,
      }
      socket.emit('comments', comment)
    }
  }

  const handleDeleteComment = (comment_id, post_id) => {
    socket.emit('comments', {
      action: 'destroy',
      comment_id: comment_id,
      post_id: post_id,
    })
  }

  const handleReactionClick = data => {
    handlePostReactions(data)
  }

  const next = () =>
    fetchMoreFeed ? fetchMoreFeed(offset) : fetchMoreTagFeed(tag, offset)

  return (
    <Container>
      <ScrollToTopOnMount />
      <InfiniteScroll
        className='infinite-scroll'
        dataLength={posts.length}
        next={next}
        hasMore={hasmore}
        loader={
          <Wrapper>
            <FeedPlaceholder />
          </Wrapper>
        }
        endMessage={
          <Wrapper>
            <HelpScreen
              headerText='We reached the end of your feed!'
              imgSource={OnlineFriendsSVG}
            />
          </Wrapper>
        }
      >
        {posts.map((post, index) => (
          <PostContainer
            key={index}
            handleSubmit={handleSubmit}
            handleReactionClick={handleReactionClick}
            post={post}
            currentUser={user}
            handleDeleteComment={handleDeleteComment}
          />
        ))}
      </InfiniteScroll>
    </Container>
  )
}

// export default Feed
const mapStateToProps = ({ auth, user }) => ({ auth, user })

export default connect(mapStateToProps, { handlePostReactions })(
  withRouter(Feed)
)

Feed.propTypes = {
  auth: PropTypes.any,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile_picture: PropTypes.string.isRequired,
  }).isRequired,
  //? WTF this is sometimes a number ... sometimes a string
  tag: PropTypes.any,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  offset: PropTypes.number.isRequired,
  hasmore: PropTypes.bool.isRequired,
  fetchMoreFeed: PropTypes.func,
  fetchMoreTagFeed: PropTypes.func,
  handlePostReactions: PropTypes.func,
}
// Controls Feed dimensions
const Container = styled.div`
  max-width: 580px;
  width: 100%;
  overflow: hidden;
`
// Controls loader and endMessage dimension
const Wrapper = styled.div`
  max-width: 580px;
  width: 100%;
  overflow: hidden;
`
