import { Routes, Route } from 'react-router-dom';
import Community from './community';
import SignIn from './sign-in';
import { AppLayout } from './layout';
import ProfilePage from './profile';

// This component only handles routing
export default function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/*" element={<Community />} />
      </Routes>
    </AppLayout>
  );
}
