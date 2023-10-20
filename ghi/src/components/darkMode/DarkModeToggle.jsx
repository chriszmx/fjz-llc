import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudMoon } from '@fortawesome/free-solid-svg-icons';
import { useDarkMode } from "./darkModeContext";

const DarkModeToggle = () => {
    const { darkMode, setDarkMode } = useDarkMode();

    return (
        <button onClick={() => setDarkMode(!darkMode)} className="focus:outline-none">
            <FontAwesomeIcon icon={faCloudMoon} className={darkMode ? 'text-gray-200' : 'text-gray-800'} />
        </button>
    );
}

export default DarkModeToggle;
