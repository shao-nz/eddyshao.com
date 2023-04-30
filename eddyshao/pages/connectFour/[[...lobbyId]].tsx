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
  const [createdWaiting, setCreatedWaiting] = useState(false);
  const [channelBinded, setChannelBinded] = useState(false);
  const [playerPiece, setPlayerPiece] = useState("Y");
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState("");
  const [modalAlertContent, setModalAlertContent] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [showCreateLobbyModal, setShowCreateLobbyModal] = useState(false);
  const [showJoinLobbyModal, setShowJoinLobbyModal] = useState(false);
  const [cancelJoin, setCancelJoin] = useState(false);
  const [gameBoard, setGameBoard] = useState(
    Array.from({ length: 7 }, () => Array.from({ length: 6 }, () => "X"))
  );
  const columnRefs = useRef(new Array());

  // const basePath = "http://localhost:3001";
  const basePath = "https://www.eddyshao.com"
  // const basePath = "https://eddyshao-com-git-dev-shao.vercel.app"

  useEffect(() => {
    if (router.isReady) {
      if (joinId && !cancelJoin && !inGame) {
        setLobbyId(joinId as string);
        setShowJoinLobbyModal(true);
      }
    } else {
      return;
    }

    if (gameChannel && !inGame && !channelBinded) {
      gameChannel.bind("client-joined-c4", (data: any) => {
        setMyTurn(false);
        setInGame(true);
        setOpponent(data.username);
        setShowCreateLobbyModal(false);
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
        setFinished(data.winner !== "");
        setMyTurn(true);
      });
    }
  });

  const usernameHandler = (modal: boolean) => {
    if (username.length === 0) {
      if (modal) {
        setModalAlertContent("Username must not be empty!");
      } else {
        setAlertContent("Username must not be empty!");
      }
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

    setShowCreateLobbyModal(true);

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

  const joinLobby = (lobbyId: string) => {
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
    setInGame(true);
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
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn-primary btn-sm btn w-fit rounded-md text-xs"
                      onClick={() => usernameHandler(false)}
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
                    onClick={() => joinLobby(lobbyId)}
                  >
                    Join game
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl">Start a lobby</h1>
                  <label
                    className="btn-primary btn-sm btn w-fit rounded-md text-xs"
                    onClick={createLobby}
                  >
                    Create lobby
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <>
        <div
          className={`modal modal-bottom sm:modal-middle ${
            showCreateLobbyModal && "modal-open"
          }`}
        >
          <div className="modal-box">
            <label
              className="btn-primary btn-sm btn-circle btn absolute right-4 top-4"
              onClick={() => {
                pusher?.unsubscribe("private-connect4-" + lobbyId);
                setShowCreateLobbyModal(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </label>
            <h3 className="text-lg font-bold">Lobby created!</h3>
            <div className="pt-3">
              Lobby code:
              <br />
              <label
                className="group btn-primary btn-sm btn rounded-md bg-primary/25 text-xs hover:bg-primary/75"
                onClick={() => {
                  setCreatedWaiting(true);
                  navigator.clipboard.writeText(lobbyId);
                }}
              >
                {lobbyId}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="ml-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                  />
                </svg>
              </label>
            </div>
            <div className="py-1">
              Lobby link: <br />
              <label
                className="group btn-primary btn-sm btn rounded-md bg-primary/25 text-xs lowercase hover:bg-primary/75"
                onClick={() => {
                  setCreatedWaiting(true);
                  navigator.clipboard.writeText(
                    `${basePath + router.asPath + "?joinId=" + lobbyId}`
                  );
                }}
              >
                {`${basePath + router.asPath + "?joinId=" + lobbyId}`}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="ml-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                  />
                </svg>
              </label>
            </div>
            {createdWaiting && (
              <div className="flex justify-center pt-3">
                <button
                  className="loading btn-info btn-sm btn cursor-not-allowed rounded-md
                text-sm"
                >
                  Waiting for another player to join...
                </button>
              </div>
            )}
          </div>
        </div>
      </>

      <>
        <div
          className={`modal modal-bottom sm:modal-middle ${
            showJoinLobbyModal && "modal-open"
          }`}
        >
          <div className="modal-box">
            {!usernameFinalised && modalAlertContent && (
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
                  <span>{modalAlertContent}</span>
                </div>
              </div>
            )}
            <label
              className="btn-primary btn-sm btn-circle btn absolute right-4 top-4"
              onClick={() => {
                setCancelJoin(true);
                setShowJoinLobbyModal(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </label>
            <h3 className="text-lg font-bold">Joining game: {lobbyId}</h3>
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm">Username</p>
              <input
                className="input-bordered input-primary input input-sm rounded-md"
                placeholder="Enter username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <label
                className="btn-sm btn rounded-md text-xs"
                onClick={() => {
                  usernameHandler(true);
                  if (username !== "") {
                    setShowJoinLobbyModal(false);
                    joinLobby(lobbyId);
                  }
                }}
              >
                Join game
              </label>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default ConnectFour;
