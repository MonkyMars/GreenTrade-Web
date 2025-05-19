interface FormSuccessMessageProps {
	successMessage: string;
}

const FormSuccessMessage = ({ successMessage }: FormSuccessMessageProps) => {
	if (!successMessage) return null;

	return (
		<div className='mb-8 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded relative'>
			<span className='block sm:inline'>{successMessage}</span>
		</div>
	);
};

export default FormSuccessMessage;
