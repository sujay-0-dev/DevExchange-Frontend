export function MediaGallery({ urls, types }: { urls: string[], types: string[] }) {
  if (!urls || urls.length === 0) return null;

  return (
    <div className={`mt-3 grid gap-2 ${urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {urls.map((url, i) => (
        <div key={i} className="relative rounded-md overflow-hidden bg-muted aspect-video">
          {types[i] === 'video' ? (
            <video src={url} controls className="w-full h-full object-cover" />
          ) : (
            <img src={url} alt="Post media" className="w-full h-full object-cover cursor-pointer" />
          )}
        </div>
      ))}
    </div>
  );
}
