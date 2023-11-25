import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import backendUrl from '../../serverConfig';
import '../../GlobalStyles/Resources.css';
import './styleDash.css';
import logo from '../../GlobalStyles/images/logo.svg';
import { FaEdit, FaCopy, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import axios from 'axios';

const PanelAdmin = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [copiedPersonalID, setCopiedPersonalID] = useState('');
    const [PersonalID, setPersonalId] = useState('');
    const handleCopied = (personalID) => {
        // Copiar al portapapeles
        navigator.clipboard.writeText(personalID);
        setCopiedPersonalID(personalID);
        Swal.fire({
            icon: 'success',
            title: 'Copiado',
            text: personalID + ' copiado al portapapeles',
            showConfirmButton: false,
            timer: 800
        });
    };
    const { personalID } = useParams();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(backendUrl + '/api/tableRol');
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
    }, [personalID],[personalID]);


    function GoAddUser() {
        navigate('/FormularioPersonal');
    }

    function GoLogOut() {
        navigate('/LoginSU');
    }

 
    const ModifyUser = (personalID) => {
        navigate(`/EditUserPersonal/${personalID}`);
    };
    function Alerta(icono, titulo, texto) {
        Swal.fire({
            icon: icono,
            title: titulo,
            text: texto,
            confirmButtonColor: '#4CAF50',
            confirmButtonText: 'Aceptar'
        })
    }
    function AlertaTimer(icono, titulo, texto, tiempo) {
        Swal.fire({
            position: 'center',
            icon: icono,
            title: titulo,
            text: texto,
            showConfirmButton: false,
            timer: tiempo
        })
    }

    //dellete function
    function msgDelete(user) {
        Swal.fire({
            title: '¿Deseas eliminar al siguiente usuario?' + user.PersonalID,
            html: '<div style="text-align: left;"><strong>ID:  </strong>' + user.PersonalID + '</div><div style="text-align: left;"><strong>Rol designado:  </strong>' + user.Rol + '</div><div style="text-align: left;"><strong>Email:  </strong>' + user.Email + '</div><div style="text-align: left;"><strong>Centro:  </strong>' + user.ID_Centro + '</div><div style="text-align: left;"><strong>Acceso:  </strong>' + user.Acceso + '</div>',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            denyButtonText: 'No, cancelar',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire('Eliminado', '', 'success')
                //eliminar
                DeleteUser(user.PersonalID);
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }
    function DeleteUser(id) {
        const requestData = {
            ID: id
        };

        axios.post(backendUrl + '/api/DeleteUserPersonal', requestData)
            .then(response => {
                // Manejar la respuesta del servidor si es necesario
                console.log(response.data);
                if (response.status === 200) {
                    AlertaTimer('success', 'Completado', 'Se ha eliminado correctamente', 1500);
                    navigate("/loader-DashboardSU");
                } else {
                    // Autenticación fallida
                    Alerta('error', 'Sin éxito', 'Falló al eliminar la información');
                }
            })
            .catch(error => {
                // Manejar errores si ocurre alguno
                console.error(error);
            });

    }


    return (
        <body>
            <div className="left-panel">
                <img src={logo} className="logo" />
                <div className="contTitleLeft">
                    <label className="labelPanelLeft">Menu de Administrador</label>
                    <div className="line"></div>
                </div>
                <div className="contMenu">
                    <div className="optionBtn" onClick={GoAddUser}>
                        <label className="txtBTN">Agregar personal</label>
                    </div>
                 
                    <div className="optionBtn" onClick={GoLogOut}>
                        <label className="txtBTN">Cerrar sesión</label>
                    </div>
                </div>
                <div className="contentImage">
                    <img src={""} className="imagen" />
                </div>
            </div>

            <div className="right-panel">
                <div className="right-panel-content">
                    <div className="formSecundarioBTN">
                        <button className="buttonPrincipalGlobal" onClick={GoAddUser}>Agregar personal</button>
                        <button className="buttonPrincipalGlobal" onClick={ModifyUser}>Modificar personal</button>
                        <button className="buttonPrincipalGlobal" onClick={DeleteUser}>Eliminar personal</button>
                        <button className="buttonPrincipalGlobal" onClick={GoLogOut}>Cerrar Sesión</button>
                    </div>

                    <div className="table_container">
                        <h1 className="titleForm">Personal registrado</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th>ID de Personal</th>
                                    <th>Rol</th>
                                    <th>ID Centro</th>
                                    <th>Email</th>
                                    <th>Acceso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.PersonalID}>
                                        <td onClick={() => handleCopied(user.PersonalID)}><FaCopy /></td>
                                        <td>
                                            <Link to={`/EditUserPersonal/${user.PersonalID}`}>
                                                <FaEdit />
                                            </Link>
                                        </td>
                                        <td onClick={() => msgDelete(user)}>
                                            <FaTrash />
                                        </td>
                                        <td>{user.PersonalID}</td>
                                        <td>{user.Rol}</td>
                                        <td>{user.ID_Centro}</td>
                                        <td>{user.Email}</td>
                                        <td>{user.Acceso}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </body>
    );
};

export default PanelAdmin;
