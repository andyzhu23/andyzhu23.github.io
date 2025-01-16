import { Route, Routes } from 'react-router-dom'; // Import Route and Routes
import Home from './Home'; // Example home page component
import Contact from './Contact'; // Your Contact component

const Content: React.FC = () => {
    return (
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Contact" element={<Contact />} />
        </Routes>
    );
};

export default Content;