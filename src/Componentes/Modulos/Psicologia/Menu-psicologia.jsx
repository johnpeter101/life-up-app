//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> IMPORTS 
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation  } from "react-router-dom";
import backendUrl from '../../../serverConfig';
import '../../../GlobalStyles/Resources.css';
import logo from '../../../GlobalStyles/images/logo.svg';
import imagen from '../../../GlobalStyles/images/image1.png';
import GenderChart from '../Widgets/Graficos/GraficaPastelSexos'; // Asegúrate de importar el componente adecuadamente
import LineChart from '../Widgets/Graficos/GraficoLineasRegistroUsuarios'; // Ajusta la ruta del archivo según tu estructura de carpetas
import WidgetPersonalInformation from '../Widgets/CardUserPersonal';
import { FaEdit, FaCopy, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

/*--------------------------------------------------------  FUNCION PRINCIPAL  -------------------------------------------------------------- */
const MenuPsicologia = () => {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> DECLARACIONES 
    const routeLocation = useLocation();
    const ID_Personal = routeLocation.state && routeLocation.state.ID_PERSONAL;
    const Rol =  routeLocation.state && routeLocation.state.Rol;
    const [users, setUsers] = useState([]);
    const [psicologiaData, setPsicologia] = useState([]);
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

    const [Motivo, setMotivo] = useState("Motivo");
    const [Objetivos, setObjetivos] = useState("Objetivos");
    const [Recomendaciones, setRecomendaciones] = useState("Recomendaciones");
    const [FechaConsulta, setFechaConsulta] = useState("FechaConsulta");
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
   
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
    const getConsultaInfo = async (ID) => {
        try {
            // Datos a enviar
            const formData = {
                ID
            };

            // Petición al servidor
            const response = await axios.post(backendUrl + '/api/tableAllPsicologia', formData);

            // Manejar la respuesta del servidor si es necesario
            const consultaData = response.data;

            // Actualizar el estado con los datos de la consulta
            setMotivo(consultaData.Motivo);
            setObjetivos(consultaData.Objetivos);
            setRecomendaciones(consultaData.Recomendaciones);
            setFechaConsulta(consultaData.FechaConsulta);

        } catch (error) {
            // Manejar errores si ocurre alguno
            console.error('Error al obtener los datos de la consulta:', error.message);
        }
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
 const regresar = () => {
     navigate('/MenuApp', { state: { ID_PERSONAL: ID_Personal, Rol: Rol} });
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> USE EFFECT()
    useEffect(() => {
    //Obtener tabla de usuarios
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

    const fetchConsultaPsicologia = async () => {
        try {
            const response = await fetch(backendUrl + '/api/tableAllPsicologia');
            const responseData = await response.json();
            if (response.ok) {
                setPsicologia(responseData);
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
            const response = await fetch(backendUrl + '/api/widgets-Get-Psicologia');
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

    fetchConsultaPsicologia();
    getDistribucionSexo();
    getDistribucionFechas();
    fetchUsers();
    getConsultaInfo();
    }, []);

    //usuarios
    function NuevaConsulta() {
        navigate("/PsicologiaNewConsultID",  { state: { ID_PERSONAL: ID} });
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
    const filteredUsers = users.filter(user =>
        Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    const filteredMotivo = users.filter(Motivo =>
        Object.values(Motivo).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    return (
        <body>
            <div className="left-panel">
                <img src={logo} className='logo' />
                <div className='contTitleLeft' >
                    
                    <label className='labelPanelLeft'><strong>PSICOLOGÍA</strong></label>
                    <div className='line'></div>
                </div>
                <div className='contMenu' >
                   
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
                    <button className='buttonPrincipalGlobal' onClick={""}>Agregar usuario</button>
                    <button className='buttonPrincipalGlobal' onClick={""}>Eliminar usuario</button>
                    <button className='buttonPrincipalGlobal' onClick={""}>Volver </button>
         
                </div>
                <div class="containerTotal">
                    <div class="WIDGET-1">
                        <LineChart
                            color={'#477BFF'}
                            titulo={"Registro de consultas"}
                            descripcion={"Pacientes tratados"}
                            titleX={"Meses"}
                            titleY={"Consultas"}
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
                            Direccion={Direccion}
                            Sexo={Sexo}
                            Fecha={Fecha}
                            Familiar={Familiar}
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
                        <div className="TABLA" style={{ overflowY: 'auto', maxHeight: '250px'}}>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th>Centro</th>
                                    <th>Nombre</th>
                                    <th>Apellido Paterno</th>
                                    <th>Apellido Materno</th>                               
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.UserID} onClick={() => handleRowClick(user)}>
                                        <td onClick={() => handleCopied(user.UserID)}><FaCopy /> </td>
                                            <td>
                                                <Link to="/PsicologiaNewConsultID" state={{ userDetails: user }}>
                                                    <FaPlus />
                                                </Link>
                                            </td>
                                        <td>{user.CentroID}</td>
                                        <td>{user.Nombre}</td>
                                        <td>{user.ApellidoPaterno}</td>
                                        <td>{user.ApellidoMaterno}</td>
                                        <td>{user.Fecha}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                        <h1 className='titleForm'>Consultas</h1>

                        <div className="TABLA" style={{ overflowY: 'auto', maxHeight: '300px' }}>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Motivo</th>
                                    <th>Objetivos</th>
                                    <th>Recomendaciones</th>                               
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {psicologiaData.map((psicoData) => (
                                    <tr key={psicoData.Numero}>
                                        <td>{psicoData.UserID}</td>
                                        <td>{psicoData.Motivo}</td>
                                        <td>{psicoData.Objetivos}</td> 
                                        <td>{psicoData.Recomendaciones}</td>
                                        <td>{psicoData.Fecha}</td>
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

export default MenuPsicologia;
