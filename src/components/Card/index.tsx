import "./styles.css";
import logo from "../../public/images/cartao_eletropassos.jpg";

export interface CardProps {
  id: string;
  flipped?: boolean;
  back: string;
  handleClick?: (id: string) => void;
}

export function Card({ flipped = false, back, handleClick, id }: CardProps) {
  const cardContentClassNames = ["card__content"];
  flipped && cardContentClassNames.push("card__content--flipped");

  const handleClickFn = (id: string) => {
    if (handleClick) {
      handleClick(id);
    }
  };

  return (
    <div className="card" onClick={() => handleClickFn(id)}>
      <div className={cardContentClassNames.join(" ")}>
        <img className="card__face card__face--front" src={logo}></img>
        <img className="card__face card__face--back" src={back}></img>
      </div>
    </div>
  );
}
