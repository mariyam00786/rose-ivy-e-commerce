import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/blog/${slug}`);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading article…</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Article not found.</div>;

  return (
    <section className="min-h-screen bg-white px-6 py-24">
      <article className="mx-auto max-w-4xl rounded-3xl border border-rose-100 bg-white shadow-xl overflow-hidden">
        <img src={post.image} alt={post.title} className="h-72 w-full object-cover" />
        <div className="p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-rose">{post.category}</p>
          <h1 className="mt-3 font-serif text-4xl text-brand-black">{post.title}</h1>
          <p className="mt-3 text-sm text-brand-gray">By {post.author} • {new Date(post.publishedAt).toLocaleDateString()}</p>
          <div className="prose prose-sm max-w-none mt-6 text-brand-gray" dangerouslySetInnerHTML={{ __html: post.content }} />
          <Link to="/blog" className="mt-8 inline-block text-xs uppercase tracking-[0.25em] text-brand-black hover:text-brand-rose">← Back to journal</Link>
        </div>
      </article>
    </section>
  );
}
