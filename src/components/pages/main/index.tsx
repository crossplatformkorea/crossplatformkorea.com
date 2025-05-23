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
      <div className="bg-background overflow-y-scroll w-full px-16 pt-10 pb-24">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<SummaryPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/post/:postId" element={<PostDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user/:userId" element={<UserProfilePage />} />
            <Route path="/feature-request" element={<FeatureRequestsPage />} />
          </Routes>
        </div>
      </div>

      <Toaster theme="system" />
    </div>
  );
}
