import { Models } from "appwrite";

import GridPostList from "@/components/share/GridPostList";
import Loader from "@/components/share/Loader";
import { useGetCurrentUser } from "@/lib/react-query/querisAndMotation";
import GridPostListSearch from "@/components/share/GridPostListSearch";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },
    }))
    .reverse();

    console.log(currentUser?.save)

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostListSearch posts={savePosts} showState={false} showUser={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;