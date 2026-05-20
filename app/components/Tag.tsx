import "../globals.css";

type Props = {
  type: string;
  active?: boolean;
  onClick?: () => void;
};

export default function Tag({ type, active = false, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-1.75 pb-0.75 border-[1.5px] rounded-2xl squircle whitespace-nowrap duration-300 cursor-pointer ${
        active
          ? "border-white/15 bg-white/10 text-white"
          : "border-white/5 bg-white/2.5 hover:bg-white/5 text-white/60 hover:text-white"
      }`}
    >
      <small>{type}</small>
    </button>
  );
}
