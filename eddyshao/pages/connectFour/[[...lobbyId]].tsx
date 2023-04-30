import Head from "next/head";
import Navbar from "../../components/Navbar";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { customAlphabet } from "nanoid";

type Player = {
  id: string;
  currentTurn: boolean;
};

type gameData = {
  gameBoard: string;
  yellow: boolean;
  players: Player[];
};

const sendGameData = async (
  gameBoard: string[][],
  yellow: boolean,
  userId: string
) => {
  const player: Player = {
    id: userId,
    currentTurn: false,
  };

  const body: gameData = {
    gameBoard: JSON.stringify(gameBoard),
    yellow: yellow,
    players: [player],
  };
  console.log(body);
  // body.players.append(player)
  const res = await fetch("/api/pusher", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Failed to push game board");
  }
};

const ConnectFour = () => {
  const router = useRouter();
  const { joinId } = router.query;
  const nanoidUser = customAlphabet("1234567890abcdef", 21);
  const [userId, setUserId] = useState(nanoidUser());
  const [lobbyId, setLobbyId] = useState("");
  const [username, setUsername] = useState("");
  const [usernameFinalised, setUsernameFinalised] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [myTurn, setMyTurn] = useState(true);
  const [channelBinded, setChannelBinded] = useState(false);
  const [gameBoard, setGameBoard] = useState(
    Array.from({ length: 7 }, () => Array.from({ length: 6 }, () => "X"))
  );
  const columnRefs = useRef(new Array());

  useEffect(() => {
    if (!router.isReady) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe("connect4");
    if (!inGame && !channelBinded) {
      channel.bind("connect4-event", (data: any) => {
        setGameBoard(JSON.parse(data.gameBoard));
        setYellow(!data.yellow);
        if (data.currentPlayer === userId) {
          setMyTurn(true);
        } else {
          setMyTurn(false);
        }
      });
    }

    return () => {
      pusher.unsubscribe("connect4");
    };
  }, [router.isReady]);

  const [yellow, setYellow] = useState(true);
  const [finished, setFinished] = useState(false);

  const makeMove = async (colIndex: number) => {
    if (!myTurn) {
      return;
    }
    const playerSymbol = yellow ? "Y" : "R";
    let boardCopy = [...gameBoard];
    const row = boardCopy[colIndex];
    let col = row.length - 1;
    for (col; col >= 0; col--) {
      if (row[col] == "X") {
        boardCopy[colIndex][col] = playerSymbol;
        setGameBoard(boardCopy);
        console.log(gameBoard);
        setYellow((yellow) => !yellow);
        setFinished(checkWin(col, colIndex, playerSymbol));
        break;
      }
    }
    // await sendGameData(gameBoard, yellow, userId);
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

  const createLobby = () => {
    const nanoidLobby = customAlphabet("1234567890abcdef", 6);
    setLobbyId(nanoidLobby());
  };

  const columnMouseEnter = (colIndex: number, enter: boolean) => {
    const background = yellow ? "bg-yellow-200/90" : "bg-red-300/90";
    const columnChildren: any = Array.from(
      columnRefs.current[colIndex].children
    ).reverse();

    for (const child of columnChildren) {
      if (child.value === "X") {
        if (enter) {
          child.classList.replace("bg-white", background);
        } else {
          child.classList.replace(background, "bg-white");
        }
        return;
      }
    }
  };

  const renderBoard = () => {
    return (
      <div
        className="w-max-content flex select-none flex-row rounded-2xl bg-blue-600 shadow-2xl sm:gap-1 sm:rounded-3xl"
        style={{ pointerEvents: finished || !myTurn ? "none" : "auto" }}
      >
        {gameBoard.map((col, colIndex) => {
          return (
            <div
              className="flex w-full cursor-pointer flex-col items-center gap-1 rounded-2xl p-1 hover:bg-blue-400 sm:gap-3 sm:rounded-3xl sm:p-2"
              key={colIndex}
              ref={(e) => (columnRefs.current[colIndex] = e)}
              onMouseEnter={() => columnMouseEnter(colIndex, true)}
              onMouseLeave={() => columnMouseEnter(colIndex, false)}
              onClick={() => {
                makeMove(colIndex);
              }}
            >
              {col.map((row: string, rowIndex: number) => {
                let background = "bg-white";
                if (row == "Y") {
                  background = "bg-yellow-400";
                } else if (row == "R") {
                  background = "bg-red-600";
                }
                return (
                  <button
                    className={`rounded-full ${background} animation-connect-four-drop duration-750 p-4 shadow-2xl transition-all sm:p-6 md:p-9`}
                    key={rowIndex}
                    value={row}
                  ></button>
                );
              })}
            </div>
          );
        })}
      </div>
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
        <div className="flex h-full flex-col items-center justify-center gap-8 px-20">
          <h1 className="pt-10 text-4xl md:w-3/4">Connect 4</h1>
          <div className="flex w-full flex-col gap-5 sm:flex-row md:w-3/4">
            <div className="min-w-1/2 flex w-1/2 flex-col gap-5">
              {usernameFinalised ? (
                <>
                  <h1 className="text-2xl">Hi, {username}</h1>
                  <button
                    className="btn-primary btn-sm btn w-fit rounded-md text-xs"
                    onClick={() => setUsernameFinalised(false)}
                  >
                    Reset username
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl">Set username</h1>
                  <div className="flex flex-row items-center gap-2">
                    <p className="text-sm">Username</p>
                    <input
                      className="input input-sm rounded-md"
                      placeholder="Enter username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn-primary btn-sm btn w-fit rounded-md text-xs"
                    onClick={() => setUsernameFinalised(true)}
                  >
                    Set username
                  </button>
                </div>
              )}
            </div>
            <div className="min-w-1/2 flex w-1/2 flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl">Join lobby</h1>
                <div className="flex flex-row items-center gap-2">
                  <p className="w-fit text-sm">Lobby code:</p>
                  <input
                    className="input input-sm rounded-md"
                    placeholder="e.g. 123abc"
                    type="text"
                    onChange={(e) => setLobbyId(e.target.value)}
                  />
                </div>
                <button className="btn-primary btn-sm btn w-fit rounded-md text-xs">
                  Join game
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl">Start a lobby</h1>
                <button className="btn-primary btn-sm btn w-fit rounded-md text-xs">
                  Create lobby
                </button>
              </div>
            </div>
          </div>

          {/* {renderBoard()} */}
          {/* {finished ? (
            <p className="text-center text-3xl md:text-4xl">
              {yellow ? "Red" : "Yellow"} won!
            </p>
          ) : (
            <p className="text-center text-2xl md:text-3xl">
              {yellow ? "Yellow" : "Red"} player&apos;s turn
            </p>
          )} */}
        </div>
      </div>
    </>
  );
};

export default ConnectFour;
