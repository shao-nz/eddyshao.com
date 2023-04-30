import Head from "next/head";
import Navbar from "../../components/Navbar";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import Channel from "pusher-js/types/src/core/channels/channel";
import { customAlphabet } from "nanoid";

// Pusher.logToConsole = true;

const ConnectFour = () => {
  const router = useRouter();
  const { joinId } = router.query;
  const nanoidLobby = customAlphabet("1234567890abcdef", 6);
  // const nanoidUser = customAlphabet("1234567890abcdef", 21);
  // const [userId, setUserId] = useState(nanoidUser());
  const [pusher, setPusher] = useState<Pusher>();
  const [gameChannel, setGameChannel] = useState<Channel>();
  const [lobbyId, setLobbyId] = useState("");
  const [username, setUsername] = useState("");
  const [opponent, setOpponent] = useState("");
  const [usernameFinalised, setUsernameFinalised] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [roomCreator, setRoomCreator] = useState(false);
  const [channelBinded, setChannelBinded] = useState(false);
  const [playerPiece, setPlayerPiece] = useState("Y");
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [gameBoard, setGameBoard] = useState(
    Array.from({ length: 7 }, () => Array.from({ length: 6 }, () => "X"))
  );
  const columnRefs = useRef(new Array());

  useEffect(() => {
    if (!router.isReady) return;

    if (gameChannel && !inGame && !channelBinded) {
      gameChannel.bind("client-joined-c4", (data: any) => {
        setMyTurn(false);
        setInGame(true);
        setOpponent(data.username);

        if (roomCreator) {
          gameChannel.trigger("client-joined-c4", {
            username: username,
          });
          setMyTurn(true);
        }
      });
      setChannelBinded(true);
    }

    if (gameChannel && channelBinded && !myTurn) {
      gameChannel.bind("client-move-c4", (data: any) => {
        setGameBoard(JSON.parse(data.gameBoard));
        setWinner(data.winner);
        setMyTurn(true);
      });
    }
  });

  const usernameHandler = () => {
    if (username.length === 0) {
      setAlertContent("Username must not be empty!");
      return;
    }

    setUsernameFinalised(true);
  };

  const makeMove = async (colIndex: number) => {
    if (!myTurn) {
      return;
    }
    let gameFinish = false;
    let boardCopy = [...gameBoard];
    const row = boardCopy[colIndex];
    let col = row.length - 1;
    for (col; col >= 0; col--) {
      if (row[col] == "X") {
        boardCopy[colIndex][col] = playerPiece;
        setGameBoard(boardCopy);
        gameFinish = checkWin(col, colIndex, playerPiece);
        setFinished(gameFinish);
        break;
      }
    }

    if (gameChannel) {
      let currWinner = "";
      if (gameFinish) {
        currWinner = username;
        setWinner(currWinner);
      }
      const sendMove = gameChannel.trigger("client-move-c4", {
        gameBoard: JSON.stringify(gameBoard),
        winner: currWinner,
      });
      if (sendMove) {
        setMyTurn(false);
      }
    }
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
    if (username.length === 0) {
      setAlertContent("Set a username first!");
      return;
    }

    const currLobbyId = nanoidLobby();
    setLobbyId(currLobbyId);

    const currPusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY as string,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        authEndpoint: "/api/pusher/auth",
      }
    );

    setPusher(currPusher);

    let channelName = "private-connect4-" + currLobbyId;
    const currGameChannel = currPusher.subscribe(channelName);
    setGameChannel(currGameChannel);
    setRoomCreator(true);
  };

  const joinLobby = () => {
    if (lobbyId.length === 0) {
      setAlertContent("Enter lobby code.");
      return;
    }

    if (username.length === 0) {
      setAlertContent("Set a username first!");
      return;
    }

    const currPusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY as string,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        authEndpoint: "/api/pusher/auth",
      }
    );

    setPusher(currPusher);

    let channelName = "private-connect4-" + lobbyId;
    const currGameChannel = currPusher.subscribe(channelName);
    setGameChannel(currGameChannel);
    if (currGameChannel) {
      currGameChannel.bind("pusher:subscription_succeeded", () => {
        currGameChannel.trigger("client-joined-c4", {
          username: username,
        });
      });
    }
    setPlayerPiece("R");
    setMyTurn(false);
  };

  const gameEnd = () => {
    setOpponent("");
    setMyTurn(false);
    setInGame(false);
    setRoomCreator(false);
    // setGameBoard(
    //   Array.from({ length: 7 }, () => Array.from({ length: 6 }, () => "X"))
    // );
    if (pusher) pusher.unsubscribe("private-connect4-" + lobbyId);
    setGameChannel(undefined);
    setChannelBinded(false);
  };

  const columnMouseEnter = (colIndex: number, enter: boolean) => {
    const background =
      playerPiece === "Y" ? "bg-yellow-200/90" : "bg-red-300/90";
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

  const renderGameStatus = () => {
    let status = "";
    if (winner === "") {
      if (myTurn) {
        status = "Your turn";
      } else {
        status = `${opponent}'s turn`;
      }
    } else {
      if (winner === username) {
        status = "You won!";
      } else {
        status = "You lost!";
      }
    }

    return <p>{status}</p>;
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
          {!usernameFinalised && alertContent && (
            <div className="alert alert-error md:w-3/4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 flex-shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{alertContent}</span>
              </div>
            </div>
          )}
          {inGame ? (
            <>
              <p>Playing against {opponent}</p>
              {renderBoard()}
              {renderGameStatus()}
            </>
          ) : (
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
                      onClick={() => usernameHandler()}
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
                  <button
                    className="btn-primary btn-sm btn w-fit rounded-md text-xs"
                    onClick={joinLobby}
                  >
                    Join game
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl">Start a lobby</h1>
                  <button
                    className="btn-primary btn-sm btn w-fit rounded-md text-xs"
                    onClick={createLobby}
                  >
                    Create lobby
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConnectFour;
