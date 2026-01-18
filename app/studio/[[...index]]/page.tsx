export default async function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">Studio</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Missing Sanity env vars. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.
        </p>
      </div>
    );
  }

  const { default: StudioApp } = await import("../StudioApp");
  return <StudioApp />;
}
