import Accomplishments from './Accomplishments';
import Contact from './Contact'
import Experiences from './Experiences';

const Home: React.FC = () => {
    return (
        <>
            <p style={{ textAlign: "center" }}>
                Hello, Welcome to Andy's personal website. I am an undergrad at University of Cambridge studying the Computer Science Tripos.
            </p>
            <Experiences/>
            <Accomplishments/>
            <Contact/>
        </>
    );
};

export default Home;