import "./index.css"

const Experiences: React.FC = () => {
    return (
        <>
            <h1 style={{ textAlign: "center" }}>Professional Experiences</h1>
            <hr></hr>
            <h2 style={{ textAlign: "center" }}>Incoming Technology Developer Intern at Barclays</h2>
            <hr></hr>
            <h2 style={{ textAlign: "center" }}>Man Group: Technology Summer Internship</h2>
            <ul>
                <li style={{ margin: 10 }}>Joined the Codex Team, the team responsible for bringing external vendor data into internal Arctic library</li>
                <li style={{ margin: 10 }}>Explored different tools to improve the current pipeline platform orchestrated on Apache Airflow</li>
                <li style={{ margin: 10 }}>Integrated & built ETL pipelines in Flyte and Dagster, including setting up ELT pipeline using Airbyte,
                Apache Iceberg, and Trino</li>
                <li style={{ margin: 10 }}>Gave a company-wide presentation comparing pros & cons of different tools explored, giving insights to
                potential solutions for next generation Man pipelines</li>
            </ul>
            <hr></hr>
            <h1 style={{ textAlign: "center" }}>Other Experiences</h1>
            <hr></hr>
            <h2 style={{ textAlign: "center" }}>Competitive Programming Society, Cambridge, UK: Contest Manager</h2>
            <p style={{textAlign: "center"}}>Taken the role of contest manager. Helped create practice contests for regular society meeting</p>
            <hr></hr>
            <h2 style ={{textAlign: "center"}}>DMOJ, Online: Contest Author/Co-author</h2>
            <p style={{textAlign: "center"}}>I Co-authored three programming contests on DMOJ, set programming problems, made test data, and managed feedbacks from testers</p>
            <ul>
                <li style={{textAlign: "center"}}><a href="https://dmoj.ca/contest/yac8" style={{color: "lightskyblue"}}>Yet Another Contest 8</a></li>
                <li style={{textAlign: "center"}}><a href="https://dmoj.ca/contest/sgspc" style={{color: "lightskyblue"}}>St. George's School Programming Challenge</a></li>
                <li style={{textAlign: "center"}}><a href="https://dmoj.ca/contest/arc1" style={{color: "lightskyblue"}}>Another Random Contest 1</a></li>
            </ul>
            <hr></hr>
            <h2 style={{ textAlign: "center" }}>Passionate Bridge Player</h2>
            <p style={{textAlign: "center"}}>I use 2 over 1 convention</p>
            <hr></hr>
        </>
    );
};

export default Experiences;