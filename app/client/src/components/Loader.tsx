import styles from "../styles/lodaer.module.css";
const Loader = () => {
  return <div className="w-[100vw] h-[100vh] flex justify-center items-center bg-[#0000007f] fixed top-0 left-0 z-[1000111]">
    <div className={styles.loader}></div>
  </div>;
};

export default Loader;
