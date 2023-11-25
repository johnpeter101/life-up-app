//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> IMPORTS 
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import backendUrl from '../../../../serverConfig';

import { useSpring, animated } from 'react-spring';
import logo from '../../../../GlobalStyles/images/logo.svg';
import imagen from '../../../../GlobalStyles/images/image1.png';
import Swal from 'sweetalert2';

/*--------------------------------------------------------  FUNCION PRINCIPAL  -------------------------------------------------------------- */
const ModuleSaludNewConsultaForm = () => {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> DECLARACIONES 
    //Fade para el h1
    const fade = useSpring({ opacity: 1, from: { opacity: 0 } });

    //Declaraciones de estado para almacenar los datos del los inputs
    const [nombre, setNombre] = useState('');
    const [ap, setAp] = useState('');
    const [am, setAm] = useState('');
    const [edad, setEdad] = useState('');
    const [sexo, setSexo] = useState('');
    const [tel, setTel] = useState('');
    const [ID, setID] = useState('');
    const [Indice, setIndice] = useState('');
    const routeLocation = useLocation();
    const ID_Personal = routeLocation.state && routeLocation.state.ID_PERSONAL;
    const ID_User = routeLocation.state && routeLocation.state.ID_USER;
    const Nombre = routeLocation.state && routeLocation.state.Nombre;
    const [centroID, setCentro] = useState('');
    const [ultimoUserNum, setNumUs] = useState('');
    const [año, setAño] = useState('');
    let navigate = useNavigate();
    let [email, setEmail] = useState("");

    const [Fecha, setFecha] = useState('');



    const [objetivos, setObjetivos] = useState("");
    const [recomendaciones, setRecomendaciones] = useState("");




    const [padecimientos, setPadecimientos] = useState('');
    const [alergias, setAlergias] = useState('');
    const [sangre, setSangre] = useState('');


    const [selectDesactivado, setSelectDesactivado] = useState(false);

    const [selectDesactivadoAlergias, setSelectDesactivadoAlergias] = useState(false);


    const [temp, setTemp] = useState('');
    const [fc, setFc] = useState('');
    const [presion, setPresion] = useState('');
    const [fr, setFr] = useState('');
    const [sos, setSos] = useState('');
    const [medic, setMedic] = useState('');
    const [motivo, setMotivo] = useState('');
    const [recom, setRecom] = useState('');
    const [glucosa, setGlucosa] = useState('');
    const location = useLocation();
    const userDetails = location.state && location.state.userDetails;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> FUNCIONES 
    // Funciones flecha para el navigate
    const Home = () => { navigate("/loader-Home"); }
    const Regresar = () => { navigate(-1); }

    //-----Funciones para establecer los valores a las declaraciones de estados
    const handleInputMotivo = (event) => { setMotivo(event.target.value); }
    const handleInputObjetivos = (event) => { setObjetivos(event.target.value); }
    const handleInputRecom = (event) => { setRecomendaciones(event.target.value); }



    const handleInputEdad = (event) => { setEdad(event.target.value); }
    const handleInputSexo = (event) => { setSexo(event.target.value); }
    const handleInputTel = (event) => { setTel(event.target.value); }


    function handleCheckboxChange(event) {
        setSelectDesactivado(event.target.checked);
        setPadecimientos("NINGUNO");
        console.log(padecimientos);
    }

    function handleCheckboxChangeAlergias(event) {
        setSelectDesactivadoAlergias(event.target.checked);
        setAlergias("NINGUNO");
        console.log(alergias);
    }


    //Función que permite escribir en mayusculas solamente.
    const handleInput = (event) => { event.target.value = event.target.value.toUpperCase(); };

    //Función que permite agregar los datos a firebase usando una función llamada addUserNew que se encuentra en services.
    //Función que permite agregar los datos a firebase usando una función llamada addUserNew que se encuentra en services.
    const handleSubmit = async (event) => {
            // variables de base de datos
            const UserID = userDetails.UserID;
            const Motivo = motivo;
            const Padecimientos = padecimientos;
            const Alergias = alergias;
            const PersonalID = ID_Personal;

            // construcción del formData
            const formData = {
                UserID,
                PersonalID,
                Alergias,
                Padecimientos
            };

            const expedienteExistente = await axios.post(`${backendUrl}/api/CheckExpediente`, { ID: userDetails.UserID });

            if (!expedienteExistente.data.existe) {
                // No existe el expediente, proceder con la creación
                try {
                    const response = await axios.post(`${backendUrl}/api/Salud-Insert-NewExpedient`, formData);

                    if (response.status === 200) {
                        AlertaTimer('success', 'Información completada', 1000);
                        navigate('/MenuEnfermeria', { state: { ID_PERSONAL: ID_Personal } });
                    } else {
                        Alerta('error', 'Sin éxito', 'Falló al registrar la información');
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                // Mostrar alerta indicando que el usuario ya tiene expediente
                Alerta('warning', 'Advertencia', 'El usuario ya tiene un expediente.');
            }
        }

    //Funciones para las alertas
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

    //Función para crear el ID de usuario
    function CrearID(idCentro, indice, ultimosDigitosAño) {


        //id de personal = ID_Centro + P + Año + Numero de usuario
        const ID = idCentro + "U" + ultimosDigitosAño + indice;
        setID(ID);
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> USE EFFECT() 
    useEffect(() => {
        //Obtener la fecha y su ultimo digito del año
        const currentDate = new Date();
        setAño(currentDate.getFullYear() % 100)
        const ID_generado = "";


        const fechaActual = new Date();

        // Obtén el día, mes y año por separado
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth() + 1; // Los meses comienzan en 0, por lo que sumamos 1
        const anio = fechaActual.getFullYear();

        // Obtén la fecha en formato deseado (por ejemplo, dd/mm/yyyy)
        const fechaFormateada = dia + "/" + mes + "/" + anio;
        setFecha(fechaFormateada);

        //-----------------------------------------------> Obtener el numero de usuarios
        const fetchNumUser = async () => {
            try {
                const response = await fetch(backendUrl + '/api/GetNumUser');
                const responseData = await response.json();
                if (response.ok) {
                    const numUs = responseData.Indice; // Reemplaza "numUs" con el nombre de la propiedad adecuada en "responseData"
                    setNumUs(numUs);//obten el numero de usuario ultimo
                    setIndice(numUs + 1);
                    try {
                        // Hacer una solicitud POST al punto final de inicio de sesión en el servidor
                        const response = await fetch(backendUrl + '/api/GetCentroID', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ ID_Personal }),
                        });
                        // Verificar el estado de la respuesta
                        if (response.status === 200) {
                            const responseData = await response.json();
                            const idCentro = responseData.Centro; // Reemplaza "numUs" con el nombre de la propiedad adecuada en "responseData"
                            setCentro(idCentro);//obten el numero de usuario ultimo
                            setID(idCentro + "U" + (currentDate.getFullYear() % 100) + (numUs + 1));
                        }
                        // Verificar el estado de la respuesta
                    } catch (error) {
                        // Manejar errores de solicitud
                        //setError('An error occurred');
                    }
                } else {
                    console.error('Error al obtener los datos de usuarios');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error.message);
            }
        };

        //------------------------------------------------->obtener centro


        fetchNumUser();

    }, [navigate]);


    const handleInputPad = (event) => {
        setPadecimientos(event.target.value);
    }

    const handleInputAlergias = (event) => {
        setAlergias(event.target.value);
    }

    const handleInputSangre = (event) => {
        setSangre(event.target.value);
    }



    //hooks de inputsConsulta
    const handleTemp = (event) => {
        setTemp(event.target.value);
    }

    const handleFc = (event) => {
        setFc(event.target.value);
    }

    const handlePresion = (event) => {
        const nuevaPresion = event.target.value.replace('/', '-');
        console.log(nuevaPresion);
        setPresion(event.target.value);
    }
    const handleFr = (event) => {
        setFr(event.target.value);
    }
    const handleSos = (event) => {
        setSos(event.target.value);
    }
    const handleMedic = (event) => {
        setMedic(event.target.value);
    }
    const handleMotivo = (event) => {
        setMotivo(event.target.value);
    }
    const handleRecom = (event) => {
        setRecom(event.target.value);
    }
    const handleGlucosa = (event) => {
        setGlucosa(event.target.value);
    }

    //ID - > es el id de usuario
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-----------> RETURN () 
    return (
        <body>
            <div className="left-panel">
                <img src={logo} className='logo' />
                <div className='contTitleLeft' >
                    <label className='labelPanelLeft'>Nueva consulta médica</label>
                    <div className='line'></div>
                </div>

                <div className='contMenu' >
                    <div className='optionBtn' >
                        <label className='txtBTN' onClick={Regresar}>Regresar</label>
                    </div>
                </div>
                <div className='contentImage'>
                    <img src={""} className='imagen' />
                </div>
            </div>

            <div className="right-panel">
                <div className="right-panel-content">

                    <div className='formContainer'>
                        <animated.h1 style={fade} className="titleForm">Información personal </animated.h1>
                        <h1>{userDetails.UserID}</h1>
                        <h1>{userDetails.Nombre}</h1>
                        <div className='containerInputLabel'>
                            <label className='labelInput'>Padecimientos:</label>

                            <select name="select" id="mi-select" className="inputGlobal" value={padecimientos} onChange={handleInputPad} required>

                                <option value="Ninguna">Ninguna</option>
                                <option value="Diabetes">Diabetes</option>
                                <option value="Hipertensión arterial" >Hipertensión arterial</option>
                                <option value="Enfermedades cardiovasculares" >Enfermedades cardiovasculares</option>
                                <option value="Enfermedad pulmonar obstructiva crónica " >Enfermedad pulmonar obstructiva crónica </option>
                                <option value="Asma" >Asma</option>
                                <option value="Artritis" >Artritis</option>
                                <option value="Osteoporosis" >Osteoporosis</option>
                                <option value="Trastornos de salud mental" >Trastornos de salud mental</option>
                                <option value="Enfermedades renales crónicas" >Enfermedades renales crónicas</option>
                                <option value="Cáncer" >Cáncer</option>
                                <option value="Alzheimer y/u otras formas de demencia" >Enfermedad de Alzheimer y/u otras formas de demencia</option>
                                <option value="Cirrosis" >Cirrosis</option>
                                <option value="Hepatitis crónica" >Hepatitis crónica</option>
                                <option value="Esclerosis múltiple" >Esclerosis múltiple</option>
                                <option value="Fibromialgia " >Fibromialgia </option>
                            </select>

                        </div>

                        <div className='containerInputLabel'>
                            <label className='labelInput'>Alergias:</label>

                            <input type="text" id="AlergiasInput" className="inputGlobal" placeholder="Alergias" value={alergias} onChange={handleInputAlergias} onInput={handleInput} required />

                        </div>

                        <div className='containerInputLabel'>
                            <label className='labelInput'>Tipo de sangre:</label>
                            <select name="select" className="inputGlobal" value={sangre} onChange={handleInputSangre} required>
                                <option value="">Selecciona tipo de sangre</option>
                                <option value="Tipo A-">Tipo A+</option>
                                <option value="Tipo A-" >Tipo A-</option>
                                <option value="Tipo B+" >Tipo B+</option>
                                <option value="Tipo AB+" >Tipo AB+</option>
                                <option value="Tipo AB-" >Tipo AB-</option>
                                <option value="Tipo O+" >Tipo O+</option>
                                <option value="Tipo O-" >Tipo O-</option>
                            </select>
                        </div>

                        <button type="submit" className='buttonPrincipalGlobal' onClick={handleSubmit} >Enviar </button>
                    </div>

                </div>

            </div>

            <div className="">
            </div>
        </body>
    );
}

export default ModuleSaludNewConsultaForm;