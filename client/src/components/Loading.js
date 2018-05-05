import React from "react";

const Loading = props => (
  <svg
    className="svg-loading"
    viewBox="0 0 500 500"
    width={25}
    height={25}
    xmlnsbx="https://boxy-svg.com"
    {...props}
  >
    <defs>
      <linearGradient
        id="a"
        gradientUnits="userSpaceOnUse"
        x1={101}
        y1={-72.498}
        x2={101}
        y2={290.561}
        gradientTransform="translate(-36.328 -39.206) scale(1.35967)"
      >
        <stop offset={0} stopColor="#ff0" />
        <stop offset={1} stopColor="#ff6060" />
      </linearGradient>
    </defs>
    <path
      d="M-145.778 109a246.778 246.778 0 1 0 493.556 0 246.778 246.778 0 1 0-493.556 0zM-39.967 109a140.967 140.967 0 0 1 281.934 0 140.967 140.967 0 0 1-281.934 0z"
      transform="rotate(135 146.17 210.02)"
      bxshape="ring 101 109 140.967 140.967 246.778 246.778 1@20d2f988"
      fill="url(#a)"
    />
  </svg>
);

export default Loading;
