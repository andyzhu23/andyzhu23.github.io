
import "./index.css" 

const Footer: React.FC = () => {
    return (
        <footer>
            <p>&copy; {new Date().getFullYear()} Created by Andy Zhu</p>
        </footer>
    );
};

export default Footer;