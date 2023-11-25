/* eslint-disable no-unused-vars */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> IMPORTS 
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from "react-router-dom";
import backendUrl from '../../../serverConfig';
import '../../../GlobalStyles/Resources.css';
import logo from '../../../GlobalStyles/images/logo.svg';
import imagen from '../../../GlobalStyles/images/image1.png';
import '../Widgets/styles/test.css';
import axios from 'axios';
import GenderChart from '../Widgets/Graficos/GraficaPastelSexos'; // Asegúrate de importar el componente adecuadamente
import LineChart from '../Widgets/Graficos/GraficoLineasRegistroUsuarios'; // Ajusta la ruta del archivo según tu estructura de carpetas
import WidgetPersonalInformation from '../Widgets/CardUserPersonal';
import { FaEdit, FaCopy, FaTrash, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';




/*--------------------------------------------------------  FUNCION PRINCIPAL  -------------------------------------------------------------- */
const MenuUsers = () => {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> DECLARACIONES 
    const routeLocation = useLocation();
    const ID = routeLocation.state && routeLocation.state.ID_PERSONAL;
    const Rol = routeLocation.state && routeLocation.state.Rol;
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    
    const [copiedPersonalID, setCopiedPersonalID] = useState('');
    const [Nombre, setNombre] = useState("Nombre");
    const [Direccion, setDireccion] = useState("Dirección");
    const [Sexo, setSexo] = useState("Sexo");
    const [Fecha, setFecha] = useState("Fecha de ingreso");
    const [Familiar, setFamiliar] = useState("Familiar");
    const [Edad, setEdad] = useState("Edad");
    const [Telefono, setTelefono] = useState("Telefono");
    const [URL_photo, setPhotoUrl] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");
    const [datosSexo, setDatosSexos] = useState("Telefono");
    const [datosFechas, setDatosFechas] = useState("Telefono");
    const [showModifyUser, setShowModifyUser] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> FUNCIONES 
    const handleRowClick = async (user) => {
        // Mostrar los detalles del usuario en la parte derecha
        setNombre(user.Nombre);
        setDireccion(user.Direccion);
        setSexo(user.Sexo);
        setFamiliar(user.Familiar);
        setEdad(user.Edad);
        setTelefono(user.Telefono);
        setFecha(user.Fecha);
        setCopiedPersonalID(user.UserID);

        // Obtener la foto del usuario
        getPhoto(user.UserID);
        setSelectedUser(user);

    };
   
    const navigateToUpdate = (personalID) => {
        navigate("/UpdateUsuarios", { state: { ID_PERSONAL: personalID, Rol: Rol } });
    };

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
        })
    };

    const getInfoCard = async (ID) => {
        //datos a enviar
        const formData = {
            ID
        };
        //peticion al server
        axios.post(backendUrl + '/api/getWidgetInfo', formData)
            .then(response => {
                // Manejar la respuesta del servidor si es necesario
                setNombre(response.data.Nombre);
                setDireccion(response.data.Direccion);
                setSexo(response.data.Sexo);
                setFamiliar(response.data.Familiar);
                setEdad(response.data.Edad);
                setTelefono(response.data.Telefono);
                setFecha(response.data.Fecha);
            })
            .catch(error => {
                // Manejar errores si ocurre alguno
                console.error(error);
            });
    };

    const getPhoto = (ID) => {
        const formData = {
            ID
        };
        // Función para obtener la foto del usuario
        //peticion al server
        axios.get(backendUrl + '/api/ObtenerFoto',
            {
                responseType: 'blob',
                params: formData,
            })
            .then(response => {
                // Convertir la respuesta binaria a una URL de objeto blob
                const blob = new Blob([response.data], { type: 'image/jpeg' });
                const url = URL.createObjectURL(blob);

                // Actualizar el estado con la URL de la foto
                setPhotoUrl(url);

                // Mostrar una notificación de éxito utilizando SweetAlert2

            })
            .catch(error => {
                // Mostrar una notificación de error utilizando SweetAlert2

                console.error(error);
            });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> NAVIGATES
    const regresar = () => { navigate('/MenuApp', { state: { ID_PERSONAL: ID, Rol: Rol } }); };

    function InsertUser() { navigate("/addUserPersonal", { state: { ID_PERSONAL: ID, Rol: Rol } }); }

    const DeleteUser = () => { navigate("/MouleUserDelete" , { state: { ID_PERSONAL: ID, Rol: Rol } }); }

    function GoLogOut() { navigate("/loader-Login");}

    const UpdateUser = () => {navigate("/UpdateUsuarios"); }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> USE EFFECT() 
   
    useEffect(() => {
        //Obtener tabla de usuarios
        const fetchUsers = async () => {
            try {
                const response = await fetch(backendUrl + '/api/tableUsers');
                const responseData = await response.json();
                console.log(response.data);
                if (response.ok) {
                    setUsers(responseData);
                } else {
                    console.error('Error al obtener los datos de usuarios');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error.message);
            }
        };
        //Obtener el json de sexos
        const getDistribucionSexo = async () => {
            try {
                const response = await fetch(backendUrl + '/api/widgets-Get-sexos');
                const responseData = await response.json();
                if (response.ok) {
                    setDatosSexos(responseData);
                } else {
                    console.error('Error al obtener los datos de usuarios');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error.message);
            }
        };
        //obtener el json de ffechas
        const getDistribucionFechas = async () => {
            try {
                const response = await fetch(backendUrl + '/api/widgets-Get-Fechas');
                const responseData = await response.json();
                if (response.ok) {
                    setDatosFechas(responseData);
                } else {
                    console.error('Error al obtener los datos de usuarios');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error.message);
            }
        };

        getDistribucionSexo();
        getDistribucionFechas();
        fetchUsers();
    }, []);
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
            title: '¿Deseas eliminar al siguiente Usuario? ' + user.UserID,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            denyButtonText: 'No, cancelar',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire('Eliminado', '', 'success')
                //eliminar
                EliminarTaller(user.UserID);
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }
    function EliminarTaller(id) {
        const requestData = {
            ID: id
        };
        axios.post(backendUrl + '/api/DeleteUser', requestData)
            .then(response => {
                console.log(response.data);
                if (response.status === 200) {
                    AlertaTimer('success', 'Completado', 'Se ha eliminado correctamente', 1500);
                    window.location.reload();
                } else {
                    Alerta('error', 'Sin éxito', 'Falló al eliminar la información');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> RETURN () 
    return (
        <body>
            <div className="left-panel">
                <img src={logo} className='logo' />
                <div className='contTitleLeft' >
                    <label className='labelPanelLeft'><strong>USUARIOS</strong></label>
                    <div className='line'></div>
                </div>
                <div className='contMenu' >
                    <div className='optionBtn' onClick={InsertUser}>
                        <label className='txtBTN'>Agregar usuario</label>
                    </div>
                    <div className='optionBtn' onClick={regresar}>
                        <label className='txtBTN'>Volver</label>
                    </div>
                </div>
                <div className='contentImage'>
                   <img src={""} className='imagen' />
                </div>
            </div>
            <div className="right-panel">
                <div className='formSecundarioBTN'>
                    <button className='buttonPrincipalGlobal' onClick={InsertUser}>Agregar usuario</button>
                    <button className='buttonPrincipalGlobal' onClick={regresar}>Volver </button>
         
                </div>
                <div class="containerTotal">
                    <div class="WIDGET-1">
                        <LineChart
                            color={'#477BFF'}
                            titulo={"Registro de usuarios"}
                            descripcion={"Comportamiento de la alta de usuarios"}
                            titleX={"Meses"}
                            titleY={"Usuarios"}
                            datos={datosFechas}
                        />
                    </div>
                    <div class="WIDGET-2">
                        <GenderChart
                            color1={'#477BFF'}
                            color2={'#47D1CB'}
                            hole={0.5}
                            titulo={"Distribución de sexo"}
                            datos={datosSexo}
                            Graphic3D={false}
                        />
                    </div>
                    <div class="CARD">
                        <WidgetPersonalInformation
                            Nombre={Nombre}
                            Sexo={Sexo}
                            Fecha={Fecha}
                            Edad={Edad}
                            Telefono={Telefono}
                            ID_user={copiedPersonalID}
                            ImageURL={URL_photo}
                        />
                    </div>
                    
                    <div class="TABLA">
                        <h1 className='titleForm'>Usuarios registrados {Rol} </h1>
                        <div className="search-box" style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            borderBottom: '1px solid #ccc',
                            padding: '5px',
                            marginBottom: '10px'
                        }}>
                            <FaSearch style={{ marginRight: '5px', color: '#777' }} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre de usuario"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    flex: '1',
                                    border: 'none',
                                    outline: 'none',
                                    padding: '8px',
                                    backgroundColor: 'transparent',
                                    color: '#000'
                                }}
                            />
                        </div>

                        
                        <div className="TABLA" style={{ overflowY: 'auto', maxHeight: '300px' }}>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th style={{ width: '30px' }}></th>
                                        <th style={{ width: '30px' }}></th>
                                        <th style={{ width: '30px' }}></th>
                                        <th style={{ width: '100px' }}>ID de Usuario</th>
                                        <th style={{ width: '100px' }}>Centro</th>
                                        <th style={{ width: '150px' }}>Nombre</th>
                                        <th style={{ width: '150px' }}>Apellido Paterno</th>
                                        <th style={{ width: '150px' }}>Apellido Materno</th>
                                        <th style={{ width: '50px' }}>Edad</th>
                                        <th style={{ width: '100px' }}>Telefono</th>
                                        <th style={{ width: '80px' }}>Sexo</th>
                                        <th style={{ width: '100px' }}>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.UserID} onClick={() => handleRowClick(user)}>
                                            <td style={{ width: '30px' }} onClick={() => handleCopied(user.UserID)}><FaCopy /></td>
                                            <td style={{ width: '30px' }}>
                                                <Link to="/UpdateUsuarios" state={{ userDetails: user }}>
                                                    <FaEdit />
                                                </Link>
                                            </td>
                                            <td style={{ width: '30px' }} onClick={() => msgDelete(user)}>
                                                <FaTrash />
                                            </td>
                                            <td style={{ width: '100px' }}>{user.UserID}</td>
                                            <td style={{ width: '100px' }}>{user.CentroID}</td>
                                            <td style={{ width: '150px' }}>{user.Nombre}</td>
                                            <td style={{ width: '150px' }}>{user.ApellidoPaterno}</td>
                                            <td style={{ width: '150px' }}>{user.ApellidoMaterno}</td>
                                            <td style={{ width: '50px' }}>{user.Edad}</td>
                                            <td style={{ width: '100px' }}>{user.Telefono}</td>
                                            <td style={{ width: '80px' }}>{user.Sexo}</td>
                                            <td style={{ width: '100px' }}>{user.Fecha}</td>
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

export default MenuUsers;
