import ImageGrid from "./components/ImageGrid";

async function getInitialImages() {
  const res = await fetch(
    "https://picsum.photos/v2/list?page=1&limit=10",
    { next: { revalidate: 3600 } } // Revalidate every hour
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch images');
  }
 
  return res.json();
}

export default async function Home() {
  const initialImages = await getInitialImages();

  return (
    <section className="min-h-screen py-8">
      <ImageGrid initialImages={initialImages} />
    </section>
  );
}
