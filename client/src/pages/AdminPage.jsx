import { useState } from 'react';
import api from '../api/axiosConfig';

export default function AdminPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!files.length) {
      setMessage('Select one or more image files first.');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      const { data } = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadedUrls(data.urls || []);
      setMessage(`Uploaded ${data.files?.length || 0} image(s) successfully.`);
      setFiles([]);
      event.target.reset();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 text-brand-black">
      <h1 className="text-3xl font-semibold tracking-wide">Admin dashboard</h1>
      <p className="mt-2 text-gray-600">Upload flower and product images directly from this page.</p>

      <section className="mt-8 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Upload product images</h2>
        <p className="mt-1 text-sm text-gray-500">Accepted formats: JPG, PNG, WEBP. Max 5 images at once, 5 MB each.</p>

        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="block w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm"
          />

          <button
            type="submit"
            disabled={uploading}
            className="rounded-full bg-brand-black px-6 py-3 text-sm uppercase tracking-[0.2em] text-white hover:bg-brand-rose disabled:cursor-not-allowed disabled:opacity-70"
          >
            {uploading ? 'Uploading…' : 'Upload Images'}
          </button>
        </form>

        {message && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-brand-black">{message}</p>}

        {uploadedUrls.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm uppercase tracking-[0.2em] text-brand-black">Uploaded image URLs</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {uploadedUrls.map((url) => (
                <article key={url} className="overflow-hidden rounded-3xl border border-rose-100 bg-rose-50/40">
                  <img src={url} alt="Uploaded flower preview" className="h-40 w-full object-cover" />
                  <p className="break-all px-4 py-3 text-xs text-brand-black">{url}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
