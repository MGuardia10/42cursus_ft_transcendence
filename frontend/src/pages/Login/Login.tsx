import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {

	// useAuth hook to get the login function
	const { login } = useAuth();

	return (
		<div className="flex flex-col justify-center items-center bg-background-secondary p-8 md:p-16 rounded-xs text-center z-10">

			{/* Title */}
			<h1 className="md:text-3xl font-login mb-2 md:mb-3">FT_TRASCENDENCE</h1>

			{/* Small paragraph */}
			<p className="text-xs md:text-sm text-text-secondary mb-8 md:mb-10">Best pong experience</p>
			
			{/* Google Button */}
			<button
				onClick={() => login()}
				className="flex items-center justify-center gap-2 md:gap-4 bg-white text-gray-900 px-3 py-2 md:px-6 md:py-3 rounded-xs shadow-md hover:cursor-pointer hover:bg-gray-300 transition duration-300"
			>
				<FcGoogle className="text-2xl" />
				<span className="text-xs md:text-sm font-bold" >Sign In with Google</span>
			</button>
		</div>
  );
};

export default Login;
