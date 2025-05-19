import { Link } from "react-router-dom";
import { t } from "../../../../lib/i18n";

export default function Posts() {
  const posts = [
    { id: "1", title: t("posts.post1") },
    { id: "2", title: t("posts.post2") },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t("posts.title")}</h2>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              to={`/post/${post.id}`}
              className="text-primary hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
