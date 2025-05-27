import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, className = '' }: YouTubeEmbedProps) {
  return (
    <div className={`relative w-full aspect-video ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
      />
    </div>
  );
}
