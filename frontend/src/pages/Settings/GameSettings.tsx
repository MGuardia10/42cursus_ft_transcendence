import { FormEvent, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useLanguage } from "@/hooks/useLanguage";
import { useNotification } from "@/hooks/useNotification";
import { useGameSettings } from "@/hooks/useGameSettings";
import Spinner from "@/layout/Spinner/Spinner";

const GameSettings: React.FC = () => {
  // useNotification hook
  const { addNotification } = useNotification();

  // useGameSettings hook
  const {
    defaultValue,
    setDefaultValue,
    score,
    setScore,
    serveDelay,
    setServeDelay,
    bgColor,
    setBgColor,
    barColor,
    setBarColor,
    ballColor,
    setBallColor,
    updateSettings,
    loading,
    error,
  } = useGameSettings();

  // useLanguage hook
  const { t } = useLanguage();

  // Canvas reference
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw the field background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw the side bars (goals)
    ctx.fillStyle = barColor;
    ctx.fillRect(10, height / 2 - 35, 8, 70); // Left bar
    ctx.fillRect(width - 18, height / 2 - 35, 8, 70); // Rigth bar

    // Draw the central dashed line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = barColor;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]); // Resetear el estilo de línea

    // Draw the ball
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw the field border
    ctx.strokeStyle = barColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);
  }, [bgColor, barColor, ballColor, defaultValue]);

  const handleDefaultChange = async () => {
    // Set custom to true or false
    setDefaultValue((prev) => !prev);

    // Call API to update custom setting
    const result = await updateSettings(true);

    if (result.success == false)
      addNotification(`${t("notifications_game_settings_error")}`, "error");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Prevent default form submission
    e.preventDefault();

    // Call API to update custom setting
    const result = await updateSettings(false);

    // Check if the result is successful
    if (result.success) {
      addNotification(`${t("notifications_game_settings_success")}`, "success");
    } else {
      addNotification(`${t("notifications_game_settings_error")}`, "error");
    }
  };

  if (loading) return <Spinner />;

  if (error) return <p className="text-red-400">Error al obtener los datos</p>;

  return (
    <div className="w-full rounded-md mx-auto p-6 md:p-10 bg-background-secondary">
      <h1 className="text-xl md:text-3xl font-bold mb-6">
        {t("game_settings_h1")}
      </h1>

      {/* Change default setting to custom settings */}
      <div className="flex flex-row gap-2 md:gap-3">
        <p className="text-sm md:text-base">{t("game_settings_custom")}</p>
        <button
          type="button"
          onClick={handleDefaultChange}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none hover:cursor-pointer ${
            defaultValue ? "bg-gray-300" : "bg-text-secondary"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform ${
              defaultValue ? "translate-x-1" : "translate-x-6"
            }`}
          ></span>
        </button>
      </div>

      {/* Show custom settings */}
      <form
        onSubmit={handleSubmit}
        className={`${
          defaultValue ? "hidden" : "flex flex-col gap-2 md:gap-2.5 mt-4"
        }`}
      >
        {/* Points to win game */}
        <label htmlFor="score" className="block text-sm font-medium">
          {t("game_settings_points")}
        </label>
        <div className="relative">
          <select
            id="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full text-sm md:text-base p-1.5 md:p-2 border rounded-xs appearance-none outline-text-tertiary hover:cursor-pointer"
          >
            <option value="3">3 {t("game_settings_points_opt")}</option>
            <option value="5">5 {t("game_settings_points_opt")}</option>
            <option value="10">10 {t("game_settings_points_opt")}</option>
            <option value="15">15 {t("game_settings_points_opt")}</option>
            <option value="20">20 {t("game_settings_points_opt")}</option>
          </select>
          <FaChevronDown className="pointer-events-none hover:cursor-pointer absolute inset-y-0 right-3 my-auto text-xs" />
        </div>

        {/* Seconds to wait when a goal is scored */}
        <label htmlFor="serveDelay" className="block text-sm font-medium mt-4">
          {t("game_settings_serve_delay")}
        </label>
        <div className="relative">
          <select
            id="serveDelay"
            value={serveDelay}
            onChange={(e) => setServeDelay(e.target.value)}
            className="w-full text-sm md:text-base p-1.5 md:p-2 border rounded-xs appearance-none outline-text-tertiary hover:cursor-pointer"
          >
            <option value="0">{t("game_settings_no_delay")}</option>
            <option value="1">1 {t("game_settings_seconds")}</option>
            <option value="2">2 {t("game_settings_seconds")}s</option>
            <option value="3">3 {t("game_settings_seconds")}s</option>
          </select>
          <FaChevronDown className="pointer-events-none hover:cursor-pointer absolute inset-y-0 right-3 my-auto text-xs" />
        </div>

        {/* Color selector */}
        <div className="flex flex-col items-center gap-4 py-8 md:py-10">
          <canvas
            ref={canvasRef}
            width={500}
            height={300}
            className="w-[250px] h-[150px] md:w-[300px] md:h-[200px] lg:w-[500px] lg:h-[300px]"
          />
          <div className="flex gap-2  md:gap-4 lg:gap-10">
            <label className="flex items-center gap-1 md:gap-2 text-sm hover:cursor-pointer">
              {t("game_settings_bg")}
              <input
                type="color"
                value={bgColor}
                className="hover:cursor-pointer"
                onChange={(e) => setBgColor(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-1 md:gap-2 text-sm hover:cursor-pointer">
              {t("game_settings_bar")}
              <input
                type="color"
                value={barColor}
                className="hover:cursor-pointer"
                onChange={(e) => setBarColor(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-1 md:gap-2 text-sm hover:cursor-pointer">
              {t("game_settings_ball")}
              <input
                type="color"
                value={ballColor}
                className="hover:cursor-pointer"
                onChange={(e) => setBallColor(e.target.value)}
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-text-secondary text-sm md:text-base text-white px-3 py-2 rounded-xs hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300"
        >
          {t("game_settings_submit")}
        </button>
      </form>
    </div>
  );
};

export default GameSettings;
