import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation  } from "react-router-dom";
import backendUrl from '../../../serverConfig';

import '../../../GlobalStyles/Resources.css';

import logo from '../../../GlobalStyles/images/logo.svg';
import imagen from '../../../GlobalStyles/images/image1.png';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const MenuEnfermeria = () => {
    const routeLocation = useLocation();
    const ID =  routeLocation.state && routeLocation.state.ID_PERSONAL;
    const Rol =  routeLocation.state && routeLocation.state.Rol;

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [copiedPersonalID, setCopiedPersonalID] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const handleRowClick = async (user) => {
        setSelectedUser(user);
    };
    // En MenuEnfermeria
  

 const regresar = () => {
    navigate('/MenuApp' , { state: { ID_PERSONAL: ID, Rol: Rol} });
  };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(backendUrl + '/api/tableUsers');
                const responseData = await response.json();
                if (response.ok) {
                    setUsers(responseData);
                } else {
                    console.error('Error al obtener los datos de usuarios');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error.message);
            }
        };

        fetchUsers();
    }, []);

    //usuarios
    function InsertUser() {
        navigate("/addUserPersonal" , { state: { ID_PERSONAL: ID } });
    }
    function GoLogOut() {
        navigate("/loader-Login");
    }
    const DeleteUser = () => {
        navigate("/DeleteUserPersonal");
    }
    const ModifyUser = () => {
        navigate("/EditUserPersonal");
    }

   const Expediente = () => {
        navigate("/Salud-Expediente-ID",  { state: { ID_PERSONAL: ID } });
    }
    const Consulta = () => {
        navigate("/Salud-Consulta-ID",  { state: { ID_PERSONAL: ID } });
    }

    const ConsultarExpediente = () => {
        navigate("/ExpedienteConsulta-Enfermeria");
    }
    const ConsultarConsultas = () => {
        navigate("/Consulta-Enfermeria");
    }

    return (
        <body>
            <div className="left-panel">
                <img src={logo} className='logo' />
                <div className='contTitleLeft' >
                    
                    <label className='labelPanelLeft'><strong>ENFERMERIA</strong></label>
                    <div className='line'></div>
                </div>
                <div className='contMenu' >
                    <div className='optionBtn' onClick={ConsultarConsultas}>
                        <label className='txtBTN'>Consultas</label>
                    </div>
                    <div className='optionBtn' onClick={ConsultarExpediente}>
                        <label className='txtBTN'>Expedientes</label>
                    </div>
                    <div className='optionBtn' onClick={regresar}>
                        <label className='txtBTN'>Regresar</label>
                    </div>
         
                </div>
                <div className='contentImage'>
                   <img src={""} className='imagen' />
                </div>
            </div>




            <div className="right-panel">
                <div className="right-panel-content">
                    <div className='formSecundarioBTN'>
                        <button className='buttonPrincipalGlobal' onClick={InsertUser}>Psicología</button>
                        <button className='buttonPrincipalGlobal' onClick={ModifyUser}>Enfermería</button>
                        <button className='buttonPrincipalGlobal' onClick={DeleteUser}>Estadística General</button>
                        <button className='buttonPrincipalGlobal' onClick={DeleteUser}>Agregar Usuarios</button>
                        <button className='buttonPrincipalGlobal' onClick={DeleteUser}>Talleres</button>
                        <button className='buttonPrincipalGlobal' onClick={GoLogOut}>Cerrar Sesión</button>

                    </div>

                    <div className='table_container'>
                        <h1 className='titleForm'>Enfermeria {Rol}</h1>
                        <div className="TABLA" style={{ overflowY: 'auto', maxHeight: '600px', maxWidth: '800px' }}>
                        <table className='table'>

                            <thead>
                                <tr>
                                    <th>Consulta</th>
                                    <th>Expediente</th>
                                    <th>ID de Usuario</th>
                                    <th>Centro</th>
                                    <th>Nombre</th>
                                    <th>Apellido Paterno</th>
                                    <th>Apellido Materno</th>
                                    <th>Edad</th>
                                    <th>Telefono</th>

                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.UserID}>
                                        <td style={{ width: '30px' }}>
                                            <Link to="/Salud-Consulta-ID" state={{userDetails: user}}>
                                                <FaPlus />
                                            </Link>
                                        </td>
                                        <td style={{ width: '30px' }}>
                                            <Link to="/Salud-Expediente-ID" state={{userDetails: user}}>
                                                <FaPlus />
                                            </Link>
                                        </td>
                                        <td>{user.UserID}</td>
                                        <td>{user.CentroID}</td>
                                        <td>{user.Nombre}</td>
                                        <td>{user.ApellidoPaterno}</td>
                                        <td>{user.ApellidoMaterno}</td>
                                        <td>{user.Edad}</td>
                                        <td>{user.Telefono}</td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


        </body>
    );
};

export default MenuEnfermeria;
