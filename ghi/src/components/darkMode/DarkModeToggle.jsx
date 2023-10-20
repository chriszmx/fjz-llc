import { useDarkMode } from "./darkModeContext";

const DarkModeToggle = () => {
    const { darkMode, setDarkMode } = useDarkMode();

    return (
        <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
}

export default DarkModeToggle
