import GridPostList from "@/components/share/GridPostList";
import GridPostListSearch from "@/components/share/GridPostListSearch";
import Loader from "@/components/share/Loader";
import { useGetCurrentUser } from "@/lib/react-query/querisAndMotation";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostListSearch posts={currentUser.liked} showState={false} showUser />
    </>
  );
};

export default LikedPosts;