import React from 'react';
import CardBody from "./home/post_card/CardBody";
import CardFooter from "./home/post_card/CardFooter";
import CardHeader from "./home/post_card/CardHeader";
import "../styles/nexus-post-card.css";

const PostCard = ({ post, theme }) => {
  return (
    <article className="nexus-post-card">
      <CardHeader post={post} />
      <CardBody post={post} theme={theme} />
      <CardFooter post={post} />
    </article>
  );
};

export default PostCard;