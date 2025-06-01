import api from '../api/axiosConfig';

export const sendResetPasswordEmail = async (email: string) => {
	try {
		const response = await api.post('/api/auth/send_reset_password_email', {
			email,
		});

		if (response.status === 200 || response.data.success) {
			return {
				success: true,
				message: 'Reset password email sent successfully.',
			};
		} else {
			return {
				success: false,
				message:
					response.data.message || 'Failed to send reset password email.',
			};
		}
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('Error sending reset password email:', error);
		}

		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'An error occurred while sending the reset email.',
		};
	}
};
