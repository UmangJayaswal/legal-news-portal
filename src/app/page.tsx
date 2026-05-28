import { client } from "@/sanity/lib/client";
import Link from "next/link";

// 1. Write the GROQ query
// This says: "Get all documents where type is 'post', make sure they have a URL slug, order them by date, and fetch specific fields."
const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...10]{
  _id,
  title,
  slug,
  publishedAt,
  "authorName": author->name
}`;

export default async function Home() {
  // 2. Fetch the data from Sanity
  const posts = await client.fetch(POSTS_QUERY);

  // 3. Display the data
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">
        Legal News Portal
      </h1>
      
      <div className="w-full max-w-4xl grid gap-6">
        {posts.map((post: any) => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              {post.title}
            </h2>
            <div className="text-sm text-gray-500 mb-4 flex gap-4">
              {post.authorName && <span>By {post.authorName}</span>}
              {post.publishedAt && (
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              )}
            </div>
            
            <Link 
              href={`/post/${post.slug.current}`} 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Read full article &rarr;
            </Link>
          </div>
        ))}
        
        {posts.length === 0 && (
          <p className="text-gray-500 text-center py-10">No articles found. Go write one in the Studio!</p>
        )}
      </div>
    </main>
  );
}