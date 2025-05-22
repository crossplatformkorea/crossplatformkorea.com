import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import FeatureRequestsPage from '../feature-requests';
import PostsPage from './Post/posts';
import PostDetailsPage from './Post/post-details';
import ProfilePage from '../profile';
import SummaryPage from './Summary';

export default function Main() {
  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <div className="min-h-screen bg-background overflow-y-scroll container pb-16">
        <Routes>
          <Route path="/" element={<SummaryPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/post/:postId" element={<PostDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/feature-request" element={<FeatureRequestsPage />} />
        </Routes>
      </div>

      <Toaster theme="system" />
    </div>
  );
}
