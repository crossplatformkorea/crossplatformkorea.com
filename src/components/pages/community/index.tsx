import { Routes, Route } from 'react-router-dom';
import PostsPage from './Post/posts';
import PostDetailsPage from './Post/post-details';
import SummaryPage from './Summary';

export default function Main() {
  return (
    <Routes>
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/post/:postId" element={<PostDetailsPage />} />
      <Route path="/*" element={<SummaryPage />} />
    </Routes>
  );
}
