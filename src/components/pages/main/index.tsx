import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import FeatureRequestsPage from '../feature-requests';
import PostsPage from './Post/posts';
import PostDetailsPage from './Post/post-details';
import ProfilePage from '../profile';
import SummaryPage from './Summary';
import UserProfilePage from './UserProfile';

export default function Main() {
  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <div className="min-h-screen bg-background overflow-y-scroll w-full pb-16 flex-1">
        <Routes>
          <Route path="/" element={<SummaryPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/post/:postId" element={<PostDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/feature-request" element={<FeatureRequestsPage />} />
        </Routes>
      </div>

      <Toaster theme="system" />
    </div>
  );
}
