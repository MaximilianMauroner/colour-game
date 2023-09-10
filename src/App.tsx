import { createSignal, type Component } from "solid-js";

type ColourBlock = {
    colour: string;
    isTarget: boolean;
};
const startAmount = 20;
const startDifficulty = 50;

const [amount, setAmount] = createSignal(startAmount);
const [difficulty, setDifficulty] = createSignal(startDifficulty);
const [count, setCount] = createSignal(1);
const [elements, setElements] = createSignal<ColourBlock[][]>(
    createColours(amount())
);
const App: Component = () => {
    return (
        <main class="h-full min-h-screen w-full bg-gray-100 dark:bg-gray-800 dark:text-white pt-4">
            <div class="m-auto p-4">
                <h1 class="text-4xl font-bold text-center">Colour Game</h1>
                <p class="text-center">Click the different colour</p>
                <p class="text-center font-mono text-sm">Counter:{count()}</p>
                <p class="text-center font-mono text-sm">
                    Difficulty:{difficulty()}, Amount:{amount()} x {amount()}
                </p>
            </div>
            <div class="flex justify-center items-center">
                <div class="relative">
                    <div class="absolute top-0 left-0 right-0 bottom-0 z-10 border-2 pointer-events-none border-gray-800 dark:border-gray-200" />
                    {elements().map((row, i) => (
                        <div class="flex">
                            {row.map((col, j) => (
                                <ColourBlock
                                    colour={col.colour}
                                    isTarget={col.isTarget}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

const ColourBlock = ({
    colour,
    isTarget,
}: {
    colour: string;
    isTarget: boolean;
}) => {
    const restart = () => {
        setCount(0);
        setDifficulty(startDifficulty);
        setAmount(startAmount);
    };
    const handleClick = (isTarget: boolean) => {
        if (!isTarget) {
            restart();
        }
        setElements([...createColours(amount())]);
        let completed = 0;
        if (count() % 2 === 0) {
            difficulty() < 100 ? setDifficulty(difficulty() + 5) : completed++;
        } else {
            amount() < 50 ? setAmount(amount() + 1) : completed++;
        }
        if (completed === 2) {
            restart();
        }
        setCount(count() + 1);
    };
    return (
        <button
            onClick={() => handleClick(isTarget)}
            style={{ background: colour }}
            class={`block w-10 h-10`}
        ></button>
    );
};

function rgbToHex(rgb: number) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

function fullColorHex(r: number, g: number, b: number, a: number) {
    const red = rgbToHex(r);
    const green = rgbToHex(g);
    const blue = rgbToHex(b);
    const alpha = rgbToHex(a);
    return { hex: "#" + red + green + blue + alpha, red, green, blue, alpha };
}

function getBiasedRandomAbovePercent(difficulty: number, bias = 1.5) {
    // Ensure that percent is between 0 and 100
    let percent = difficulty;
    const min = percent * bias;
    if (min > 100) {
        return getBiasedRandomAbovePercent(difficulty, bias - 0.1);
    }
    const max = 100;

    // You can adjust the bias factor as needed to control the bias
    const randomValue = Math.random(); // Apply bias
    const randomNumber = min - randomValue * (max - min);
    const alpha = Math.floor((randomNumber / 100) * 255);
    return alpha;
}

function createColours(num: number) {
    const data = [];
    const colour = fullColorHex(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        255
    );
    const rightColor = {
        colour: colour.hex,
        isTarget: false,
    };

    const offset = getBiasedRandomAbovePercent(difficulty());

    const guessColor = {
        colour:
            "#" + colour.red + colour.green + colour.blue + rgbToHex(offset),
        isTarget: true,
    };

    const guessIndex = Math.floor(Math.random() * num ** 2);
    let index = 0;
    for (let i = 0; i < num; i++) {
        const row = [];
        for (let j = 0; j < num; j++) {
            if (index === guessIndex) {
                row.push(guessColor);
            } else {
                row.push(rightColor);
            }
            index++;
        }
        data.push(row);
    }

    return data;
}
export default App;
