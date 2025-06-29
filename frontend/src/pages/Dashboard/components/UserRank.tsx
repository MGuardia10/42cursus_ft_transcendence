import { useUserRanking } from "@/hooks/useUserRanking";
import Spinner from "@/layout/Spinner/Spinner";
import { DashboardProps } from "@/types/dashboardProps";

const UserRank: React.FC<DashboardProps> = ({ id, alias }) => {
  // Custom hook to fetch user ranking data
  const { data, loading } = useUserRanking(id);

  // If loading, show a spinner
  if (loading) {
    return (
      <div className="min-h-44 md:min-h-90 flex items-center justify-center w-full p-6 md:p-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-6 h-full p-6 md:p-10">
      {/* Image and Name of User */}
      <div className="flex flex-col items-center">
        <img
          src={
            import.meta.env.VITE_USER_API_BASEURL_EXTERNAL +
            "/" +
            id +
            "/avatar"
          }
          onError={(e) => {
            e.currentTarget.src = "/placeholder.webp";
          }}
          crossOrigin="use-credentials"
          alt="avatar"
          className="md:block w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-text-tertiary object-cover"
        />
        <h2 className="text-center md:text-xl font-bold mt-2 md:mt-3">
          {alias || "No data"}
        </h2>
      </div>

      {/* Ranking of user */}
      <p className="md:text-xl">
        Rank{" "}
        <span className="font-bold text-text-tertiary">
          {data?.position || "-"}
        </span>
      </p>
    </div>
  );
};

export default UserRank;
