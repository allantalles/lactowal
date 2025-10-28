import "./styles.css";
import { Card, CardProps } from "../Card";
import { useRef, useState, useEffect } from "react";
import { duplicateRegenerateSortArray } from "../../utils/card-utils";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/images/logo_onmedica.png";

export interface GridProps {
  cards: CardProps[];
}

export function Grid({ cards }: GridProps) {
  const [stateCards, setStateCards] = useState<CardProps[]>([]);
  const first = useRef<CardProps | null>(null);
  const second = useRef<CardProps | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [jogadorAtualId, setJogadorAtualId] = useState<string | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const totalPairs = cards.length;

  const loadLeaderboard = () => {
    const id = localStorage.getItem("jogadorAtual");
    setJogadorAtualId(id);

    const dataStr = localStorage.getItem("formData");
    if (dataStr) {
      const data = JSON.parse(dataStr);
      const filtered = data.filter((p: any) => p.tempo !== null);
      const sorted = filtered.sort((a: any, b: any) => a.tempo - b.tempo);
      setLeaderboard(sorted);
    }
  };

  useEffect(() => {
    if (showModal) loadLeaderboard();
  }, [showModal]);

  const revealAndHideCards = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const revealed = duplicateRegenerateSortArray(cards).map((card) => ({
      ...card,
      flipped: true,
    }));
    setStateCards(revealed);

    setTimeout(() => {
      const hidden = revealed.map((card) => ({
        ...card,
        flipped: false,
      }));
      setStateCards(hidden);

      startTimeRef.current = Date.now();
      setElapsedTime(0);

      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const now = Date.now();
          const diff = Math.floor((now - startTimeRef.current) / 1000);
          setElapsedTime(diff);
        }
      }, 1000);
    }, 3000);
  };

  useEffect(() => {
    revealAndHideCards();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (matches === totalPairs) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const id = localStorage.getItem("jogadorAtual");
      if (id) {
        const dataStr = localStorage.getItem("formData");
        if (dataStr) {
          const data = JSON.parse(dataStr);
          const updated = data.map((entry: any) =>
            entry.id === id
              ? { ...entry, tempo: elapsedTime, movimentos: moves }
              : entry
          );
          localStorage.setItem("formData", JSON.stringify(updated));
        }
      }

      loadLeaderboard();
      setShowModal(true);
    }
  }, [matches]);

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    first.current = null;
    second.current = null;
    setIsChecking(false);
    setMatches(0);
    setMoves(0);
    setElapsedTime(0);
    startTimeRef.current = null;
    revealAndHideCards();
  };

  const handleClick = (id: string) => {
    if (isChecking) return;

    const newStateCards = stateCards.map((card) => {
      if (card.id !== id) return card;
      if (card.flipped) return card;
      return { ...card, flipped: true };
    });

    const clickedCard = newStateCards.find((card) => card.id === id);
    if (!clickedCard) return;

    if (first.current === null) {
      first.current = clickedCard;
    } else if (second.current === null) {
      second.current = clickedCard;

      setMoves((m) => m + 1);
      setIsChecking(true);

      if (first.current.back === second.current.back) {
        first.current = null;
        second.current = null;
        setMatches((m) => m + 1);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          const reverted = newStateCards.map((card) => {
            if (
              card.id === first.current?.id ||
              card.id === second.current?.id
            ) {
              return { ...card, flipped: false };
            }
            return card;
          });

          setStateCards(reverted);
          first.current = null;
          second.current = null;
          setIsChecking(false);
        }, 1000);
      }
    }

    setStateCards(newStateCards);
  };

  return (
    <>
      <div className="text">
        <img src={logo} className="logo"></img>
        <h1>Jogo da Memória</h1>
        <p>
          Moves: {moves} | Matches: {matches} | Tempo: {elapsedTime}s
          {/* <button
            onClick={() => {
              loadLeaderboard();
              setShowModal(true);
            }}
          >
            Ver Ranking
          </button> */}
        </p>
      </div>

      <div className="grid">
        {stateCards.map((card) => (
          <Card {...card} key={card.id} handleClick={handleClick} />
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Leaderboard</h2>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tempo (s)</th>
                  <th>Movimentos</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => {
                  const isCurrent = player.id === jogadorAtualId;
                  const rankClass =
                    index === 0
                      ? "rank-1"
                      : index === 1
                      ? "rank-2"
                      : index === 2
                      ? "rank-3"
                      : "";
                  const medal =
                    index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : "";

                  return (
                    <tr
                      key={index}
                      className={`leaderboard-row ${rankClass} ${
                        isCurrent ? "current-player" : ""
                      }`}
                    >
                      <td>
                        {medal} {player.nome} {isCurrent ? "(Você)" : ""}
                      </td>
                      <td>{player.tempo ?? "--"}</td>
                      <td>{player.movimentos ?? "--"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
              <button
                onClick={() => {
                  navigate("/");
                }}
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
