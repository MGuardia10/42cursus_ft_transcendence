import { Link } from 'react-router';

const NotFoundPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-screen">
			<h1 className='text-xl font-bold mb-5'>404 - Page Not Found</h1>
			<p>Sorry, the page you are looking for does not exist.</p>
			<Link to="/" className="mt-5 text-text-secondary hover:text-text-tertiary hover:underline transition duration-200">
				Go back to Home
			</Link>
		</div>
	);
};

export default NotFoundPage;