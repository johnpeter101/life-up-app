import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import backendUrl from '../../../serverConfig';
import '../../../GlobalStyles/Resources.css';
import logo from '../../../GlobalStyles/images/logo.svg';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MenuTalleres = () => {
    const routeLocation = useLocation();
    const ID = routeLocation.state && routeLocation.state.ID_PERSONAL;
    const Rol = routeLocation.state && routeLocation.state.Rol;
    const ID_Personal = routeLocation.state && routeLocation.state.ID_PERSONAL;
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [copiedPersonalID, setCopiedPersonalID] = useState('');
    const [IDTaller, setIdTaller] = useState('');
    const [tallerDetails, setTallerDetails] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingTaller, setEditingTaller] = useState(null);



    const handleRowClick = async (personalID, idTaller) => {
        navigator.clipboard.writeText(personalID);
        setCopiedPersonalID(personalID);
        Swal.fire({
            icon: 'success',
            title: 'Copiado',
            text: personalID + ' copiado al portapapeles',
            showConfirmButton: false,
            timer: 800,
        });
        try {
            const response = await fetch(backendUrl + `/api/VerificarTallerID${idTaller}`);
            const data = await response.json();

            // Pasa los datos del taller al estado local
            setTallerDetails(data);

            // Redirige a la página de actualización con detalles del taller
            navigate('/Taller-Update', { state: { tallerDetails: data } });
        } catch (error) {
            console.error('Error al obtener datos del taller:', error.message);
        }
    };
    

    const regresar = () => {
        navigate('/MenuApp', { state: { ID_PERSONAL: ID, Rol: Rol } });
    };

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await fetch(backendUrl + '/api/tableTalleres');
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

        const getTalleresInfoID = async () => {
            axios.get(backendUrl + '/api/getIDTalleres')
                .then(response => {
                    const data = response.data;
                    const numeroTaller = data.NumeroTaller;
                    setIdTaller(numeroTaller);
                })
                .catch(error => {
                    console.error(error);
                });
        };

        fetchUsers();
        getTalleresInfoID();
    }, [navigate]);

    const InsertUser = () => {
        navigate("/addUserPersonal", { state: { ID_PERSONAL: ID } });
    };

    const GoLogOut = () => {
        navigate("/loader-Login");
    };

    const DeleteUser = () => {
        navigate("/DeleteUserPersonal");
    };

    const ModifyUser = () => {
        navigate("/EditUserPersonal");
    };

    const AddTaller = () => {
        navigate("/Taller-Add-Form", { state: { NumTaller: IDTaller } });
    };

    const ModifyTaller = () => {
        navigate("/Taller-Update");
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
    function msgDelete(user) {
        Swal.fire({
            title: '¿Deseas eliminar al siguiente taller? ' + user.Nombre,
            html: '<div style="text-align: left;"><strong>ID:  </strong>' + user.TallerID + '</div><div style="text-align: left;"><strong>Centro:  </strong>' + user.CentroID + '</div><div style="text-align: left;"><strong>Instructor:  </strong>' + user.Instructor + '</div><div style="text-align: left;"><strong>Duracion:  </strong>' + user.Duracion + '</div><div style="text-align: left;"><strong>Dias:  </strong>' + user.Dias + '</div>',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            denyButtonText: 'No, cancelar',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire('Eliminado', '', 'success')
                //eliminar
                EliminarTaller(user.TallerID);
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }
    function EliminarTaller(id) {
        const requestData = {
            ID: id
        };

        axios.post(backendUrl + '/api/TallerDelete', requestData)
            .then(response => {
                // Manejar la respuesta del servidor si es necesario
                console.log(response.data);
                if (response.status === 200) {
                    AlertaTimer('success', 'Completado', 'Se ha eliminado correctamente', 1500);
                    window.location.reload();
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
                <img src={logo} className='logo' />
                <div className='contTitleLeft' >
                    <label className='labelPanelLeft'><strong>Talleres y actividades</strong></label>
                    <div className='line'></div>
                </div>
                <div className='contMenu' >
                    <div className='optionBtn' onClick={AddTaller}>
                        <label className='txtBTN'>Agregar </label>
                    </div>
                    <div className='optionBtn' onClick={regresar}>
                        <label className='txtBTN'>Volver al menu</label>
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
                        <h1 className='titleForm'>Talleres {Rol}</h1>
                        <div className="TABLA" style={{ overflowY: 'auto', maxHeight: '400px' }}>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Editar</th>
                                    <th>Eliminar</th>
                                    <th>ID de Taller</th>
                                    <th>Nombre</th>
                                    <th>Centro</th>
                                    <th>Instructor</th>
                                    <th>Duración</th>
                                    <th>Días</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.TallerID}>
                                        <td>
                                        <Link to="/Taller-Update" state={{ tallerDetails: user }}>
                                            <FaEdit />
                                        </Link>
                                        </td>
                                        <td onClick={() => msgDelete(user)}>
                                            <FaTrash />
                                        </td>
                                        <td>{user.TallerID}</td>
                                        <td>{user.Nombre}</td>
                                        <td>{user.CentroID}</td>
                                        <td>{user.Instructor}</td>
                                        <td>{user.Duracion}</td>
                                        <td>{user.Dias}</td>
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

export default MenuTalleres;
