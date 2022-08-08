import { createCar, deleteCar, deleteWinner, getCar, WinnerStatus, returnWinner, upCar } from './api';
import str from './str';
import { renderGarage, renderWinners, startDriving, stopDriving, updateGarage, updateWinners, race } from './render';
import { createRandomCars } from './random';

let select: number;
export const listen = (): void => {
    document.body.addEventListener('click', async (event) => {
        const target = event.target as Element;
        if (target.id === 'to-garage') {
            str.view = 'garage';
            (<HTMLElement>document.getElementById('winners')).style.display = 'none';
        }

        if (target.id === 'to-win') {
            str.view = 'winners';
            (<HTMLElement>document.getElementById('winners')).style.display = 'block';

            await updateWinners();
            (<HTMLElement>document.getElementById('winners')).innerHTML = renderWinners();
        }

        if (target.classList.contains('remove')) {
            const del = +target.id.split('-')[2];
            await deleteCar(del);
            if ((await WinnerStatus(del)) !== 404) {
                await deleteWinner(del);
            }
            await updateGarage();
            await updateWinners();
            (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
        }
        if (target.classList.contains('select')) {
            select = +target.id.split('-')[2];
            const selected: { name: string; color: string } = await getCar(+target.id.split('-')[2]);
            (<HTMLInputElement>document.getElementById('upname')).value = selected.name;
            (<HTMLInputElement>document.getElementById('upcolor')).value = selected.color;
            (<HTMLInputElement>document.getElementById('upname')).removeAttribute('disabled');
            (<HTMLInputElement>document.getElementById('upcolor')).removeAttribute('disabled');
            (<HTMLInputElement>document.getElementById('upd')).removeAttribute('disabled');
        }

        if (target.id === 'upd') {
            const name = (<HTMLInputElement>document.getElementById('upname')).value;
            const color = (<HTMLInputElement>document.getElementById('upcolor')).value;
            await upCar(select, { name, color });
            await updateGarage();
            (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
            (<HTMLInputElement>document.getElementById('upname')).value = '';
            (<HTMLInputElement>document.getElementById('upcolor')).value = '#ffffff';
            (<HTMLInputElement>document.getElementById('upname')).disabled = true;
            (<HTMLInputElement>document.getElementById('upcolor')).disabled = true;
            (<HTMLInputElement>document.getElementById('upd')).disabled = true;
        }

        if (target.classList.contains('race')) {
            const targ = event.target as HTMLInputElement;
            targ.disabled = true;
            const winner = await race(startDriving);
            await returnWinner(winner);
            const message = <HTMLElement>document.getElementById('mes');
            message.textContent = `${winner.name} Finished FIRST!!! with (${winner.time}sec)`;
            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);

            await updateWinners();
            const winnersTable = document.querySelector('table');
            if (winnersTable !== null) {
                winnersTable.remove();
                renderWinners();
            }
        }
        if (target.classList.contains('reset')) {
            str.cars.map(({ id }: { id: number }) => stopDriving(id));
            (<HTMLInputElement>document.getElementById('race')).disabled = false;
        }
        if (target.id === 'next') {
            str.carsPage++;
            await updateGarage();
            (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
        }
        if (target.classList.contains('prev')) {
            str.carsPage--;
            await updateGarage();
            (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
        }
        if (target.classList.contains('start')) {
            const id = +target.id.split('-')[2];
            console.log(id);
            startDriving(id);
        }
        if (target.classList.contains('stop')) {
            const id = +target.id.split('-')[2];
            stopDriving(id);
        }
        if (target.classList.contains('generator')) {
            const targ = event.target as HTMLInputElement;
            targ.disabled = true;
            const cars = createRandomCars();
            await Promise.all(cars.map(async (car) => createCar(car)));
            await updateGarage();
            (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
            targ.disabled = false;
        }

        if (target.classList.contains('button')) {
            const name = (<HTMLInputElement>document.getElementById('createname')).value;
            const color = (<HTMLInputElement>document.getElementById('createcolor')).value;
            await createCar({ name, color });
            await updateGarage();
            (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
            (<HTMLInputElement>document.getElementById('createname')).value = '';
            (<HTMLInputElement>document.getElementById('createcolor')).value = '#ffffff';
        }
    });
};
