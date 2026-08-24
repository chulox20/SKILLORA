import React from 'react';

export function VideoPlayer({ url, title }) {
  // Convert standard YouTube URLs (watch?v= or youtu.be/) to embed URLs
  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return null;

    if (videoUrl.includes('youtube.com/watch?v=')) {
      const id = videoUrl.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`;
    }
    if (videoUrl.includes('youtu.be/')) {
      const id = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`;
    }
    if (videoUrl.includes('vimeo.com/')) {
      const id = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }

    return videoUrl;
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className="aspect-video bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center p-8 text-center text-slate-400">
        <p>No se especificó una URL de video para esta lección.</p>
      </div>
    );
  }

  // Check if it's an iframe-compatible video service
  const isEmbed = embedUrl.includes('youtube') || embedUrl.includes('vimeo');

  return (
    <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {isEmbed ? (
        <iframe
          src={embedUrl}
          title={title || 'Video de la lección'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      ) : (
        <video
          src={embedUrl}
          controls
          className="w-full h-full object-contain"
        >
          Tu navegador no soporta reproducción de video HTML5.
        </video>
      )}
    </div>
  );
}
