import { createSignal, type Component } from "solid-js";

type ColourBlock = {
    colour: string;
    isTarget: boolean;
};

const [amount, setAmount] = createSignal(20);
const [difficulty, setDifficulty] = createSignal(50);
const [count, setCount] = createSignal(1);
const [elements, setElements] = createSignal<ColourBlock[][]>(
    createColours(amount())
);
const App: Component = () => {
    return (
        <main class="h-full min-h-screen w-full bg-gray-200 dark:bg-gray-800 dark:text-white ">
            <div class="m-auto">
                <h1 class="text-4xl font-bold text-center">Colour Game</h1>
                <p class="text-center">Click the different colour</p>
                <p class="text-center font-mono text-sm">Counter:{count()}</p>
                <p class="text-center font-mono text-sm">
                    Difficulty:{difficulty()}
                </p>
            </div>
            <div class="flex justify-center items-center content-evenly">
                {elements().map((row, i) => (
                    <div>
                        {row.map((col, j) => (
                            <ColourBlock
                                colour={col.colour}
                                isTarget={col.isTarget}
                            />
                        ))}
                    </div>
                ))}
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
    const handleClick = (isTarget: boolean) => {
        if (!isTarget) {
            return;
        }
        setElements([...createColours(amount())]);
        setCount(count() + 1);
        if (difficulty() < 95) {
            setDifficulty(difficulty() + 5);
        } else {
            amount() < 50 ? setAmount(amount() + 1) : setAmount(50);
        }
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

function getRandomAbovePercent(percent: number) {
    if (Math.floor(Math.random() * 100) >= percent) {
        return Math.floor(255 * (percent / 100));
    }
    return getRandomAbovePercent(percent);
}

function createColours(num: number) {
    const data = [];
    const colour = fullColorHex(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        255
    );
    const offset = getRandomAbovePercent(difficulty());

    const guessIndex = Math.floor(Math.random() * num ** 2);
    let index = 0;
    for (let i = 0; i < num; i++) {
        const row = [];
        for (let j = 0; j < num; j++) {
            if (index === guessIndex) {
                row.push({
                    colour:
                        "#" +
                        colour.red +
                        colour.green +
                        colour.blue +
                        rgbToHex(offset),
                    isTarget: true,
                });
            } else {
                row.push({ colour: colour.hex, isTarget: false });
            }
            index++;
        }
        data.push(row);
    }

    return data;
}
export default App;
