import PropTypes from "prop-types";

function NotFound({ tipo }) {
  
  if (tipo === 1) {
    return (
      <img src="/src/assets/notfound.png" alt="404" className="mx-auto" style={{height: '20vw'}}/>
    )
  }
  else {
    return (
      <img src="/src/assets/notfound2.png" alt="404" className="mx-auto" style={{height: '20vw'}}/>
    )
  }
}

// Validacion de props
NotFound.propTypes = {
  tipo: PropTypes.number.isRequired,
};

export default NotFound