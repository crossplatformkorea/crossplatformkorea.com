import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../lib/utils';
import { t } from '../../../lib/i18n';
import useAuthGuard from '../../../hooks/useAuthGuard';
import { PlusCircle } from 'lucide-react';

export default function PostDetails() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthGuard({ requireAuth: false });

  // This is a placeholder - in a real app, you'd create a query to fetch a post by ID
  // For now, this is just to demonstrate how you might structure this component

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      void navigate('/sign-in');
      return;
    }

    // Navigate to post creation page
    void navigate('/posts/create');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <Link to="/posts" className="text-primary hover:underline inline-block">
          ← {t('posts.backToList')}
        </Link>

        <button
          onClick={handleCreatePost}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <PlusCircle size={18} />
          <span>{t('posts.createPost')}</span>
        </button>
      </div>

      <div className="border rounded-lg p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{t('posts.sampleTitle')}</h1>
          <div className="text-gray-500">{formatDate(new Date().toISOString())}</div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">React</span>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            TypeScript
          </span>
        </div>

        <div className="prose max-w-none">
          <p>{t('posts.content')}</p>
          <p>
            {t('posts.id')}: {postId}
          </p>
        </div>
      </div>
    </div>
  );
}
