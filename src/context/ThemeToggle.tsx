import { useContext } from "react";
import { ThemeContext } from "./themeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return(
        <div style={{textAlign:"center", padding:"10px"}}>
        <button onClick={toggleTheme}>
            Switch to {theme === "light" ? "Dark" : "Light"}
        </button>
        </div>
   )
}

export default ThemeToggle;