import { Link } from "react-router-dom";
import React from "react";

const Home = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Controlla se il token esiste

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-3">Benvenuto su Subscription Tracker</h1>
      <p className="lead">Gestisci le tue sottoscrizioni in modo semplice ed efficace.</p>
      <div className="mt-4">
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-success">
            Vai alla Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary mx-2">Login</Link>
            <Link to="/register" className="btn btn-outline-secondary mx-2">Registrati</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
