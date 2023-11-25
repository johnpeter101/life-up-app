//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> IMPORTS 
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import backendUrl from '../../../../serverConfig';
import "../styleAdd.css";
import { useSpring, animated } from 'react-spring';
import logo from '../../../../GlobalStyles/images/logo.svg';
import imagen from '../../../../GlobalStyles/images/image1.png';
import Swal from 'sweetalert2';
import { FaCheck } from 'react-icons/fa';

/*--------------------------------------------------------  FUNCION PRINCIPAL  -------------------------------------------------------------- */
const Form_user_emergencia = () => {

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> DECLARACIONES 
  const fade = useSpring({ opacity: 1, from: { opacity: 0 } });
  //Declaraciones de estado para almacenar los datos del los inputs
  const [nombre, setNombre] = useState('');
  const [ap, setAp] = useState('');
  const [am, setAm] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [tel, setTel] = useState('');
  const [parentesco, setPar] = useState('');
  const [ID, setID] = useState('');
  const [Indice, setIndice] = useState('');
  const routeLocation = useLocation();
  const ID_recibido = routeLocation.state && routeLocation.state.ID_USER;
  const ID_Personal = routeLocation.state && routeLocation.state.ID_PERSONAL;
  const Rol = routeLocation.state && routeLocation.state.Rol;
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  const [calle, setCalle] = useState('');
  const [col, setCol] = useState('');
  const [cp, setCp] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [estado, setEstado] = useState('');
  const [delegacion, setDelegacion] = useState('');
  const [centroID, setCentro] = useState('');
  //nunmero de usuarios
  const [ultimoUserNum, setNumUs] = useState('');
  const [año, setAño] = useState('');
    console.log(ID_Personal);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> FUNCIONES 

  //funciones para el navigate
  const Home = () => { navigate("/loader-Home"); }
  const Regresar = () => { navigate(-1); }

  //Función que permite escribir en mayusculas solamente.
  const handleInput = (event) => { event.target.value = event.target.value.toUpperCase(); };

  //-----Funciones para establecer los valores a las declaraciones de estados
  const handleInputNombre = (event) => { setNombre(event.target.value); }
  const handleInputAp = (event) => { setAp(event.target.value); }
  const handleInputAm = (event) => { setAm(event.target.value); }
  const handleInputTel = (event) => { setTel(event.target.value); }
  const handleInputPar = (event) => { setPar(event.target.value); }
  const handleInputSexo = (event) => { setSexo(event.target.value); }

  //Función que permite agregar los datos conectandose a un endpoint
  const handleSubmit = (event) => {

    //variables de base de datos
    const UserID = ID_recibido;


    const User_ID = UserID;
    const Nombre = nombre;
    const ApellidoPaterno = ap;
    const ApellidoMaterno = am;
    const Telefono = tel;
    const Parentesco = parentesco;
    				
    const formData = {
      UserID,
      Nombre,	
      ApellidoPaterno,	
      ApellidoMaterno,	
      Telefono,	
      Parentesco
    };

   


    // Enviar los datos al servidor utilizando Axios
    axios.post(backendUrl + '/api/addInformationEmergencyUser', formData)
      .then(response => {
        // Manejar la respuesta del servidor si es necesario

        if (response.status === 200) {
          // Autenticación exitosa, puedes redirigir al usuario a otra página
          //Alerta(icono, titulo, texto) ('Inicio de sesión exitoso');
          //            navigate("/loader-DashboardSU");

          //redigir y pasar el ID
          //navigate("/loader-DashboardSU");
          AlertaTimer('success', 'Sección completada', 1000);
            navigate('/addUserFoto', { state: { ID_USER: ID_recibido, ID_PERSONAL: ID_Personal, Rol: Rol } });

        } else {
          // Autenticación fallida
          Alerta('error', 'Sin éxito', 'Falló al registrar la información');
        }
      })
      .catch(error => {
        // Manejar errores si ocurre alguno
        console.error(error);
      });




    //Alerta('success', 'id: '+ID_recibido);

  }

  //funciones de alerta
  function Alerta(icono, titulo, texto) {
    Swal.fire({
      icon: icono,
      title: titulo,
      text: texto,
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'Aceptar'
    })
  }
  function AlertaTimer(icono, titulo, tiempo) {
    Swal.fire({
      position: 'center',
      icon: icono,
      title: titulo,
      showConfirmButton: false,
      timer: tiempo
    })
  }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> USE EFFECT() 
  useEffect(() => {

  }, [navigate]);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> RETURN () 
  return (
    <body>
      <div className="left-panel">
        <img src={logo} className='logo' />
        <div className='contTitleLeft' >
          <label className='labelPanelLeft'><strong>Secciones completadas</strong></label>
          <div className='line'></div>
        </div>

        <label className='txtBTN' ><FaCheck /> Información personal</label>
        <label className='txtBTN' ><FaCheck /> Información de contacto</label>

        <label className='txtBTN' >Sección pendiente</label>
        <label className='txtBTN' >Sección pendiente</label>
        <div className='contMenu' >


        </div>
        <div className='contentImage'>
         <img src={""} className='imagen' />
        </div>
      </div>

      <div className="right-panel">
        <div className="right-panel-content">
          <div className='formContainer'>
            <animated.h1 style={fade} className="titleForm">Información de emergencia</animated.h1>
          

            <div className='containerInputLabel'>
              <label className='labelInput'>Ingresa el nombre:</label>
              <input type="text" class="inputGlobal" placeholder="Nombre(s)" value={nombre} onChange={handleInputNombre} onInput={handleInput} required />
            </div>

            <div className='containerInputLabel'>
              <label className='labelInput'>Ingresa Apellido Paterno:</label>
              <input type="text" class="inputGlobal" placeholder="Apellido Paterno" value={ap} onChange={handleInputAp} onInput={handleInput} required />
            </div>

            <div className='containerInputLabel'>
              <label className='labelInput'>Ingresa Apellido Materno:</label>
              <input type="text" class="inputGlobal" placeholder="Apellido Materno" value={am} onChange={handleInputAm} onInput={handleInput} required />
            </div>

            <div className='containerInputLabel'>
              <label className='labelInput'>Ingresa Telefono:</label>
              <input type="text" class="inputGlobal" placeholder="Teléfono" pattern="[0-9]{10}" value={tel} onChange={handleInputTel} onInput={handleInput} required />
            </div>

            <div className='containerInputLabel'>
              <label className='labelInput'>Selecciona el parentesco:</label>
              <select name="select" className="inputGlobal" placeholder="Parentesco" value={parentesco} onChange={handleInputPar} required>
                <option value="" selected>Selecciona un parentesco</option>
                <option value="Hijo">Hijo/as</option>
                <option value="Hermano">Hermano/as</option>
                <option value="Nieto">Nieto/as</option>
                <option value="Biznieto">Biznieto/as</option>
                <option value="Conyuge">Conyuge</option>
              </select>
            </div>

            <button type="submit" className='buttonPrincipalGlobal' onClick={handleSubmit} >Siguiente</button>
          </div>
        </div>

      </div>

      <div className="">
      </div>
    </body>
  );

}

export default Form_user_emergencia;