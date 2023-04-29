import Head from "next/head";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";

const sendGameBoard = async (gameBoard: string[][], yellow: boolean) => {
  const res = await fetch("/api/pusher", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameBoard: JSON.stringify(gameBoard),
      yellow: yellow,
    }),
  });

  if (!res.ok) {
    console.error("Failed to push game board");
  }
};

const ConnectFour = () => {
  const [gameBoard, setGameBoard] = useState(
    Array.from({ length: 7 }, () => Array.from({ length: 6 }, () => "X"))
  );

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe("connect4");
    channel.bind("connect4-event", (data: any) => {
      setGameBoard(JSON.parse(data.gameBoard));
      setYellow(!data.yellow);
    });

    return () => {
      pusher.unsubscribe("connect4");
    };
  });

  const [yellow, setYellow] = useState(true);
  const [finished, setFinished] = useState(false);

  const makeMove = async (rowIndex: number, colIndex: number) => {
    const playerSymbol = yellow ? "Y" : "R";
    let boardCopy = [...gameBoard];
    const row = boardCopy[colIndex];
    let col = row.length - 1;
    for (col; col >= 0; col--) {
      if (row[col] == "X") {
        boardCopy[colIndex][col] = playerSymbol;
        setGameBoard(boardCopy);
        setYellow((yellow) => !yellow);
        setFinished(checkWin(col, colIndex, playerSymbol));
        break;
      }
    }
    await sendGameBoard(gameBoard, yellow);
  };

  const transpose = (gameBoard: string[][]) => {
    return gameBoard[0].map((col, i) => gameBoard.map((row) => row[i]));
  };

  const checkWin = (
    rowIndex: number,
    colIndex: number,
    playerSymbol: string
  ) => {
    const winCon = playerSymbol.repeat(4);
    // Check vertical win
    const currRow = gameBoard[colIndex].join("");
    if (currRow.includes(winCon)) {
      return true;
    }

    // Check horizontal win
    const transposed = transpose(gameBoard);
    const transposedRow = transposed[rowIndex].join("");
    if (transposedRow.includes(winCon)) {
      return true;
    }

    // Check left diagonal win
    let leftShift = "";
    let i = 3;
    let row, col;
    while (i > -4) {
      row = colIndex - i;
      col = rowIndex - i;
      console.log(col, row);
      if (row >= 0 && row <= 6 && col >= 0 && col <= 5) {
        leftShift += gameBoard[row][col];
      }
      i--;
    }
    if (leftShift.includes(winCon)) {
      return true;
    }

    let rightShift = "";
    i = 3;
    while (i > -4) {
      row = colIndex - i;
      col = rowIndex + i;
      if (row >= 0 && row <= 6 && col >= 0 && col <= 5) {
        rightShift += gameBoard[row][col];
      }
      i--;
    }
    if (rightShift.includes(winCon)) {
      return true;
    }

    return false;
  };

  const renderBoard = () => {
    return (
      <>
        <div
          className="w-max-content flex flex-row justify-around gap-2 bg-blue-500 p-2 sm:gap-3 sm:p-3 md:gap-5 md:p-5"
          style={{ pointerEvents: finished ? "none" : "auto" }}
        >
          {gameBoard.map((col, colIndex) => {
            return (
              <div
                className="flex w-full flex-col items-center gap-2 sm:gap-3 md:gap-5"
                key={colIndex}
              >
                {col.map((row: string, rowIndex: number) => {
                  let background = "bg-white";
                  const hover = yellow ? "bg-yellow-300" : "bg-red-600";
                  if (row == "Y") {
                    background = "bg-yellow-300";
                  } else if (row == "R") {
                    background = "bg-red-600";
                  }
                  return (
                    <button
                      className={`rounded-full ${background} p-3 transition-all sm:p-5 md:p-8 ${
                        background == "bg-white" && `hover:${hover}`
                      }`}
                      key={rowIndex}
                      onClick={() => {
                        makeMove(rowIndex, colIndex);
                      }}
                    ></button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Eddy Shao</title>
        <meta name="description" content="Index page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="container h-full min-h-screen w-screen max-w-none bg-gradient-to-br from-violet-100 to-teal-100">
        <Navbar />
        <div className="flex flex-col items-center gap-8 px-20">
          <h1 className="text-center text-4xl">Connect 4</h1>
          {renderBoard()}
          {finished ? (
            <p className="text-center text-3xl md:text-4xl">
              {yellow ? "Red" : "Yellow"} won!
            </p>
          ) : (
            <p className="text-center text-2xl md:text-3xl">
              {yellow ? "Yellow" : "Red"} player&apos;s turn
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ConnectFour;
