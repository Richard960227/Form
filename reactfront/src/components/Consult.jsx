import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const URI = 'http://localhost:8000/home/students';

const Consult = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedBloque, setSelectedBloque] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const { id } = useParams();

    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        async function getStudentById() {
            try {
                const response = await axios.get(`${URI}/${id}`);
                setStudents(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (id) {
            getStudentById();
        }
    }, [id]);

    async function getStudents() {
        try {
            const response = await axios.get(URI);
            if (Array.isArray(response.data)) {
                setStudents(response.data);
                setSelectedCampus(response.data);
                setSelectedLevel(response.data);
                setSelectedProgram(response.data);
                setSelectedPeriod(response.data);
                setSelectedBloque(response.data);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="btn btn-square loading"></div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-end m-4">
                        <h1 className="text-5xl font-bold">Consultar</h1>
                    </div>
                    <div className="flex items-center m-4">
                        <select
                            className="select select-bordered w-full max-w-xs"
                            onChange={event => setSelectedCampus(event.target.value)}
                        >
                            <option defaultValue>Selecciona Campus</option>
                            {[...new Set(students.map(student => student.CAMPUS))]
                                .map((campus, index) => (
                                    <option key={index} value={campus}>
                                        {campus}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {selectedCampus && (
                        <div className="flex items-center m-4">
                            <select
                                className="select select-bordered w-full max-w-xs"
                                onChange={event => setSelectedLevel(event.target.value)}
                            >
                                <option defaultValue>Selecciona Nivel</option>
                                {[...new Set(students.filter(student => student.CAMPUS === selectedCampus)
                                    .map(student => student.NIVEL))]
                                    .map((level, index) => (
                                        <option key={index} value={level}>
                                            {level}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {selectedLevel && (
                        <div className="flex items-center m-4">
                            <select
                                className="select select-bordered w-full max-w-xs"
                                onChange={event => setSelectedProgram(event.target.value)}
                            >
                                <option defaultValue>Selecciona Programa</option>
                                {[...new Set(students.filter(student => student.CAMPUS === selectedCampus && student.NIVEL === selectedLevel)
                                    .map(student => student.PROGRAMA))]
                                    .map((program, index) => (
                                        <option key={index} value={program}>
                                            {program}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {selectedProgram && (
                        <div className="flex items-center m-4">
                            <select
                                className="select select-bordered w-full max-w-xs"
                                onChange={event => setSelectedPeriod(event.target.value)}
                            >
                                <option defaultValue>Selecciona Periodo</option>
                                {[...new Set(students.filter(student => student.CAMPUS === selectedCampus && student.NIVEL === selectedLevel && student.PROGRAMA === selectedProgram)
                                    .map(student => student.PARTE_PERIODO))]
                                    .map((period, index) => (
                                        <option key={index} value={period}>
                                            {period}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {selectedPeriod && (
                        <div className="flex items-center m-4">
                            <select
                                className="select select-bordered w-full max-w-xs"
                                onChange={event => setSelectedBloque(event.target.value)}
                            >
                                <option defaultValue>Selecciona Bloque</option>
                                {[...new Set(students.filter(student => student.CAMPUS === selectedCampus && student.NIVEL === selectedLevel && student.PROGRAMA === selectedProgram && student.PARTE_PERIODO === selectedPeriod)
                                    .map(student => student.BLOQUE))]
                                    .map((bloque, index) => (
                                        <option key={index} value={bloque}>
                                            {bloque}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {selectedBloque && (
                        <div className="flex items-center m-4">
                            <select
                                className="select select-bordered w-full max-w-xs"
                                onChange={event => setSelectedStudent(event.target.value)}
                            >
                                <option defaultValue>Selecciona Alumno</option>
                                {[...new Set(students.filter(student => student.CAMPUS === selectedCampus && student.NIVEL === selectedLevel && student.PROGRAMA === selectedProgram && student.PARTE_PERIODO === selectedPeriod && student.BLOQUE === selectedBloque)
                                    .map(student => student.ALUMNO))]
                                    .map((student, index) => (
                                        <option key={index} value={student}>
                                            {student}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

<div className="m-6 overflow-y-scroll max-h-96">
                        {students.map((student, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-orange-600 py-4">
                                <div className="flex items-center">
                                    <div className="ml-2">
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div >
            )}
        </>
    )
};

export default Consult;

