export const encodeQueryParam = (value: string) => {
	return encodeURIComponent(value).replace(/%20/g, '+');
};
