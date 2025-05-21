import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import FeatureRequests from '../feature-requests';
import Posts from './posts';
import PostDetails from './post-details';
import ProfilePage from '../profile';

export default function Main() {
  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/post/:postId" element={<PostDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feature-request" element={<FeatureRequests />} />
      </Routes>

      <Toaster theme="system" />
    </div>
  );
}
