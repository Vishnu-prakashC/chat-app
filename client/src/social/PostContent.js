import React, { useState } from 'react';
import Carousel from '../components/Carousel';
import './PostContent.css';

const PostContent = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const content = post.content || '';
  const shouldTruncate = content.length > 200;

  return (
    <div className="aura-post-content">
      {content && (
        <div className="aura-post-text">
          <p>
            {shouldTruncate && !expanded 
              ? `${content.slice(0, 200)}...` 
              : content
            }
          </p>
          {shouldTruncate && (
            <button 
              className="aura-post-expand"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {post.images && post.images.length > 0 && (
        <div className="aura-post-media">
          <Carousel images={post.images} id={post._id} />
        </div>
      )}
    </div>
  );
};

export default PostContent;

