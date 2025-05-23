import { Routes, Route } from 'react-router-dom';
import CommunityPage from './community';
import SignInPage from './sign-in';
import { AppLayout } from './layout';
import ProfilePage from './profile';
import UserProfilePage from './user';
import FeatureRequestsPage from './feature-requests';

// This component only handles routing
export default function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/user/:userId" element={<UserProfilePage />} />
        <Route path="/feature-request" element={<FeatureRequestsPage />} />
        <Route path="/*" element={<CommunityPage />} />
      </Routes>
    </AppLayout>
  );
}
