import "../styles/pages/Home.css";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>מסך הבית</h1>
        {user && <p className="welcome-text">שלום {user.username}</p>}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card user-card">
          <h3>פרטי משתמש</h3>

          {user && (
            <>
              <p>
                <strong>שם משתמש:</strong> {user.username}
              </p>
              <p>
                <strong>תפקיד:</strong> {user.role}
              </p>
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
            </>
          )}
        </div>

        <div className="dashboard-card">
          <h3>אירועים קרובים</h3>
          <p>אין אירועים כרגע</p>
        </div>

        <div className="dashboard-card">
          <h3>משימות פעילות</h3>
          <p>אין משימות פעילות</p>
        </div>

        <div className="dashboard-card">
          <h3>כשירויות</h3>
          <p>כל הכשירויות בתוקף</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
