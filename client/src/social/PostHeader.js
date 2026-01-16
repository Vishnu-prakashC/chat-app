import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserAvatar from '../profile/UserAvatar';
import PostMenu from './PostMenu';
import './PostHeader.css';

const PostHeader = ({ post }) => {
  const { auth } = useSelector((state) => state);
  const isOwnPost = auth.user?._id === post.user?._id;

  return (
    <header className="aura-post-header">
      <Link 
        to={`/profile/${post.user?._id}`}
        className="aura-post-author"
      >
        <UserAvatar 
          src={post.user?.avatar} 
          size="medium"
          username={post.user?.username}
        />
        <div className="aura-post-author-info">
          <div className="aura-post-author-name">
            {post.user?.fullname || post.user?.username}
          </div>
          <div className="aura-post-author-meta">
            <span className="aura-post-time">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </Link>
      
      <PostMenu post={post} isOwnPost={isOwnPost} />
    </header>
  );
};

export default PostHeader;

