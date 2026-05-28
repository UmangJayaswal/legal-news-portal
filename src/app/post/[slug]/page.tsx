import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";

// Fetch a single post based on its unique slug
const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title,
  publishedAt,
  body,
  "authorName": author->name
}`;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) {
    return <div className="p-24 text-center">Article not found.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 md:p-24">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-200">
        <Link href="/" className="text-blue-600 hover:underline text-sm font-medium block mb-6">
          &larr; Back to Portal Home
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900 mb-4 font-serif leading-tight">
          {post.title}
        </h1>
        
        <div className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">
          {post.authorName && <span className="font-medium text-gray-700">By {post.authorName}</span>}
          {post.publishedAt && (
            <span className="mx-2">&bull;</span>
          )}
          {post.publishedAt && (
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          )}
        </div>

        {/* This component safely renders the rich text/paragraphs from Sanity */}
        <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed space-y-4">
          <PortableText value={post.body} />
        </div>
      </div>
    </main>
  );
}