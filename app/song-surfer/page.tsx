export default function SongSurferLayout() {
  return (
    <main className="relative w-screen h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-96 max-h-160 h-full flex flex-col items-stretch gap-8 bg-[#36373b] rounded-md">
        <div className="flex items-center gap-2">
          <img
            className="bg-"
            src="/path/to/logo.png"
            alt="Logo"
            width={32}
            height={32}
          />
        </div>
        <h1 className="text-2xl font-bold text-center">Song Surfer</h1>
        <p className="text-center">
          A simple web app that allows you to search for songs and view their
          lyrics.
        </p>
        <div className="flex flex-col items-center justify-center w-full gap-4"></div>
      </div>
    </main>
  );
}
