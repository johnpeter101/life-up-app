import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import backendUrl from '../../../../serverConfig';
import { useSpring, animated } from 'react-spring';
import logo from '../../../../GlobalStyles/images/logo.svg';
import Swal from 'sweetalert2';
import '../../../../GlobalStyles/Resources.css';
import imagen from '../../../../GlobalStyles/images/image1.png';



const ModuleTallerAddForm = () => {
 
    const fade = useSpring({ opacity: 1, from: { opacity: 0 } });
    const [Nombre, setNombre] = useState('');
    const [Duracion, setDuracion] = useState('');
    const [Instructor, setInstructor] = useState('');
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);
    const [Hora, setHora] = useState('');
    const [centros, setCentros] = useState([]);
    const [ID_Centro, setCentroId] = useState('');
    const [ID_Taller, setIdTaller] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [datosTaller, setDatosTaller] = useState(null);
    const routeLocation = useLocation();
    const ID_Personal = routeLocation.state && routeLocation.state.ID_PERSONAL;
    const handleInput = (event) => {
        event.target.value = event.target.value.toUpperCase();
    };

    const handleNombre = (event) => {
        setNombre(event.target.value);
    };

    const handleDuracion = (event) => {
        setDuracion(event.target.value);
    };

    const handleInstr = (event) => {
        setInstructor(event.target.value);
    };

    function handleTimeChange(event) {
        setHora(event.target.value);
    }

    function handleCheckboxChange(event) {
        const { value } = event.target;
        const isChecked = event.target.checked;

        // Usamos una función de actualización para garantizar que tengamos la versión más reciente de los días seleccionados
        setDiasSeleccionados((prevDias) => {
            if (isChecked) {
                // Agregamos el día si aún no está seleccionado
                return [...prevDias, value];
            } else {
                // Quitamos el día si ya está seleccionado
                return prevDias.filter((day) => day !== value);
            }
        });
    }


    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = {
            Nombre: Nombre,
            CentroID: ID_Centro,
            Instructor: Instructor,
            Duracion: Duracion,
            Dias: diasSeleccionados,
            Hora: Hora,
        };

        axios.put(backendUrl + '/api/TallerUpdate/' + datosTaller.TallerID, { newData: formData })
            .then(response => {
                if (response.status === 200) {
                    AlertaTimer('success', 'Información Actualizada', 1500);
                    navigate('/MenuTalleres', { state: { ID_PERSONAL: ID_Personal } });
                } else {
                    Alerta('error', 'Sin éxito', 'Falló al registrar la información');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        const fetchCentro = async () => {
            try {
                const response = await fetch(backendUrl + '/api/GetCentros');
                const responseData = await response.json();
                if (response.ok) {
                    setCentros(responseData);
                } else {
                    console.error('Error al obtener los datos de centros');
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error.message);
            }
        };

        fetchCentro();

        if (location.state && location.state.tallerDetails) {
            const datosTaller = location.state.tallerDetails;

            // Asigna los datos del taller al estado local
            setNombre(datosTaller.Nombre);
            setDuracion(datosTaller.Duracion);
            setInstructor(datosTaller.Instructor);
            setDiasSeleccionados(datosTaller.Dias.split(',').map((day) => day.trim()));
            setHora(datosTaller.Hora);
            setCentroId(datosTaller.CentroID);
            setIdTaller(datosTaller.TallerID);
            setDatosTaller(datosTaller);  // Agrega esta línea para asegurarte de que los datosTaller se actualicen correctamente
        }
    }, [location.state]);


    const Alerta = (icono, titulo, texto) => {
        Swal.fire({
            icon: icono,
            title: titulo,
            text: texto,
            confirmButtonColor: '#4CAF50',
            confirmButtonText: 'Aceptar',
        });
    };

    const AlertaTimer = (icono, titulo, tiempo) => {
        Swal.fire({
            position: 'center',
            icon: icono,
            title: titulo,
            showConfirmButton: false,
            timer: tiempo,
        });
    };

    const regresar = () => {
        navigate(-1);
    };

    return (
        <body>
            <div className="left-panel">
                <img src={logo} className='logo' />
                <div className='contTitleLeft' >
                    <label className='labelPanelLeft'><strong>CONSUL</strong></label>
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
                    <div className="formContainer">
                        <animated.h1 style={fade} className="titleForm">
                            Editar taller {datosTaller && `(${datosTaller.TallerID})`}
                        </animated.h1>
                        <div className="containerInputLabel">
                            <label className="labelInput">Nombre de taller:</label>
                            <input
                                type="text"
                                className="inputGlobal"
                                placeholder="Nombre"
                                value={Nombre}
                                onChange={handleNombre}
                                onInput={handleInput}
                                required
                            />
                        </div>
                        <div className="containerInputLabel">
                            <label className="labelInput">Duración:</label>
                            <input
                                type="number"
                                className="inputGlobal"
                                placeholder="Duración (Minutos)"
                                value={Duracion}
                                onChange={handleDuracion}
                                onInput={handleInput}
                                required
                            />
                        </div>
                        <div className="containerInputLabel">
                            <label className="labelInput">Hora:</label>
                            <input
                                type="time"
                                className="inputGlobal"
                                placeholder="Hora"
                                value={Hora}
                                onChange={handleTimeChange}
                                onInput={handleInput}
                                required
                            />
                        </div>
                        <div className="containerInputLabel">
                            <label className="labelInput">Días:</label>
                            <label className="lblCHK">
                                <input
                                    className="CHKtaller"
                                    type="checkbox"
                                    value="Lunes"
                                    onChange={handleCheckboxChange}
                                    checked={diasSeleccionados.includes('Lunes')}
                                />
                                Lunes
                            </label>
                            <label className="lblCHK">
                                <input
                                    type="checkbox"
                                    value="Martes"
                                    onChange={handleCheckboxChange}
                                    checked={diasSeleccionados.includes('Martes')}
                                />
                                Martes
                            </label>
                            <label className="lblCHK">
                                <input
                                    type="checkbox"
                                    value="Miércoles"
                                    onChange={handleCheckboxChange}
                                    checked={diasSeleccionados.includes('Miércoles')}
                                />
                                Miércoles
                            </label>
                            <label className="lblCHK">
                                <input
                                    type="checkbox"
                                    value="Jueves"
                                    onChange={handleCheckboxChange}
                                    checked={diasSeleccionados.includes('Jueves')}
                                />
                                Jueves
                            </label>
                            <label className="lblCHK">
                                <input
                                    type="checkbox"
                                    value="Viernes"
                                    onChange={handleCheckboxChange}
                                    checked={diasSeleccionados.includes('Viernes')}
                                />
                                Viernes
                            </label>
                            <label className="lblCHK">
                                <input
                                    type="checkbox"
                                    value="Sábado"
                                    onChange={handleCheckboxChange}
                                    checked={diasSeleccionados.includes('Sábado')}
                                />
                                Sábado
                            </label>
                            <label className="lblCHK">
                                <input
                                    type="checkbox"
                                    value="Domingo"
                                    onChange={handleCheckboxChange}
                                    checked={diasSeleccionados.includes('Domingo')}
                                />
                                Domingo
                            </label>
                        </div>
                        <div className="containerInputLabel">
                            <label className="labelInput">Instructor:</label>
                            <input
                                type="text"
                                className="inputGlobal"
                                placeholder="Instructor"
                                value={Instructor}
                                onChange={handleInstr}
                                onInput={handleInput}
                                required
                            />
                        </div>
                        <div className='containerInputLabel'>
                            <label className='labelInput'>Elige un centro:</label>
                            <select className="inputGlobal" value={ID_Centro} onChange={e => setCentroId(e.target.value.split(" - ")[0])} required>
                                <option disabled selected value="">Seleccionar centro</option>
                                {centros.map(centro => (
                                    <option key={centro.ID_Centro} value={centro.ID_Centro}>
                                        {centro.ID_Centro} - {centro.Nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="buttonPrincipalGlobal" onClick={handleSubmit}>
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </body>
    );
};

export default ModuleTallerAddForm;
