import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/blog');
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.25em] text-brand-rose">Journal</p>
        <h1 className="mt-3 font-serif text-4xl text-brand-black">IN BLOOM Journal</h1>
        <p className="mt-4 max-w-2xl text-sm text-brand-gray">Read floral inspiration, care tips, and boutique styling ideas from our team.</p>

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">{[...Array(3)].map((_, i) => <div key={i} className="h-72 animate-pulse rounded-3xl bg-rose-50" />)}</div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <article key={post._id} className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm hover:-translate-y-1 hover:shadow-xl transition">
                <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-brand-rose">{post.category}</p>
                  <h2 className="mt-2 font-serif text-xl text-brand-black">{post.title}</h2>
                  <p className="mt-3 text-sm text-brand-gray">{post.content?.replace(/<[^>]+>/g, ' ').slice(0, 120)}…</p>
                  <Link to={`/blog/${post.slug}`} className="mt-4 inline-block text-xs uppercase tracking-[0.25em] text-brand-black hover:text-brand-rose">Read More →</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
