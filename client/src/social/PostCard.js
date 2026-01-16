import React from 'react';
import { Link } from 'react-router-dom';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import './PostCard.css';

const PostCard = ({ post, index = 0 }) => {
  return (
    <article 
      className="aura-post-card"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <PostHeader post={post} />
      <PostContent post={post} />
      <PostActions post={post} />
    </article>
  );
};

export default PostCard;

