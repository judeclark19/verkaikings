const WowIcon = ({ color }: { color: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22px"
      height="22px"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill={color ? "#ffa726" : "rgba(255, 255, 255, 0.7)"}
        strokeLinecap="round"
      />
      <circle // left eye
        cx="9"
        cy="9"
        r="1"
        fill="#121212"
        stroke="#121212"
        strokeLinecap="round"
      />
      <circle // right eye
        cx="15"
        cy="9"
        r="1"
        fill="#121212"
        stroke="#121212"
        strokeLinecap="round"
      />
      <path // mouth
        d="M15 15.5C15 16.8807 13.6569 18 12 18C10.3431 18 9 16.8807 9 15.5C9 14.1193 10.3431 13 12 13C13.6569 13 15 14.1193 15 15.5Z"
        fill="#121212"
      />
    </svg>
  );
};

export default WowIcon;
