import { Link } from "react-router-dom";
import React from "react";

const Home = () => {
  return (
    <div>
      <h1>Benvenuto su Subscription Tracker</h1>
      <p>Gestisci le tue sottoscrizioni in modo semplice ed efficace.</p>
      <Link to="/login">Accedi</Link> | <Link to="/register">Registrati</Link>
    </div>
  );
};

export default Home;
