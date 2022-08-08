const carArr = [
    'Cadillac',
    'Lamborghini',
    'Kia',
    'Lada',
    'Bentley',
    'Bugatti',
    'Ford',
    'Mclaren',
    'Ferrari',
    'Jaguar',
    'Dodge',
    'Audi',
];

const models = ['Model JQ', 'Mustang', 'Jee', 'Tone', 'Camry', 'Graf', 'Drukalo', 'Corsa', 'Horse', 'Nkeu'];

const carCount = 100;
const newName = () => {
    const name = carArr[Math.floor(Math.random() * carArr.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    return `${name} ${model}`;
};

const colorLength = 6;
const newColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < colorLength; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const createRandomCars = () => new Array(carCount).fill(1).map(() => ({ name: newName(), color: newColor() }));
