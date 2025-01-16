
import "./index.css" 

const Header: React.FC = () => {

    return (
        <header>
            <h1>Andy Zhu</h1>
            <nav>
                <ul>
                    <li><a href = "/" className="Header">Home</a></li>
                    <li><a href = "/Contact" className="Header">Contact</a></li>
                </ul>
            </nav>
            <hr></hr>
        </header>
    );
};

export default Header