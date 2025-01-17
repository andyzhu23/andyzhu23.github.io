

const Home: React.FC = () => {
    return (
        <>
        <h1 style={{ textAlign: "center" }}>Contact</h1>
        <hr></hr>
        <ul style={{ textAlign: "center" }}>
            <span>
                <a href="andy.zheyuan.zhu@gmail.com" style={{color: "lightskyblue"}}>Email</a>
                <span> | </span>
                <a href="https://www.linkedin.com/in/andy-zhu-92409323b/" style={{color: "lightskyblue"}}>Linkedin</a>
                <span> | </span>
                <a href="https://github.com/andyzhu23" style={{color: "lightskyblue"}}>Github</a>
            </span>

        <h2>Competitive Programming</h2>
            <a href="https://codeforces.com/" style={{color: "lightskyblue"}}>CodeForces</a>
            <span> | </span>
            <a href="https://atcoder.jp/users/Wizard_of_Orz" style={{color: "lightskyblue"}}>AtCoder</a>
            <span> | </span>
            <a href="https://leetcode.com/u/Wizard_of_Orz/" style={{color: "lightskyblue"}}>LeetCode</a>
        <h2>Contract Bridge</h2>
            <span>User az453 on Bridge Base Online & Synrey Bridge</span>
        </ul>
        </>
    );
};

export default Home;