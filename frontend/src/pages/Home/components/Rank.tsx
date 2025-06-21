import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useUserRanking } from "@/hooks/useUserRanking";

const Rank: React.FC = () => {
  // useLanguage hook
  const { t } = useLanguage();

  // Get userID
  const { user } = useAuth();

  // useRanking hook can be added here if needed in the future
  const { data } = useUserRanking(user?.id || "0");

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-6 h-full p-6 md:p-10">
      {/* % Wins */}
      {/* <p className='text-xl inline-block'><span className='text-6xl text-text-tertiary'>75</span>% Wins</p> */}
      <p className="text-xl inline-block items-center">
        <span
          className={`text-6xl ${
            !data?.win_percentage || data?.win_percentage == 0
              ? "text-text-secondary"
              : data?.win_percentage >= 50
              ? "text-text-tertiary"
              : "text-red-500"
          }`}
        >
          {data?.win_percentage || "0"}
        </span>
        % {t("dashboard_wins")}
      </p>

      {/* Rank */}
      <p>
        Rank{" "}
        <span className="font-bold text-text-tertiary">
          {data?.position || "-"}
        </span>
      </p>
    </div>
  );
};

export default Rank;
