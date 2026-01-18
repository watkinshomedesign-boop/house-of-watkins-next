export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="skeleton skeleton--animate h-10 w-32 rounded-full" />
          <div className="flex items-center gap-3">
            <div className="skeleton skeleton--animate h-10 w-10 rounded-full" />
            <div className="skeleton skeleton--animate h-10 w-10 rounded-full" />
            <div className="skeleton skeleton--animate h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="skeleton skeleton--animate h-9 w-3/4 rounded-lg" />
            <div className="mt-3 skeleton skeleton--animate h-5 w-2/3 rounded-lg" />
            <div className="mt-2 skeleton skeleton--animate h-5 w-1/2 rounded-lg" />

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="skeleton skeleton--animate h-12 w-44 rounded-full" />
              <div className="skeleton skeleton--animate h-12 w-36 rounded-full" />
            </div>
          </div>

          <div className="skeleton skeleton--animate aspect-[3/2] w-full rounded-3xl" />
        </div>

        <div className="mt-12">
          <div className="skeleton skeleton--animate h-7 w-56 rounded-lg" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
                <div className="skeleton skeleton--animate aspect-[3/2] w-full" />
                <div className="p-5">
                  <div className="skeleton skeleton--animate h-5 w-3/4 rounded-lg" />
                  <div className="mt-3 skeleton skeleton--animate h-4 w-1/2 rounded-lg" />
                  <div className="mt-5 flex gap-2">
                    <div className="skeleton skeleton--animate h-8 w-20 rounded-full" />
                    <div className="skeleton skeleton--animate h-8 w-24 rounded-full" />
                    <div className="skeleton skeleton--animate h-8 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
