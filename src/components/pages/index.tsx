import { Routes, Route } from 'react-router-dom';
import Main from './main';
import SignIn from './sign-in';
import { AppLayout } from './layout';

// This component only handles routing
export default function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/*" element={<Main />} />
      </Routes>
    </AppLayout>
  );
}
