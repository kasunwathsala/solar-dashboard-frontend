import s from "./Button.module.css";

const Button = () => {
  return (
    <button className={s.btn} onClick={() => console.log("Button clicked")}>
      Click me
    </button>
  );
};

export default Button;
