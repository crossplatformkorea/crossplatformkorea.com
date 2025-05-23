import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import PostsPage from './Post/posts';
import PostDetailsPage from './Post/post-details';
import SummaryPage from './Summary';

export default function Main() {
  return (
    <div className="flex flex-col">
      <div className="bg-background overflow-y-scroll w-full px-4 sm:px-8 md:px-16 pt-6 sm:pt-10 pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto">
          <Routes>
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/post/:postId" element={<PostDetailsPage />} />
            <Route path="/*" element={<SummaryPage />} />
          </Routes>
        </div>
      </div>

      <Toaster theme="system" position="bottom-right" richColors closeButton />
    </div>
  );
}
