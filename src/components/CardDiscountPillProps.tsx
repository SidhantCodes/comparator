import React from "react";
import { CardDiscountPillProps } from "../api/types";

export const CardDiscountPill: React.FC<CardDiscountPillProps> = ({
  text = "Card Discount",
  className = "",
}) => {
  return (
    <span className={`card-discount-pill ${className}`} aria-label={text}>
      <span className="card-discount-pill__bg" aria-hidden="true" />

      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.54L12 17.77 6.12 20.6l1.12-6.54L2.48 9.42l6.58-.96L12 2.5z" />
      </svg>

      <span>{text}</span>
    </span>
  );
};
