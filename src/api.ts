const base = 'http://localhost:3000';

const garage = `${base}/garage`;
const engine = `${base}/engine`;
const winners = `${base}/winners`;

export const getCars = async (
	page: number,
	limit = 7
): Promise<{
	items: { id: number; color: string; name: string }[];
	count: string;
}> => {
	const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
	return {
		items: await response.json(),
		count: <string>response.headers.get('X-Total-Count'),
	};
};

export const getCar = async (id: number): Promise<{ id: number; color: string; name: string }> =>
	(await fetch(`${garage}/${id}`)).json();

export const createCar = async (body: { color: string; name: string }): Promise<JSON> =>
	(
		await fetch(garage, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	).json();

export const deleteCar = async (id: number): Promise<JSON> =>
	(await fetch(`${garage}/${id}`, { method: 'DELETE' })).json();

export const upCar = async (id: number, body: { color: string; name: string }): Promise<JSON> =>
	(
		await fetch(`${garage}/${id}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	).json();


