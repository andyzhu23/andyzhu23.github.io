
import "./index.css" 

const Header: React.FC = () => {

    return (
        <header style={{ textAlign: "center" }}>
            <h1>Andy Zhu</h1>
            <nav className="navbar">
                    <a href = "/" className="Header" style={{color: "darkgray"}}>Home</a>
                    <a href = "/Contact" className="Header" style={{color: "darkgray"}}>Contact</a>
            </nav>
            <hr></hr>
        </header>
    );
};

export default Header