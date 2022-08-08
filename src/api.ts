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

export const createCar = async (data: { color: string; name: string }): Promise<JSON> =>
    (
        await fetch(garage, {
            method: 'POST',
            body: JSON.stringify(data),
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

export const startEngine = async (
    id: number
): Promise<{
    velocity: number;
    distance: number;
}> =>
    (
        await fetch(`${engine}?id=${id}&status=started`, {
            method: 'PATCH',
        })
    ).json();

export const stopEngine = async (
    id: number
): Promise<{
    velocity: number;
    distance: number;
}> =>
    (
        await fetch(`${engine}?id=${id}&status=stopped`, {
            method: 'PATCH',
        })
    ).json();

export const drive: (id: number) => Promise<{ success: boolean }> = async (id: number) => {
    const result = await fetch(`${engine}?id=${id}&status=drive`, {
        method: 'PATCH',
    }).catch();
    return result.status !== 200 ? { success: false } : { ...(await result.json()) };
};

export const getWinners = async (
    page: number,
    limit = 10
): Promise<{
    items: { wins: number; time: number; id: number; color: string; name: string }[];
    count: string;
}> => {
    const response = await fetch(`${winners}?_page=${page}&_limit=${limit}`);
    const items = await response.json();
    return {
        items: await Promise.all(
            items.map(async (winner: { wins: number; time: number; id: number; color: string; name: string }) => ({
                ...winner,
                car: await getCar(winner.id),
            }))
        ),
        count: <string>response.headers.get('X-Total-Count'),
    };
};

export const getWinner = async (
    id: number
): Promise<{
    wins: number;
    time: number;
    id: number;
    color: string;
    name: string;
}> => (await fetch(`${winners}/${id}`)).json();

export const WinnerStatus = async (id: number): Promise<number> => (await fetch(`${winners}/${id}`)).status;

export const deleteWinner = async (id: number): Promise<JSON> =>
    (await fetch(`${winners}/${id}`, { method: 'DELETE' })).json();

export const createWinner = async (data: {
    wins: number;
    time: number;
    id: number;
    color: string;
    name: string;
}): Promise<JSON> =>
    (
        await fetch(winners, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

export const updateWinner = async (
    id: number,
    body: {
        wins: number;
        time: number;
        id: number;
        color: string;
        name: string;
    }
): Promise<JSON> =>
    (
        await fetch(`${winners}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();

export const returnWinner = async ({
    id,
    time,
    name,
    color,
}: {
    id?: number;
    time?: number;
    name?: string;
    color?: string;
}): Promise<void> => {
    if (id && time && name && color) {
        const winnerStatus: number = await WinnerStatus(+id);
        if (winnerStatus === 404) {
            await createWinner({
                name,
                id,
                color,
                wins: 1,
                time,
            });
        } else {
            const winner: { wins: number; time: number } = await getWinner(id);

            await updateWinner(id, {
                name,
                id,
                color,
                wins: winner.wins + 1,
                time: time < winner.time ? time : winner.time,
            });
        }
    }
};
