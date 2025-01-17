import { Route, Routes } from 'react-router-dom'; // Import Route and Routes
import Home from './Home'; // Example home page component

const Content: React.FC = () => {
    return (
        <Routes>
        <Route path="/" element={<Home />} />
        </Routes>
    );
};

export default Content;