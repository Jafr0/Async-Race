import { createCar, deleteCar, getCar, upCar } from './api';
import str from './str';
import {
	renderGarage,
	updateGarage
} from './render';



let selected: number;
export const listen = (): void => {
	document.body.addEventListener('click', async (event) => {
		const target = event.target as Element;
		if (target.id === 'winners-menu') {
			str.view = 'winners';
			(<HTMLElement>document.getElementById('winners-view')).style.display = 'block';
			(<HTMLElement>document.getElementById('garage-view')).style.display = 'none';
			/* await updateWinners();
(<HTMLElement>document.getElementById('winners-view')).innerHTML = renderWinners(); */
		}
		if (target.id === 'garage-menu') {
			str.view = 'garage';
			(<HTMLElement>document.getElementById('winners-view')).style.display = 'none';
			(<HTMLElement>document.getElementById('garage-view')).style.display = 'block';
		}
		if (target.classList.contains('remove')) {
			const del = +target.id.split('-')[2];
			await deleteCar(del);
			/*  if ((await getWinnerStatus(+idd)) !== 404) {
			  await deleteWinner(+idd);
		 } */
			await updateGarage();
			/* await updateWinners(); */
			(<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
		}
		if (target.classList.contains('select')) {
			selected = +target.id.split('-')[2];
			const selected: { name: string; color: string } = await getCar(+target.id.split('-')[2]);
			(<HTMLInputElement>document.getElementById('upname')).value = selected.name;
			(<HTMLInputElement>document.getElementById('upcolor')).value = selected.color;
			(<HTMLInputElement>document.getElementById('upname')).removeAttribute("disabled");
			(<HTMLInputElement>document.getElementById('upcolor')).removeAttribute("disabled");
			(<HTMLInputElement>document.getElementById('upd')).removeAttribute("disabled");
		}

		if (target.id === 'upd') {
			const name = (<HTMLInputElement>document.getElementById('upname')).value;
			const color = (<HTMLInputElement>document.getElementById('upcolor')).value;
			await upCar(selected, { name, color });
			await updateGarage();
			(<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
			(<HTMLInputElement>document.getElementById('upname')).value = '';
			(<HTMLInputElement>document.getElementById('upcolor')).value = '#000000';
			(<HTMLInputElement>document.getElementById('upname')).disabled = true;
			(<HTMLInputElement>document.getElementById('upcolor')).disabled = true;
			(<HTMLInputElement>document.getElementById('upd')).disabled = true;
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
