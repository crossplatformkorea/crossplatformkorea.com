import React from "react";
import { useParams } from "react-router-dom";
import { t } from "../../../../lib/i18n";

export default function PostCard() {
  const { postId } = useParams<{ postId: string }>();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t("posts.title")}</h2>
      <p className="mb-2">
        {t("posts.id")} : {postId}
      </p>
      <p>{t("posts.content")}</p>
    </div>
  );
}
