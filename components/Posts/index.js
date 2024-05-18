import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import WindowWidthContext from '../../context/WindowWidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const { isSmallerDevice } = useContext(WindowWidthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(isSmallerDevice ? 5 : 10);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start, limit },
      });

      const postsWithImages = await Promise.all(
        newPosts.map(async post => {
          const { data: photos } = await axios.get(
            `https://jsonplaceholder.typicode.com/albums/${post.id}/photos`,
          );
          return { ...post, images: photos };
        }),
      );

      setPosts(prevPosts => [...prevPosts, ...postsWithImages]);
      setStart(prevStart => prevStart + limit);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
    setIsLoading(false);
  };

  const handleClick = () => {
    fetchPost();
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LoadMoreButton onClick={handleClick} disabled={isLoading}>
          {!isLoading ? 'Load More' : 'Loading...'}
        </LoadMoreButton>
      </div>
    </Container>
  );
}
