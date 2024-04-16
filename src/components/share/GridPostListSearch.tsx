import { useuserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import React from "react";
import { Link } from "react-router-dom";
import PostState from "./PostState";

const GridPostListSearch = ({
  posts,
  showUser = true,
  showState = true,
}: {
  posts: Models.Document;
  showUser: boolean;
  showState: boolean;
}) => {
  console.log(posts);
  const { user } = useuserContext();
  return (
    <ul className="flex flex-wrap gap-9 ">
      {posts.map(
        (post: {
          $id: React.Key | null | undefined;
          caption:
            | string
            | number
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | null
            | undefined;
          imageUrl: string | undefined;
          creator: {
            imageUrl: string | undefined;
            name:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
          };
        }) => (
          <li key={post?.$id} className="relative min-w-80 h-80  ">
            <p className="mb-3">{post?.caption}</p>
            <Link to={`/posts/${post?.$id}`}>
              <img
                src={post?.imageUrl}
                alt="post"
                className="h-full w-full object-contain rounded-[25px]"
              />
            </Link>
            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={post?.creator?.imageUrl}
                    alt="creator"
                    className="h-8 w-8 rounded-full"
                  />
                  <p className="line-clamp-1">{post?.creator?.name}</p>
                </div>
              )}
              {/* {showState && <PostState post={post} userId={user.id} />} */}
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default GridPostListSearch;
