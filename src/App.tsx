import { createSignal, type Component, createEffect } from "solid-js";

type ColourBlock = {
    colour: string;
    isTarget: boolean;
};
const startAmount = 20;
const startLevel = 50;

const [amount, setAmount] = createSignal(
    localStorage.getItem("last-amount") != null
        ? parseInt(localStorage.getItem("last-amount") as string)
        : startAmount
);
const [level, setLevel] = createSignal(
    localStorage.getItem("last-level") != null
        ? parseInt(localStorage.getItem("last-level") as string)
        : startLevel
);
const [count, setCount] = createSignal(1);
const [elements, setElements] = createSignal<ColourBlock[][]>(
    localStorage.getItem("last-state") != null
        ? (JSON.parse(
              localStorage.getItem("last-state") as string
          ) as ColourBlock[][])
        : createColours(amount())
);
const [guessAlpha, setGuessAlpha] = createSignal(0);
const [rightAlpha, setRightAlpha] = createSignal(0);

const hextToAlpha = (hex: string) => {
    const alpha = hex.substring(7, 9);
    return parseInt(alpha, 16);
};

const App: Component = () => {
    createEffect(() => {
        localStorage.setItem("last-state", JSON.stringify(elements()));
        localStorage.setItem("last-amount", amount().toString());
        localStorage.setItem("last-level", level().toString());
    });
    return (
        <main class="h-full min-h-screen w-full bg-gray-100 dark:bg-gray-800 dark:text-white pt-4">
            <div class="m-auto p-4">
                <h1 class="text-4xl font-bold text-center">Colour Game</h1>
                <p class="text-center">Click the different colour</p>
                <p class="text-center font-mono text-sm">Counter:{count()}</p>
                <p class="text-center font-mono text-sm">
                    Level:{level()}, Amount:{amount()} x {amount()} equating to
                    a total Difficulty of:{" "}
                    {Math.floor((guessAlpha() / rightAlpha()) * 10000) / 100}%
                </p>
            </div>
            <div class="flex justify-center items-center">
                <div class="flex overflow-auto m-2 border-2 border-gray-800 dark:border-white">
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
        setLevel(startLevel);
        setAmount(startAmount);
    };
    const handleClick = (isTarget: boolean) => {
        if (!isTarget) {
            restart();
        }
        setElements([...createColours(amount())]);
        let completed = 0;
        if (count() % 2 === 0) {
            level() < 100 ? setLevel(level() + 5) : completed++;
        } else {
            amount() < 50 ? setAmount(amount() + 1) : completed++;
        }
        if (completed === 2) {
            restart();
        }
        setCount(count() + 1);
    };
    if (isTarget) {
        setGuessAlpha(hextToAlpha(colour));
    } else {
        setRightAlpha(hextToAlpha(colour));
    }

    return (
        <button
            onClick={() => {
                handleClick(isTarget);
            }}
            style={{ background: colour }}
            class={`block w-6 h-8 sm:w-8 sm-h-8 lg:w-10 lg:h-10`}
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
    let percent = difficulty;
    const min = percent * bias;
    if (min >= 100) {
        return getBiasedRandomAbovePercent(difficulty, bias - 0.1);
    }
    const max = 99.99999999;

    const randomValue = Math.random();
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

    const offset = getBiasedRandomAbovePercent(level());

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
