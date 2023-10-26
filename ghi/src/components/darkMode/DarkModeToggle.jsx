import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudMoon } from '@fortawesome/free-solid-svg-icons';
import { useDarkMode } from "./darkModeContext";

const DarkModeToggle = () => {
    const { darkMode, setDarkMode } = useDarkMode();

    return (
        <button onClick={() => setDarkMode(!darkMode)} className="focus:outline-none">
            <FontAwesomeIcon icon={faCloudMoon} className={darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-200 hover:text-indigo-400'} />
        </button>
    );
}

export default DarkModeToggle;
