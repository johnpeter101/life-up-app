import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from "react-router-dom";
import backendUrl from '../../../../serverConfig';

import '../../../../GlobalStyles/Resources.css';

import logo from '../../../../GlobalStyles/images/logo.svg';
import imagen from '../../../../GlobalStyles/images/image1.png';


const MenuConsultas = () => {
    const routeLocation = useLocation();
    const Rol = routeLocation.state && routeLocation.state.Rol;
    const ID_Personal = routeLocation.state && routeLocation.state.ID_PERSONAL;

    const [users, setUsers] = useState([]);
    const [Nombre, setNombre] = useState([]);
    const navigate = useNavigate();
    const [copiedPersonalID, setCopiedPersonalID] = useState('');
    const [FrecuenciaCardiaca, setFrecuenciaCardiaca] = useState("FrecuenciaCardiaca");
    const [Motivo, setMotivo] = useState("FrecuenciaCardiaca");
    const [FrecuenciaRespiratoria, setFrecuenciaRespiratoria] = useState("FrecuenciaRespiratoria");
    const [Glucosa, setGlucosa] = useState("Glucosa");
    const [SatOxigeno, setSatOxigeno] = useState("SatOxigeno");
    const [PresionArterial, setPresionArterial] = useState("PresionArterial");
    const [Medicacion, setMedicacion] = useState("Medicacion");
    const [Fecha, setFecha] = useState("Fecha");
    const [NumeroConsulta, setNumeroConsulta] = useState("NumeroConsulta");
    const handleRowClick = (personalID) => {
        // Copiar al portapapeles
        navigator.clipboard.writeText(personalID);
        setCopiedPersonalID(personalID);
        Swal.fire({
            icon: 'success',
            title: 'Copiado',
            text: personalID + ' copiado al portapapeles',
            showConfirmButton: false,
            timer: 800

        })
    };

    const regresar = () => { navigate(-1); }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(backendUrl + '/api/tableAllConsultas');
                const responseData = await response.json();
                setFrecuenciaCardiaca(responseData.FrecuenciaCardiaca);
                setMotivo(responseData.Motivo);
                setFrecuenciaRespiratoria(responseData.FrecuenciaRespiratoria);
                setGlucosa(responseData.Glucosa);
                setSatOxigeno(responseData.SatOxigeno);
                setPresionArterial(responseData.PresionArterial);
                setMedicacion(responseData.Medicacion);
                setFecha(responseData.Fecha);
                setNumeroConsulta(responseData.NumeroConsulta);
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
        navigate("/addUserPersonal", { state: { ID_PERSONAL: ID } });
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
        navigate("/Salud-Expediente-ID", { state: { ID_PERSONAL: ID } });
    }
    const Consulta = () => {
        navigate("/Salud-Consulta-ID", { state: { ID_PERSONAL: ID } });
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

                    <label className='labelPanelLeft'><strong>CONSULTAS</strong></label>
                    <div className='line'></div>
                </div>
                <div className='contMenu' >
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

                    <div className='table_container'>
                        <h1 className='titleForm'>Enfermeria {Rol}</h1>
                        <div className="TABLA" style={{ overflowY: 'auto', maxHeight: '400px' }}>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>ID de Usuario</th>
                                    <th>Fre. Car.</th>
                                    <th>Fre. Res.</th>
                                    <th>Glucosa</th>
                                    <th>Sat. Oxigeno</th>
                                    <th>Pre. Arte</th>
                                    <th>Medicacion</th>
                                    <th>Fecha</th>
                                    <th>Num. Consulta</th>

                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.UserID} onClick={() => handleRowClick(user.UserID)}>
                                        <td>{user.UserID}</td>
                                        <td>{user.FrecuenciaCardiaca}</td>
                                        <td>{user.FrecuenciaRespiratoria}</td>
                                        <td>{user.Glucosa}</td>
                                        <td>{user.SatOxigeno}</td>
                                        <td>{user.PresionArterial}</td>
                                        <td>{user.Medicacion}</td>
                                        <td>{user.Fecha}</td>
                                        <td>{user.NumeroConsulta}</td>
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

export default MenuConsultas;
