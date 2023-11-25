import React, { useState, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import backendUrl from '../../serverConfig';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { calculateHash } from '../../hashUtils';
import Swal from 'sweetalert2';

import { button, TextField } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { useSpring, animated } from 'react-spring';


import '../../GlobalStyles/Resources.css';
import './styleAdd.css';

import logo from '../../GlobalStyles/images/logo.svg';
import imagen from '../../GlobalStyles/images/image1.png';
import { useParams } from 'react-router-dom';


const EditSuperUsuario = () => {
    const fade = useSpring({ opacity: 1, from: { opacity: 0 } });

    //////////////////////////////////////////////////////////////---------------> Variables a utilizar
    const [PersonalID, setPersonalId] = useState('');
    const [Rol, setRol] = useState('');
    const [ID_Centro, setCentroId] = useState('');
    const [Email, setEmail] = useState('');
    const [pass, setpass] = useState(''); //pass sin hash
    const [Password, setPassword] = useState('');
    const [OldPass, setOldPass] = useState('');
    const [Acceso, setAcceso] = useState('');
    const [NumUsuario, setNumUs] = useState('');
    const [centros, setCentros] = useState([]);
    const [showButtons, setShowButtons] = useState(false);
    const [validated, setValidated] = useState(false);
    const [showDiv, setShowDiv] = useState(true);
    const [passPDF, setPassPDF] = useState('');
    const [Indice, setIndice] = useState('');
    const [User_ID, setUserID] = useState('');

    const navigate = useNavigate();

    const { personalID } = useParams();


    //////////////////////////////////////////////////////////////---------------> Function para construir PDF
    function obtenerPDF(contraseña){

    }
    
    const handleDownloadPDF = async () => {
        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        // Definir propiedades del documento
        const pageSize = page.getSize();
        const pageWidth = pageSize.width;
        const pageHeight = pageSize.height;

        // Definir las posiciones de los campos en el PDF
        const x = 50;
        let y = pageHeight - 70;

        // Agregar los campos al PDF
        const defaultFontSize = 12;
        const fieldMargin = 10;

        const addFormField = (label, value) => {
            page.drawText(`${label}:`, {
                x,
                y,
                size: defaultFontSize,
                color: rgb(0, 0, 0),
            });

            page.drawText(value, {
                x: x + 100,
                y,
                size: defaultFontSize,
                color: rgb(0, 0, 0),
            });

            y -= defaultFontSize + fieldMargin;
        };

        if(pass > 0){
            setPassPDF(pass);

        }
        else{
            setPassPDF('Utilizar la misma contraseña, no se actualizó');
        }
        addFormField('ID de Personal', PersonalID);
        addFormField('Rol', Rol);
        addFormField('ID Centro', ID_Centro);
        addFormField('Email', Email);
        addFormField('Password', passPDF);
        addFormField('Acceso', Acceso);

        // Generar el PDF en formato bytes
        const pdfBytes = await pdfDoc.save();

        // Crear un objeto Blob y generar una URL para el archivo PDF
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Crear un enlace de descarga y hacer clic automáticamente
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Comprobante - ' + User_ID + '.pdf';
        link.click();

        Alerta('success', 'Datos generados', 'Se descargó correctamente')
    };


    //////////////////////////////////////////////////////////////---------------> USE EFFECT()
    useEffect(() => {
        if (personalID) {
            setPersonalId(personalID);
        }
        //-----------------------------------------------> Obtener los datos de los centros del servidor al cargar el componente
        const fetchCentro = async () => {
            try {
                const response = await fetch(backendUrl + '/api/GetCentros');
                const responseData = await response.json();
                if (response.ok) {
                    setCentros(responseData);
                } else {
                    console.error('Error al obtener los datos de usuarios');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error.message);
            }
        };


        //-----------------------------------------------> Obtener el numero de usuarios
        const fetchNumUser = async () => {
            try {
                const response = await fetch(backendUrl + '/api/GetNumUser');
                const responseData = await response.json();
                if (response.ok) {
                    const numUs = responseData.Indice; // Reemplaza "numUs" con el nombre de la propiedad adecuada en "responseData"
                    setNumUs(numUs);//obten el numero de usuario ultimo
                } else {
                    console.error('Error al obtener los datos de usuarios');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error.message);
            }
        };

        //llamar a los métodos anteriores
        fetchCentro();
        fetchNumUser();
    }, [personalID]);

    //////////////////////////////////////////////////////////////---------------> Funcion de crear ID de usuario
    function CrearID(idCentro, NumUsuario) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const lastTwoDigits = currentYear % 100;
        //id de personal = ID_Centro + P + Año + Numero de usuario
        const ID = idCentro + "P" + lastTwoDigits + (NumUsuario + 1);
        setPersonalId(ID);
        setIndice(NumUsuario + 1);
        setUserID(ID);
    }

    //////////////////////////////////////////////////////////////---------------> Metodo para hacer el envío del formulario
    const handleSubmit = () => {
        // Envía los datos al servidor
        // Crear un objeto con los datos del formulario
        const formData = {
            PersonalID,
            Rol,
            ID_Centro,
            Email,
            Password,
            Acceso
        };

        const Data = {
            Indice,
            User_ID
        }


        // Enviar los datos al servidor utilizando Axios
        axios.post(backendUrl + '/api/AddUser', formData)
            .then(response => {
                // Manejar la respuesta del servidor si es necesario
                console.log(response.data);
                if (response.status === 200) {
                    // Autenticación exitosa, puedes redirigir al usuario a otra página
                    //Alerta(icono, titulo, texto) ('Inicio de sesión exitoso');
                    //            navigate("/loader-DashboardSU");

                    //navigate("/loader-DashboardSU");




                } else {
                    // Autenticación fallida
                    Alerta('error', 'Sin éxito', 'Falló al registrar la información');
                }
            })
            .catch(error => {
                // Manejar errores si ocurre alguno
                console.error(error);
            });

        // increment a user
        axios.post(backendUrl + '/api/IncrementUSerNum', Data)
            .then(response => {
                // Manejar la respuesta del servidor si es necesario
                console.log(response.data);
                if (response.status === 200) {
                    // Autenticación exitosa, puedes redirigir al usuario a otra página
                    //Alerta(icono, titulo, texto) ('Inicio de sesión exitoso');
                    //            navigate("/loader-DashboardSU");
                    Alerta('success', 'Completado', 'Se ha reistrado correctamente');
                    navigate("/loader-DashboardSU");
                } else {
                    // Autenticación fallida
                    Alerta('error', 'Sin éxito', 'Falló al registrar la información');
                }
            })
            .catch(error => {
                // Manejar errores si ocurre alguno
                console.error(error);
            });




        ///---------------------Incrementar el numero de usuario
    };

    //////////////////////////////////////////////////////////////---------------> Metodo para manejar el cambio de estado del combo de Rol
    const handleRolChange = (e) => {
        const selectedRol = e.target.value;
        setRol(selectedRol);

        // Verificar el rol seleccionado y ajustar el campo de acceso
        if (selectedRol === 'Psicología') {
            setAcceso('ÁREA DE PSICOLOGÍA');
        } else if (selectedRol === 'Enfermería') {
            setAcceso('ÁREA DE ENFERMERÍA');
        } else if (selectedRol === 'Instructor') {
            setAcceso('ÁREA DE TALLERES Y ACTIVIDADES');
        } else if (selectedRol === 'Administración') {
            setAcceso('TODAS LAS ÁREAS');
        } else if (selectedRol === 'Recepción') {
            setAcceso('ÁREA DE REGISTRO DE USUARIOS');
        } else {
            setAcceso('');
        }
    };

    //////////////////////////////////////////////////////////////---------------> Método para validar si los textbox tienen texto y crear el user ID
    const handleValidation = () => {
        // Realizar la validación de las variables aquí
        // Si las variables tienen información, establece validated en true
        // Ejemplo de validación básica:
        if (Rol && ID_Centro && Email && pass) {
            //crear el id de usuario
            CrearID(ID_Centro, NumUsuario);//
            setValidated(true);
            setShowButtons(true);
            setShowDiv(false); // Ocultar el div
            //-------------------------------> Metodo para obtener el hASh de la contraseña
            calculateHash(Password)
                .then(hash => {
                    // Alerta(icono, titulo, texto) (hash)
                    setPassword(hash); //-------------> Pasar el Hash de la contraseña
                })
                .catch(error => {
                    console.error('Error al calcular el hash:', error);
                });
            AlertaTimer('success', 'Datos validados', 1500);
        } else {
            setValidated(false);
            setShowButtons(false);
            setShowDiv(true); // Mostrar el div
            Alerta('error', 'No completado', 'Por favor, complete todos los campos');
        }
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
    function AlertaTimer(icono, titulo, tiempo) {
        Swal.fire({
            position: 'center',
            icon: icono,
            title: titulo,
            showConfirmButton: false,
            timer: tiempo
        })
    }

    const Menu = () => {
        navigate("/loader-DashboardSU");
    }

//////////////////////////////////////////////////////////////-------------> BUSCAR EL USUARIO
const handleBuscar = () => {
    const requestData = {
        ID: PersonalID
      };
  
      axios.post(backendUrl + '/api/UserSearch', requestData)
        .then(response => {
          // Maneja la respuesta del servidor aquí
          if (JSON.stringify(response.data).length == 2) {
            //que no se encotro usuario
            Alerta('error', 'Sin éxito', 'No se encontró el usuario');
          }
          else {
            //Alerta('success', 'si', 'encontró el usuario');
            //pasar valores del json
            response.data.forEach(item => {
              setPersonalId(item.PersonalID);
              setRol(item.Rol);
              setEmail(item.Email);
              setAcceso(item.Acceso);
              setCentroId(item.ID_Centro);
              setOldPass(item.Password); //has de la contraseña anterior
              //alert(item.Email); // Acceder a una propiedad específica de cada elemento
            });
            
            //
            //alert('encontrado');
            AlertaTimer('success', 'Obteniendo datos', 2000);
            //visualizar el from
            setValidated(true);
            setShowButtons(true);
            setShowDiv(false); // Ocultar el div
          }
        })
        .catch(error => {
          // Maneja los errores aquí
          console.error(error);
        });
  
  
  
}

function DeleteUser(id) {
    const requestData = {
      ID: id
    };

    axios.post(backendUrl + '/api/DeleteUser', requestData)
      .then(response => {
        // Manejar la respuesta del servidor si es necesario
        console.log(response.data);
        if (response.status === 200) {
          //AlertaTimer('success', 'Completado', 'Se ha eliminado correctamente', 1500);
        } else {
          // Autenticación fallida
          Alerta('error', 'Sin éxito', 'Falló al actualizar la información');
        }
      })
      .catch(error => {
        // Manejar errores si ocurre alguno
        console.error(error);
      });

  }

    const handleUpdate = async () => {
        try {
            // Eliminar el usuario existente
            await deleteUser(PersonalID);

            // Crear un objeto con los datos del formulario
            const formData = {
                PersonalID,
                Rol,
                ID_Centro,
                Email,
                Password,
                Acceso
            };

            // Enviar los datos al servidor utilizando Axios
            const response = await axios.post(backendUrl + '/api/AddUser', formData);

            if (response.status === 200) {
                // Autenticación exitosa, puedes redirigir al usuario a otra página
                msgUpdateInfo();
            } else {
                // Autenticación fallida
                Alerta('error', 'Sin éxito', 'Falló al registrar la información');
            }
        } catch (error) {
            // Manejar errores si ocurre alguno
            console.error(error);
        }
    };

    const deleteUser = async (userID) => {
        try {
            const requestData = {
                ID: userID
            };

            const response = await axios.post(backendUrl + '/api/DeleteUserPersonal', requestData);

            if (response.status === 200) {
                // Éxito al eliminar el usuario
                console.log('Usuario eliminado exitosamente');
            } else {
                // Fallo al eliminar el usuario
                console.error('Error al eliminar el usuario:', response.data);
            }
        } catch (error) {
            // Manejar errores si ocurre alguno
            console.error('Error al intentar eliminar el usuario:', error);
        }
    };

function msgUpdateInfo(){
    Swal.fire({
        title: '¿Actualizar información?',
        text: 'Estás a punto de modificar la información, ¿Estás seguro? (Se descargará tú comprobante de credenciales)',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        denyButtonText: 'No, cancelar',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          //Swal.fire('Eliminado', '', 'success')
          //eliminar
        //metodo de pdf
        //alert(passPDF);
        handleDownloadPDF();
        navigate("/loader-DashboardSU");
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
}

const handleInputChangePass = (e) => {
    const valor = e.target.value;
    setpass(valor);
    if(valor.length != 0){
        //obtener el hash y establecer el password
         //-------------------------------> Metodo para obtener el hASh de la contraseña
         calculateHash(e.target.value)
         .then(hash => {
             // Alerta(icono, titulo, texto) (hash)
             setPassword(hash); //-------------> Pasar el Hash de la contraseña
             setPassPDF(pass);
     //        alert(hash)
         })
         .catch(error => {
             console.error('Error al calcular el hash:', error);
         });
    }
    if(valor.length == 0 ){
        //establecer la contraseña old
        setPassword(OldPass);
        setPassPDF('Utilizar la misma contraseña, no se actualizó');     
    }
  };



    //////////////////////////////////////////////////////////////---------------RETURN()-------------//////////////////////////////////////////////////////////////////////////////////

    return (
        <body>
            <div className="left-panel">
                <img src={logo} className='logo' />
                <div className='contTitleLeft' >
                    <label className='labelPanelLeft'>Agregar personal</label>
                    <div className='line'></div>
                </div>
                <div className='contMenu' >
                    <div className='optionBtn' onClick={Menu}>
                        <label className='txtBTN'>Volver al menú</label>
                    </div>

                </div>
                <div className='contentImage'>
                <img src={""} className='imagen' />
                </div>
            </div>


            {showDiv && (


                <div className="right-panel">
                    <div className="right-panel-content">
                        <div className='formContainer'>
                            <animated.h1 style={fade} className="titleForm">Editar usuarios</animated.h1>

                            <div className='containerInputLabel'>
                                <label className='labelInput'>Ingresa el ID del Usuario</label>
                                <input class="inputGlobal" placeholder="" type="text" value={PersonalID} onChange={e => setPersonalId(e.target.value)} required />
                            </div>




                            <button className='buttonPrincipalGlobal' onClick={handleBuscar}>Actializar Usuario</button>

                            <button className='buttonPrincipalGlobal' onClick={Menu}>Cancelar</button>

                        </div>
                    </div>

                </div>







            )}

            <div className="">


                {validated && (
                    <div className="right-panel">
                        <div className="right-panel-content">
                            <div className='formContainer'>
                                <animated.h1 style={fade} className="titleForm">¡Bienvenido!</animated.h1>
                                <div className='containerInputLabel'>
                                    <label className='labelInput'>Elige un rol:</label>
                                    <select class="inputGlobal" value={Rol} onChange={handleRolChange} required>
                                        <option value="" disabled selected >Seleccionar Rol</option>
                                        <option value="Psicología">Psicóloga/o</option>
                                        <option value="Enfermería">Enfermera/o</option>
                                        <option value="Instructor">Instructora/or</option>
                                        <option value="Administración">Administradora/or</option>
                                        <option value="Recepción">Recepcionista</option>
                                    </select>
                                </div>

                                <div className='containerInputLabel'>
                                    <label className='labelInput'>Elige un centro:</label>

                                    <select class="inputGlobal" value={ID_Centro} onChange={e => setCentroId(e.target.value.split(" - ")[0])} required>
                                        <option disabled selected value="">Seleccionar centro</option>
                                        {centros.map(centro => (
                                            <option key={centro.ID_Centro} value={centro.ID_Centro}>
                                                {centro.ID_Centro} - {centro.Nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='containerInputLabel'>
                                    <label className='labelInput'>Ingresa un correo electrónico:</label>
                                    <input class="inputGlobal" placeholder="example@mail.com" id="inputPAss" type="email" value={Email} onChange={e => setEmail(e.target.value)} required />
                                </div>

                                <div className='containerInputLabel'>
                                    <label className='labelInput'>Ingresa una contraseña:</label>
                                    <input class="inputGlobal" placeholder="Dejar en blanco para mantener la actual" type="text" value={pass} onChange={handleInputChangePass} required />
                                </div>

                                <div className='containerInputLabel'>
                                    <label className='labelInput'>Verifica los permisos de acceso:</label>
                                    <textarea class="inputGlobal" value={Acceso} readOnly />
                                </div>

                                <button className='buttonPrincipalGlobal' onClick={handleUpdate}>Validar</button>
                                <button className='buttonPrincipalGlobal' onClick={Menu}>Cancelar</button>

                            </div>
                        </div>

                    </div>

                )}
            </div>


        </body>
    );
};

export default EditSuperUsuario;

