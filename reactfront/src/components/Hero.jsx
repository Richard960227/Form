import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Document, Page, PDFDownloadLink, PDFViewer, Text, View, Image } from '@react-pdf/renderer';
import moonImage from '../assets/moonremovebg.png';
import logoImage from '../assets/logo.png';
import { Bar, Doughnut, Line, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const URIForm = 'http://localhost:8000/home/form/select';
const URIStudents = 'http://localhost:8000/home/students';
const URITeacher = 'http://localhost:8000/home/teachers';

const Hero = () => {
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({});
  const [formsAnswers, setFormsAnswers] = useState([]);
  const [formsFilters, setFormsFilters] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [teacherRating, setTeacherRating] = useState(null);
  const [teacherRatings, setTeacherRatings] = useState([]);
  const [selectedQuestionRating, setSelectedQuestionRating] = useState(null);
  const [campusRatings, setCampusRatings] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [bloqueRatings, setBloqueRatings] = useState([]);
  const [selectedBloque, setSelectedBloque] = useState("");
  const [nivelRatings, setNivelRatings] = useState([]);
  const [selectedNivel, setSelectedNivel] = useState("");
  const [programaRatings, setProgramaRatings] = useState([]);
  const [selectedPrograma, setSelectedPrograma] = useState("");
  const [results, setResults] = useState(false);
  const [progress, setProgress] = useState({
    campus: false,
    nivel: false,
    bloque: false,
    programa: false,
    docente: false,
  });
  const uniqueCampus = Array.from(new Set(formsFilters.map(student => student.CAMPUS)));
  const sortedCampus = uniqueCampus.sort((a, b) => a.localeCompare(b));
  const uniqueNiveles = Array.from(new Set(formsFilters.map(student => student.NIVEL)));
  const sortedNiveles = uniqueNiveles.sort((a, b) => a.localeCompare(b));
  const uniqueBloques = Array.from(new Set(formsFilters.map(student => student.BLOQUE)));
  const sortedBloques = uniqueBloques.sort((a, b) => a.localeCompare(b));
  const uniqueProgramas = Array.from(new Set(formsFilters.map(student => student.PROGRAMA)));
  const sortedProgramas = uniqueProgramas.sort((a, b) => a.localeCompare(b));
  const [showTable, setShowTable] = useState(true);
  const [icon, setIcon] = useState('fa-solid fa-chart-pie fa-lg');
  const [chartext, chartText] = useState('Gráfica de Preguntas');
  const [sendingRating, setSendingRating] = useState(false);

  const toggleContent = () => {
    setShowTable((prevShowTable) => !prevShowTable);
    setIcon((prevIcon) =>
      prevIcon === 'fa-solid fa-chart-pie fa-lg' ? 'fa-solid fa-table-cells fa-lg' : 'fa-solid fa-chart-pie fa-lg'
    );
    chartText((prevIcon) =>
      prevIcon === 'Gráfica de Preguntas' ? 'Tabla de Preguntas' : 'Gráfica de Preguntas'
    );
  };

  const handleCampus = () => {
    setSelectedCampus(selectedCampus !== "" ? "" : "selected");
    setProgress((prevProgress) => ({
      ...prevProgress,
      campus: selectedCampus !== "" ? "" : "selected",
    }));
    setSelectedBloque("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      bloque: false,
    }));
    setSelectedNivel("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      nivel: false,
    }));
    setSelectedPrograma("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      programa: false,
    }));
    setResults(!selectedCampus);
  };

  const handleBloque = () => {
    setSelectedCampus("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      campus: false,
    }));
    setSelectedBloque(selectedBloque !== "" ? "" : "selected");
    setProgress((prevProgress) => ({
      ...prevProgress,
      bloque: selectedBloque !== "" ? "" : "selected",
    }));
    setSelectedNivel("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      nivel: false,
    }));
    setSelectedPrograma("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      programa: false,
    }));
    setResults(!selectedBloque);
  };

  const handleNivel = () => {
    setSelectedCampus("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      campus: false,
    }));
    setSelectedBloque("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      bloque: false,
    }));
    setSelectedNivel(selectedNivel !== "" ? "" : "selected");
    setProgress((prevProgress) => ({
      ...prevProgress,
      nivel: selectedNivel !== "" ? "" : "selected",
    }));
    setSelectedPrograma("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      programa: false,
    }));
    setResults(!selectedNivel);
  };

  const handlePrograma = () => {
    setSelectedCampus("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      campus: false,
    }));
    setSelectedBloque("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      bloque: false,
    }));
    setSelectedNivel("");
    setProgress((prevProgress) => ({
      ...prevProgress,
      nivel: false,
    }));
    setSelectedPrograma(selectedPrograma !== "" ? "" : "selected");
    setProgress((prevProgress) => ({
      ...prevProgress,
      programa: selectedPrograma !== "" ? "" : "selected",
    }));
    setResults(!selectedPrograma);
  };

  // Función que finaliza la carga después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Función que carga el formulario
  useEffect(() => {
    async function getSelectedForm() {
      try {
        const response = await axios.get(`${URIForm}/response`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForm(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getSelectedForm();
  }, [token]);

  // Función que carga las respuestas de los formularios
  useEffect(() => {
    async function getAllFormsAnswers() {
      try {
        const response = await axios.get(`${URIForm}/answers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormsAnswers(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getAllFormsAnswers();
  }, [token]);

  // Función que carga los filtros
  useEffect(() => {
    async function getAllFormsFilters() {
      try {
        const response = await axios.get(URIStudents, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormsFilters(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getAllFormsFilters();
  }, [token]);

  const getTopTeachers = (allTeacherRatings) => {
    const teachersWithRating = allTeacherRatings.map((rating) => {
      return {
        teacher: rating.teacher,
        rating: rating.averageRating,
      };
    });

    const sortedTeachers = teachersWithRating.sort((a, b) => b.rating - a.rating);

    return sortedTeachers.slice(0, 10); // Retorna los 10 mejores docentes evaluados
  };

  const topTeachers = getTopTeachers(teacherRatings);

  // Función que calcula la calificación promedio
  useEffect(() => {
    if (formsAnswers.length > 0) {
      // Calcular la calificación promedio del docente seleccionado
      if (selectedTeacher) {
        const filteredFormsAnswers = formsAnswers.filter(
          (formAnswer) => formAnswer.teacher === selectedTeacher
        );
        const allRatings = filteredFormsAnswers
          .flatMap((formAnswer) =>
            formAnswer.questions
              .filter((question) => question.type === 'scale')
              .map((question) => Number(question.answer))
          )
          .filter((rating) => !isNaN(rating));
        const ratingSum = allRatings.reduce((sum, rating) => sum + rating, 0);
        const totalQuestions = filteredFormsAnswers
          .flatMap((formAnswer) => formAnswer.questions)
          .filter((question) => question.type === 'scale')
          .length;
        const averageRating = (ratingSum / totalQuestions).toFixed(2);
        setTeacherRating(averageRating);
      } else {
        setTeacherRating(null);
      }

      // Calcular la calificación promedio de cada docente
      const allTeacherRatings = formsAnswers.reduce((acc, formAnswer) => {
        const existingRating = acc.find((rating) => rating.teacher === formAnswer.teacher);
        const questionRatings = formAnswer.questions
          .filter((question) => question.type === 'scale')
          .map((question) => Number(question.answer))
          .filter((rating) => !isNaN(rating));
        const uniqueQuestionsLength = [
          ...new Set(
            formAnswer.questions
              .filter((question) => question.type === 'scale')
              .map((question) => question.question)
          ),
        ].length;
        if (existingRating) {
          existingRating.ratingSum += questionRatings.reduce((sum, rating) => sum + rating, 0);
          existingRating.totalQuestions += uniqueQuestionsLength;
        } else {
          const newRating = {
            teacher: formAnswer.teacher,
            ratingSum: questionRatings.reduce((sum, rating) => sum + rating, 0),
            totalQuestions: uniqueQuestionsLength,
            campus: formAnswer.campus,
            nivel: formAnswer.nivel,
            bloque: formAnswer.bloque,
            programa: formAnswer.programa,
          };
          acc.push(newRating);
        }
        return acc;
      }, []);

      // Calcular el rating promedio de cada docente
      const averageTeacherRatings = allTeacherRatings.map((rating) => ({
        teacher: rating.teacher,
        averageRating: (rating.ratingSum / rating.totalQuestions).toFixed(2),
        campus: rating.campus,
        nivel: rating.nivel,
        bloque: rating.bloque,
        programa: rating.programa,
      }));
      setTeacherRatings(averageTeacherRatings);

      // Calcular la calificación promedio para cada campus
      const campusAverageRatings = averageTeacherRatings.reduce((acc, rating) => {
        const existingCampusRating = acc.find((campusRating) => campusRating.campus === rating.campus);
        if (existingCampusRating) {
          existingCampusRating.ratingSum += +rating.averageRating;
          existingCampusRating.totalTeachers++;
        } else {
          acc.push({
            campus: rating.campus,
            ratingSum: +rating.averageRating,
            totalTeachers: 1,
          });
        }
        return acc;
      }, []);
      const averageCampusRatings = campusAverageRatings.map((campusRating) => ({
        campus: campusRating.campus,
        averageRating: (campusRating.ratingSum / campusRating.totalTeachers || 0).toFixed(2),
      }));
      setCampusRatings(averageCampusRatings);

      // Calcular la calificación promedio para cada nivel
      const nivelAverageRatings = averageTeacherRatings.reduce((acc, rating) => {
        const existingNivelRating = acc.find((nivelRating) => nivelRating.nivel === rating.nivel);
        if (existingNivelRating) {
          existingNivelRating.ratingSum += +rating.averageRating;
          existingNivelRating.totalTeachers++;
        } else {
          acc.push({
            nivel: rating.nivel,
            ratingSum: +rating.averageRating,
            totalTeachers: 1,
          });
        }
        return acc;
      }, []);
      const averageNivelRatings = nivelAverageRatings.map((nivelRating) => ({
        nivel: nivelRating.nivel,
        averageRating: (nivelRating.ratingSum / nivelRating.totalTeachers || 0).toFixed(2),
      }));
      setNivelRatings(averageNivelRatings);

      // Calcular la calificación promedio para cada bloque
      const bloqueAverageRatings = averageTeacherRatings.reduce((acc, rating) => {
        const existingBloqueRating = acc.find((bloqueRating) => bloqueRating.bloque === rating.bloque);
        if (existingBloqueRating) {
          existingBloqueRating.ratingSum += +rating.averageRating;
          existingBloqueRating.totalTeachers++;
        } else {
          acc.push({
            bloque: rating.bloque,
            ratingSum: +rating.averageRating,
            totalTeachers: 1,
          });
        }
        return acc;
      }, []);
      const averageBloqueRatings = bloqueAverageRatings.map((bloqueRating) => ({
        bloque: bloqueRating.bloque,
        averageRating: (bloqueRating.ratingSum / bloqueRating.totalTeachers || 0).toFixed(2),
      }));
      setBloqueRatings(averageBloqueRatings);

      // Calcular la calificación promedio para cada programa
      const programaAverageRatings = averageTeacherRatings.reduce((acc, rating) => {
        const existingProgramaRating = acc.find((programaRating) => programaRating.programa === rating.programa);
        if (existingProgramaRating) {
          existingProgramaRating.ratingSum += +rating.averageRating;
          existingProgramaRating.totalTeachers++;
        } else {
          acc.push({
            programa: rating.programa,
            ratingSum: +rating.averageRating,
            totalTeachers: 1,
          });
        }
        return acc;
      }, []);
      const averageProgramaRatings = programaAverageRatings.map((programaRating) => ({
        programa: programaRating.programa,
        averageRating: (programaRating.ratingSum / programaRating.totalTeachers || 0).toFixed(2),
      }));
      setProgramaRatings(averageProgramaRatings);

    }
  }, [selectedTeacher, formsAnswers]);

  const chartData = {
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: '#fb923c',
        borderColor: '#fb923c',
        borderWidth: 1,
      },
    ],
  };

  const chartDataLine = {
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: '#a5b4fc',
        borderColor: '#4f46e5',
        borderWidth: 1,
      },
    ],
  };

  const progressData = {
    labels: ['Completado', 'Faltante'],
    datasets: [
      {
        label: '',
        data: '',
        backgroundColor: ['#4f46e5', '#a5b4fc'],
        borderColor: ['#4f46e5', '#a5b4fc'],
        borderWidth: 1,
      },
    ],
  };

  if (selectedCampus) {
    const filteredFormsFilters = formsFilters.filter((student) => student.CAMPUS === selectedCampus);
    const filteredFormsAnswers = formsAnswers.filter((answer) => answer.campus === selectedCampus);

    const totalFormsExpected = filteredFormsFilters.length;

    const completedStudentsSet = new Set(filteredFormsAnswers.map((answer) => answer.matricula));
    const totalFormsCompleted = completedStudentsSet.size;

    chartData.labels = campusRatings.map((rating) => rating.campus);
    chartData.datasets[0].label = 'Calificación Promedio por Campus';
    chartData.datasets[0].data = campusRatings.map((rating) => rating.averageRating);

    const docentesEvaluadosEnCampus = new Set(filteredFormsAnswers.map((answer) => answer.teacher));
    const calificacionesDocentesEnCampus = teacherRatings
      .filter((rating) => docentesEvaluadosEnCampus.has(rating.teacher))
      .map((rating) => rating.averageRating);

    chartDataLine.labels = Array.from(docentesEvaluadosEnCampus).map((teacher) => teacher?.substring(0, 10));
    chartDataLine.datasets[0].label = 'Calificación Promedio de Docentes Evaluados por Campus';
    chartDataLine.datasets[0].data = calificacionesDocentesEnCampus;

    progressData.datasets[0].label = 'Estudiantes';
    progressData.datasets[0].data = [totalFormsCompleted, totalFormsExpected - totalFormsCompleted];
  }

  if (selectedNivel) {
    const filteredFormsFilters = formsFilters.filter((student) => student.NIVEL === selectedNivel);
    const filteredFormsAnswers = formsAnswers.filter((answer) => answer.nivel === selectedNivel);

    const totalFormsExpected = filteredFormsFilters.length;

    const completedStudentsSet = new Set(filteredFormsAnswers.map((answer) => answer.matricula));
    const totalFormsCompleted = completedStudentsSet.size;

    chartData.labels = nivelRatings.map((rating) => rating.nivel);
    chartData.datasets[0].label = 'Calificación Promedio por Nivel';
    chartData.datasets[0].data = nivelRatings.map((rating) => rating.averageRating);

    const docentesEvaluadosEnNivel = new Set(filteredFormsAnswers.map((answer) => answer.teacher));
    const calificacionesDocentesEnNivel = teacherRatings
      .filter((rating) => docentesEvaluadosEnNivel.has(rating.teacher))
      .map((rating) => rating.averageRating);

    chartDataLine.labels = Array.from(docentesEvaluadosEnNivel).map((teacher) => teacher?.substring(0, 10));
    chartDataLine.datasets[0].label = 'Calificación Promedio de Docentes Evaluados por Nivel';
    chartDataLine.datasets[0].data = calificacionesDocentesEnNivel;

    progressData.datasets[0].label = 'Estudiantes';
    progressData.datasets[0].data = [totalFormsCompleted, totalFormsExpected - totalFormsCompleted];
  }

  if (selectedBloque) {
    const filteredFormsFilters = formsFilters.filter((student) => student.BLOQUE === selectedBloque);
    const filteredFormsAnswers = formsAnswers.filter((answer) => answer.bloque === selectedBloque);

    const totalFormsExpected = filteredFormsFilters.length;

    const completedStudentsSet = new Set(filteredFormsAnswers.map((answer) => answer.matricula));
    const totalFormsCompleted = completedStudentsSet.size;

    chartData.labels = bloqueRatings.map((rating) => rating.bloque);
    chartData.datasets[0].label = 'Calificación Promedio por Bloque';
    chartData.datasets[0].data = bloqueRatings.map((rating) => rating.averageRating);

    // Obtener las calificaciones promedio solo de los docentes que han sido evaluados en el bloque seleccionado
    const docentesEvaluadosEnBloque = new Set(filteredFormsAnswers.map((answer) => answer.teacher));
    const calificacionesDocentesEnBloque = teacherRatings
      .filter((rating) => docentesEvaluadosEnBloque.has(rating.teacher))
      .map((rating) => rating.averageRating);

    chartDataLine.labels = Array.from(docentesEvaluadosEnBloque).map((teacher) => teacher?.substring(0, 10));
    chartDataLine.datasets[0].label = 'Calificación Promedio de Docentes Evaluados por Bloque';
    chartDataLine.datasets[0].data = calificacionesDocentesEnBloque;

    progressData.datasets[0].label = 'Estudiantes';
    progressData.datasets[0].data = [totalFormsCompleted, totalFormsExpected - totalFormsCompleted];
  }

  if (selectedPrograma) {
    const filteredFormsFilters = formsFilters.filter((student) => student.PROGRAMA === selectedPrograma);
    const filteredFormsAnswers = formsAnswers.filter((answer) => answer.programa === selectedPrograma);

    const totalFormsExpected = filteredFormsFilters.length;

    const completedStudentsSet = new Set(filteredFormsAnswers.map((answer) => answer.matricula));
    const totalFormsCompleted = completedStudentsSet.size;

    chartData.labels = programaRatings.map((rating) => rating.programa);
    chartData.datasets[0].label = 'Calificación Promedio por Programa';
    chartData.datasets[0].data = programaRatings.map((rating) => rating.averageRating);

    // Obtener las calificaciones promedio solo de los docentes que han sido evaluados en el programa seleccionado
    const docentesEvaluadosEnPrograma = new Set(filteredFormsAnswers.map((answer) => answer.teacher));
    const calificacionesDocentesEnPrograma = teacherRatings
      .filter((rating) => docentesEvaluadosEnPrograma.has(rating.teacher))
      .map((rating) => rating.averageRating);

    chartDataLine.labels = Array.from(docentesEvaluadosEnPrograma).map((teacher) => teacher?.substring(0, 10));
    chartDataLine.datasets[0].label = 'Calificación Promedio de Docentes Evaluados por Programa';
    chartDataLine.datasets[0].data = calificacionesDocentesEnPrograma;

    progressData.datasets[0].label = 'Estudiantes';
    progressData.datasets[0].data = [totalFormsCompleted, totalFormsExpected - totalFormsCompleted];
  }

  const options = {
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const filteredBlocks = sortedBloques.filter(block => {
    return formsFilters.some(student => student.BLOQUE === block && student.CAMPUS === selectedCampus);
  });

  const filteredData = {
    labels: filteredBlocks,
    datasets: [
      {
        label: 'Estudiantes',
        data: filteredBlocks.map(block => formsFilters.filter(student => student.BLOQUE === block && student.CAMPUS === selectedCampus).length),
        backgroundColor: [
          '#fb923c',
          '#fafafa',
          '#818cf8',
          '#fafafa',
        ],
        borderColor: [
          '#ea580c',
          '#525252',
          '#4f46e5',
          '#525252',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Agrega la configuración de plugins y legend al gráfico
  const optionsblock = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Número de Estudiantes',
      },
    },
  };

  // Función para manejar el cambio de docente seleccionado
  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value);
  };

  // Función para manejar el cambio de pregunta seleccionada
  const handleQuestionChange = (event) => {
    setSelectedQuestion(event.target.value);
  };

  useEffect(() => {
    // Calcula la calificación de la pregunta seleccionada
    if (selectedQuestion) {
      const selectedQuestionAnswers = formsAnswers
        .flatMap((formAnswer) =>
          formAnswer.questions.filter(
            (question) => question.question === selectedQuestion && question.type === 'scale'
          )
        )
        .filter((question) => !isNaN(Number(question.answer)));

      const allRatings = selectedQuestionAnswers.map((question) => Number(question.answer));
      const totalUniqueQuestions = new Set(
        formsAnswers.map((formAnswer) => formAnswer.questions.map((question) => question.question))
      ).size;
      const ratingSum = allRatings.reduce((sum, rating) => sum + rating, 0);
      const averageRating = (ratingSum / totalUniqueQuestions).toFixed(2);
      setSelectedQuestionRating(averageRating);
    } else {
      setSelectedQuestionRating(null);
    }
  }, [selectedQuestion, formsAnswers]);

  const uniqueTeachers = [...new Set(formsAnswers.map((formAnswer) => formAnswer.teacher))];

  const uniqueQuestions = formsAnswers.reduce((unique, formAnswer) => {
    formAnswer.questions.forEach((question) => {
      const existingQuestion = unique.find(
        (uniqueQuestion) =>
          uniqueQuestion.question === question.question && uniqueQuestion.teacher === question.teacher
      );
      if (!existingQuestion) {
        unique.push(question);
      }
    });
    return unique;
  }, []);

  // Datos para la gráfica de calificación promedio de cada pregunta
  const chartDataQuestions = {
    labels: uniqueQuestions.map((question, index) => `P${index + 1}`),
    datasets: [
      {
        label: 'Calificación Promedio',
        data: uniqueQuestions.map((question) => {
          let totalAnswer = 0;
          teacherRatings.forEach((rating) => {
            const teacherForms = formsAnswers.filter((formAnswer) => formAnswer.teacher === rating.teacher);
            const answersSum = calculateAnswerSum(teacherForms, question);
            const averageRating = (answersSum / teacherForms.length);
            totalAnswer += averageRating;
          });
          const averageRating = (totalAnswer / teacherRatings.length).toFixed(2);
          return parseFloat(averageRating);
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderWidth: 2,
      },
    ],
  };


  const optionsQuestions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  const renderRatingStars = (rating) => {
    const starValue = 2;
    const numStars = Math.floor(rating / starValue);

    return (
      <div className="ml-4 rating tooltip tooltip-right" data-tip={rating}>
        {[...Array(numStars)].map((_, index) => (
          <input key={index} type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked disabled />
        ))}
      </div>
    );
  };

  function calculateAverage(values) {
    if (values.length === 0) {
      return '-';
    }
    const sum = values.reduce((acc, value) => acc + value, 0);
    return (sum / values.length).toFixed(2);
  }

  function calculateAnswerSum(teacherForms, question) {
    const teacherAnswers = teacherForms.filter((formAnswer) =>
      formAnswer.questions.some((q) => q.question === question.question)
    );
    const answersSum = teacherAnswers.reduce((sum, formAnswer) => {
      const answer = formAnswer.questions.find((q) => q.question === question.question).answer;
      return sum + Number(answer);
    }, 0);
    return answersSum.toFixed(2);
  }

  function calculateAverageRating(formsAnswers, question) {
    const questionRatings = formsAnswers
      .filter((formAnswer) => formAnswer.questions.some((q) => q.question === question.question))
      .map((formAnswer) => {
        const answer = formAnswer.questions.find((q) => q.question === question.question).answer;
        return parseFloat(answer);
      })
      .filter((rating) => !isNaN(rating) && isFinite(rating));

    const averageRating =
      questionRatings.length > 0
        ? calculateAverage(questionRatings)
        : 0;

    return averageRating;
  }

  // Calcular el promedio general de todas las filas
  const totalRowAverage = calculateAverage(
    teacherRatings.map((rating) => Number(rating.averageRating))
  );

  const sendAverageRating = async (selectedTeacher, teacherRating, questionAverageRatings) => {
    try {
      const token = localStorage.getItem('token');
      setSendingRating(true);

      await axios.post(
        URITeacher,
        {
          teacher: selectedTeacher.docenteId,
          rating: teacherRating,
          questionRatings: questionAverageRatings,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSendingRating(false);
    }
  };

  const sendAllAverageRatings = async () => {
    try {
      const token = localStorage.getItem('token');
      setSendingRating(true);
  
      // Verificar que teacherRatings tenga datos válidos
      if (teacherRatings.length === 0) {
        setSendingRating(false); // Importante establecer setSendingRating en false para evitar errores posteriores
        return;
      }
  
      // Crear un conjunto de docenteIds únicos
      const teacherIdsSet = new Set(teacherRatings.map((rating) => rating.teacher));
  
      // Convertir el conjunto de docenteIds en un array
      const teacherIdsArray = Array.from(teacherIdsSet);
  
      // Crear un array de objetos con la información de cada calificación promedio
      const ratingsData = teacherIdsArray.map((teacherId) => {
        // Filtrar los ratings para obtener solo aquellos que coinciden con el docenteId actual
        const ratingsForTeacher = teacherRatings.filter((rating) => rating.teacher === teacherId);
        // Calcular el promedio de los ratings para el docente actual
        const averageRating = calculateAverage(ratingsForTeacher.map((rating) => Number(rating.averageRating)));
  
        // Obtener la lista de preguntas con sus calificaciones promedio para el docente actual
        const questionAverageRatings = uniqueQuestions.map((question) => {
          let totalAnswer = 0;
          let teacherForms;
          ratingsForTeacher.forEach((rating) => {
            teacherForms = formsAnswers.filter((formAnswer) => formAnswer.teacher === rating.teacher);
            const answersSum = calculateAnswerSum(teacherForms, question);
            const averageRating = answersSum / teacherForms.length;
            totalAnswer += averageRating;
          });
          const averageRating = (totalAnswer / ratingsForTeacher.length).toFixed(2);
          return { question: question.question, averageRating: parseFloat(averageRating) };
        });
  
        // Obtener la lista de respuestas con sus calificaciones promedio para el docente actual
        const answerAverageRatings = uniqueQuestions.map((question) => {
          let totalAnswer = 0;
          let teacherForms;
          ratingsForTeacher.forEach((rating) => {
            teacherForms = formsAnswers.filter((formAnswer) => formAnswer.teacher === rating.teacher);
            const answersSum = calculateAnswerSum(teacherForms, question);
            totalAnswer += answersSum;
          });
          const averageRating = (totalAnswer / (ratingsForTeacher.length * teacherForms.length)).toFixed(2);
          return { question: question.question, answer: parseFloat(averageRating) };
        });
  
        return {
          teacher: teacherId,
          rating: averageRating,
          questionRatings: questionAverageRatings,
          answers: answerAverageRatings, // Incluir la lista de respuestas con calificaciones promedio
        };
      });
  
      // Enviar el array de calificaciones promedio al backend mediante una nueva ruta para actualizar todas las calificaciones.
      await axios.post(
        `${URITeacher}/ratings`, // Nueva ruta en el backend para manejar todas las calificaciones promedio
        {
          ratings: ratingsData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSendingRating(false);
    }
  };  

  const generatePdfContent = () => {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View>
            <View style={styles.header}>
              <Image src={moonImage} alt="luna" style={styles.logo} />
              <Text style={styles.title}>Sistema de Evaluación Docente</Text>
              <Image src={logoImage} alt="utc" style={styles.logo} />
            </View>

            <View style={styles.section}>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <View style={styles.column}></View>
                  <View style={styles.columnHeader}>
                    <Text style={styles.columnText}>Docente</Text>
                  </View>
                  {uniqueQuestions.map((question, index) => (
                    <View key={question.question} style={styles.column}>
                      <Text style={styles.columnText}>P{index + 1}</Text>
                    </View>
                  ))}
                  <View style={styles.columnHeader}>
                    <Text style={styles.columnText}>Cal. Promedio</Text>
                  </View>
                </View>

                <View style={styles.tableBody}>
                  {teacherRatings.map((rating, index) => {
                    const teacherForms = formsAnswers.filter((formAnswer) => formAnswer.teacher === rating.teacher);
                    const totalForms = teacherForms.length;
                    const totalQuestions = teacherForms.flatMap((formAnswer) => formAnswer.questions).length;
                    let totalAnswer = 0;

                    return (
                      <View key={rating.teacher} style={styles.tableRow}>
                        <View style={styles.column}>
                          <Text style={styles.rowText}>{index + 1}</Text>
                        </View>
                        <View style={styles.columnHeader}>
                          <Text style={styles.rowText}>{`${rating.teacher} (${totalForms})`}</Text>
                        </View>
                        {uniqueQuestions.map((question) => {
                          const answersSum = calculateAnswerSum(teacherForms, question, totalQuestions);
                          totalAnswer += Number(answersSum);
                          return (
                            <View key={question.question} style={styles.column}>
                              <Text style={[styles.rowText, { textAlign: 'right' }]}>{answersSum}</Text>
                            </View>
                          );
                        })}
                        <View style={styles.columnHeader}>
                          <Text style={[styles.rowText, { textAlign: 'right' }]}>{(totalAnswer / totalQuestions).toFixed(2)}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.tableFooter}>
                  <View style={styles.column}></View>
                  <View style={styles.columnHeader}>
                    <Text style={styles.columnText}>Promedio Gral.</Text>
                  </View>
                  {uniqueQuestions.map((question, index) => {
                    const averageRating = calculateAverageRating(formsAnswers, question, uniqueTeachers);
                    return (
                      <View key={question.question} style={[styles.column, { textAlign: 'right' }]}>
                        <Text style={styles.columnText}>{averageRating}</Text>
                      </View>
                    );
                  })}
                  <View style={styles.columnHeader}>
                    <Text style={styles.columnText}>
                      {calculateAverage(teacherRatings.map((rating) => Number(rating.averageRating)))}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.container}>
              <View style={styles.column}>
                <View style={[styles.section, { padding: 20 }]}>
                  <Text style={styles.sectionTitle}>Preguntas</Text>
                  {uniqueQuestions.map((question, index) => (
                    <View key={question.question} style={styles.questionItem}>
                      <Text style={styles.questionNumber}>P{index + 1}</Text>
                      <Text style={styles.questionText}>{question.question}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.column}>
                <View style={[styles.section, { padding: 20 }]}>
                  <Text style={styles.sectionTitle}>Mejores Docentes</Text>
                  {topTeachers.map((teacher, index) => (
                    <View key={index} style={styles.teacherItem}>
                      <View style={styles.teacherButton}>
                        <Text style={styles.teacherInitial}>{teacher.teacher.charAt(0)}</Text>
                      </View>
                      <Text style={styles.teacherName}>{teacher.teacher}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

          </View>

        </Page>
      </Document>
    )
  };

  const styles = {
    page: {
      padding: 20,
    },
    container: {
      flexDirection: 'row',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 30
    },
    logo: {
      width: 50,
      height: 50,
      margin: 10
    },
    title: {
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold'
    },
    section: {
      margin: 2
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'semibold',
      marginBottom: 20,
    },
    questionItem: {
      flexDirection: 'row',
      marginBottom: 5
    },
    questionNumber: {
      fontSize: 12,
      fontWeight: 'bold',
      marginRight: 5
    },
    questionText: {
      fontSize: 12
    },
    teacherItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5
    },
    teacherButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#F97316',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10
    },
    teacherInitial: {
      fontSize: 16,
      color: '#FFF'
    },
    teacherName: {
      fontSize: 12
    },
    tableContainer: {
      borderWidth: 2,
      borderColor: '#F97316',
      borderRadius: 15,
      overflow: 'hidden'
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#F97316',
      color: '#FFF',
      alignItems: 'center',
      padding: 5
    },
    column: {
      flex: 1,
      padding: 1,
    },
    columnHeader: {
      flex: 2,
      fontSize: 12,
      fontWeight: 'bold',
      alignItems: 'left',
    },
    columnText: {
      fontSize: 12,
      textAlign: 'right'
    },
    tableBody: {
      padding: 5
    },
    tableRow: {
      flexDirection: 'row',
      padding: 5
    },
    rowText: {
      fontSize: 10,
    },
    tableFooter: {
      flexDirection: 'row',
      padding: 4,
      justifyContent: 'center',
      textAlign: 'right',
      backgroundColor: '#F97316',
      color: '#FFF',
      alignItems: 'center',
      fontSize: 12,
      marginTop: 5
    },
    ratingStars: {
      marginLeft: 10
    },
    chartContainer: {
      marginTop: 20,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="btn btn-square loading"></div>
        </div>
      ) : (
        <div className="drawer drawer-end">
          <input id="form" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content h-screen w-screen bg-base-200 overflow-y-auto">
            <div className="m-8 flex justify-end">
              <h1 className="text-5xl font-bold">Dashboard</h1>
            </div>

            <div className="m-8 flex flex-col md:grid md:grid-cols-6 md:grid-rows-11 gap-4">
              <div className="md:row-span-6">
                <p className="mb-4 text-3xl font-semibold">Filtrar por...</p>
                <div className="rounded-lg shadow-xl bg-base-100">
                  <div className="p-2 flex items-center justify-between">
                    <p className="text-lg">Campus</p>
                    <input
                      type="checkbox"
                      checked={selectedCampus !== ""}
                      onChange={handleCampus}
                      className="checkbox checkbox-sm justify-end"
                    />
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <p className="text-lg">Nivel</p>
                    <input
                      type="checkbox"
                      checked={selectedNivel !== ""}
                      onChange={handleNivel}
                      className="checkbox checkbox-sm justify-end"
                    />
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <p className="text-lg">Bloque</p>
                    <input
                      type="checkbox"
                      checked={selectedBloque !== ""}
                      onChange={handleBloque}
                      className="checkbox checkbox-sm justify-end"
                    />
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <p className="text-lg">Programa</p>
                    <input
                      type="checkbox"
                      checked={selectedPrograma !== ""}
                      onChange={handlePrograma}
                      className="checkbox checkbox-sm justify-end"
                    />
                  </div>
                </div>
                <p className="my-4 text-3xl font-semibold">Otros</p>
                <div className="my-2 flex items-center justify-between">
                  <p className="font-semibold">Núm. de Estudiantes</p>
                  <label
                    htmlFor="options"
                    className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end"
                    onClick={() => {
                      setSelectedCampus("");
                      setSelectedNivel("");
                      setSelectedBloque("");
                      setSelectedPrograma("");
                      setResults(false);
                      setShowTable(true);
                      setProgress({
                        campus: false,
                        nivel: false,
                        bloque: false,
                        programa: false,
                        docente: false,
                      });
                    }}>
                    <i className="fa-solid fa-users-viewfinder fa-lg"></i>
                  </label>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p className="font-semibold">{chartext}</p>
                  <button
                    className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end"
                    onClick={toggleContent}>
                    <i className={icon}></i>
                  </button>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p className="font-semibold">Compartir Resultados</p>
                  <button
                    className={`btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end ${sendingRating ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    onClick={sendAllAverageRatings}
                    disabled={sendingRating}
                  >
                    <i className="fa-solid fa-share-from-square fa-lg"></i>
                  </button>
                </div>
                <input type="checkbox" id="options" className="modal-toggle" />
                <div className="modal">
                  <div className="modal-box">
                    <div className="modal-action">
                      <label
                        htmlFor="options"
                        className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                        onClick={() => setSelectedCampus("")}
                      >
                        ✕
                      </label>
                    </div>
                    <div className="mr-8 ml-8 form-control">
                      <p className="mb-8 card-title">Bloques por Campus</p>
                      <select
                        className="mb-4 select select-bordered w-full max-w-xs"
                        value={selectedCampus}
                        onChange={event => setSelectedCampus(event.target.value)}>
                        <option disabled value="">
                          Seleccione un campus
                        </option>
                        {uniqueCampus.map((campus, index) => (
                          <option value={campus} key={index}>
                            {campus}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Doughnut data={filteredData} options={optionsblock} />
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>Puedes ocultar o mostrar bloques.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg md:col-span-3 md:row-span-6">
                {results && (
                  <div className="p-4 rounded-lg shadow-xl bg-base-100">
                    <Bar data={chartData} options={options} />
                  </div>
                )}
              </div>

              <div className="md:row-span-6">
                {progress.campus && (
                  <>
                    <p className="mb-4 text-3xl font-semibold">Progreso</p>
                    <div className="p-2 rounded-lg shadow-xl bg-base-100 flex flex-col">
                      <select
                        className="select select-bordered w-full max-w-xs"
                        value={selectedCampus}
                        onChange={event => setSelectedCampus(event.target.value)}>
                        <option defaultValue="">Seleccione un campus</option>
                        {sortedCampus.map((campus, index) => (
                          <option value={campus} key={index}>
                            {campus}
                          </option>
                        ))}
                      </select>
                      <div className="my-4">
                        <Doughnut data={progressData} options={optionsblock} />
                      </div>
                    </div>
                  </>
                )}

                {progress.nivel && (
                  <>
                    <p className="mb-4 text-3xl font-semibold">Progreso</p>
                    <div className="p-2 rounded-lg shadow-xl bg-base-100 flex flex-col">
                      <select
                        className="select select-bordered w-full max-w-xs"
                        value={selectedNivel}
                        onChange={event => setSelectedNivel(event.target.value)}>
                        <option defaultValue="">Seleccione un nivel</option>
                        {sortedNiveles.map((nivel, index) => (
                          <option value={nivel} key={index}>
                            {nivel}
                          </option>
                        ))}
                      </select>
                      <div className="my-4">
                        <Doughnut data={progressData} options={optionsblock} />
                      </div>
                    </div>
                  </>
                )}

                {progress.bloque && (
                  <>
                    <p className="mb-4 text-3xl font-semibold">Progreso</p>
                    <div className="p-2 rounded-lg shadow-xl bg-base-100 flex flex-col">
                      <select
                        className="select select-bordered w-full max-w-xs"
                        value={selectedBloque}
                        onChange={event => setSelectedBloque(event.target.value)}>
                        <option defaultValue="">Seleccione un bloque</option>
                        {sortedBloques.map((bloque, index) => (
                          <option value={bloque} key={index}>
                            {bloque}
                          </option>
                        ))}
                      </select>
                      <div className="my-4">
                        <Doughnut data={progressData} options={optionsblock} />
                      </div>
                    </div>
                  </>
                )}

                {progress.programa && (
                  <>
                    <p className="mb-4 text-3xl font-semibold">Progreso</p>
                    <div className="p-2 rounded-lg shadow-xl bg-base-100 flex flex-col">
                      <select
                        className="select select-bordered w-full max-w-xs"
                        value={selectedPrograma}
                        onChange={event => setSelectedPrograma(event.target.value)}>
                        <option defaultValue="">Seleccione un programa</option>
                        {sortedProgramas.map((programa, index) => (
                          <option value={programa} key={index}>
                            {programa}
                          </option>
                        ))}
                      </select>
                      <div className="my-4">
                        <Doughnut data={progressData} options={optionsblock} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="my-2 flex items-center justify-between">
                <p className="text-lg font-semibold">Vista del Formulario</p>
                <label htmlFor="form" className="drawer-button btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-en">
                  <i className="fa-regular fa-file-lines fa-xl"></i>
                </label>
              </div>

              <div className="my-2 flex items-center justify-between">
                <p className="text-lg font-semibold">Reporte</p>
                <label
                  htmlFor="pdf"
                  className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end">
                  <i className="fa-regular fa-file-pdf fa-xl"></i>
                </label>
                <input type="checkbox" id="pdf" className="modal-toggle" />
                <div className="modal">
                  <div className="modal-box" style={{ minHeight: "80vh", minWidth: "40vw" }}>
                    <button className="absolute left-2 top-2 btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white flex justify-end">
                      <PDFDownloadLink document={generatePdfContent()} fileName="Reporte.pdf">
                        {({ loading }) =>
                          loading ?
                            <span className="loading loading-spinner loading-xs"></span>
                            :
                            <i className="fa-solid fa-file-arrow-down fa-xl"></i>
                        }
                      </PDFDownloadLink>
                    </button>
                    <div className="modal-action">
                      <label
                        htmlFor="pdf"
                        className="absolute right-2 top-2 btn btn-sm btn-ghost mask mask-squircle hover:bg-red-600 hover:text-white"
                      >
                        ✕
                      </label>
                    </div>
                    <div className="mt-8">
                      <PDFViewer style={{ width: '100%', height: '70vh' }}>
                        {generatePdfContent()}
                      </PDFViewer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:row-span-4">
                <p className="my-4 text-3xl font-semibold">Mejores Docentes</p>
                <div className="rounded-lg shadow-xl bg-base-100 overflow-y-auto overflow-hidden max-h-44">
                  {topTeachers.map((teacher, index) => (
                    <div key={index} className="p-2 rating flex items-center">
                      <div className="tooltip tooltip-right" data-tip={teacher.teacher}>
                        <button className="ml-2 mask mask-squircle bg-orange-600 h-10 w-10 flex items-center justify-center text-white">
                          {teacher.teacher.charAt(0)}
                        </button>
                      </div>
                      {renderRatingStars(teacher.rating)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:row-span-2">
                <p className="mb-4 text-3xl font-semibold">Por Docente</p>
                <div className="rounded-lg shadow-xl bg-base-100">
                  <div className="p-2">
                    <select className="select select-bordered w-full max-w-xs" onChange={handleTeacherChange}>
                      <option value="">Selecciona un Docente...</option>
                      {uniqueTeachers.map((teacher) => (
                        <option key={teacher}>{teacher}</option>
                      ))}
                    </select>
                    <div className="m-4 flex items-center justify-between">
                      <p className="font-semibold">Cal. Promedio</p>
                      {teacherRating !== null ? (
                        <p className="text-xl flex justify-end">{teacherRating}</p>
                      ) : (
                        <p className="text-xl flex justify-end">-</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg md:col-span-2 md:row-span-4">
                {results && (
                  <div className="p-4 rounded-lg shadow-xl bg-base-100 max-h-96 ">
                    <Line data={chartDataLine} options={options} />;
                  </div>
                )}
              </div>

              <div className="md:col-span-2 md:row-span-4">
                <div className="rounded-lg shadow-xl bg-base-100 overflow-x-auto overflow-y-auto max-h-96">
                  {showTable ? (
                    <table className="table table-xs">
                      <thead className="sticky top-0 bg-orange-600 text-white text-base text-center">
                        <tr>
                          <th className="sticky left-0"></th>
                          <th className="text-left">Docente</th>
                          {uniqueQuestions.map((question, index) => (
                            <th key={question.question}>
                              P{index + 1}
                            </th>
                          ))}
                          <th>Cal. Prom.</th>
                          <th>Enviar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teacherRatings.map((rating, index) => {
                          const teacherForms = formsAnswers.filter((formAnswer) => formAnswer.teacher === rating.teacher);
                          const totalForms = teacherForms.length;

                          const questionAverageRatings = uniqueQuestions.map((question) => {
                            const answersSum = calculateAnswerSum(teacherForms, question);
                            const averageRating = (answersSum / totalForms).toFixed(2);
                            return { question: question.question, answer: averageRating };
                          });

                          const sumQuestionAverageRatings = questionAverageRatings.reduce((sum, questionRating) => {
                            return sum + Number(questionRating.answer);
                          }, 0);

                          const totalAverageRating = (sumQuestionAverageRatings / uniqueQuestions.length).toFixed(2);

                          const sendRatingButton = (
                            <button
                              className="btn btn-ghost mask mask-squircle hover:bg-orange-600 hover:text-white"
                              onClick={() => {
                                const selectedTeacher = { docenteId: rating.teacher };
                                sendAverageRating(selectedTeacher, totalAverageRating, questionAverageRatings);
                              }}
                            >
                              <i className="fa-solid fa-share-nodes fa-lg"></i>
                            </button>
                          );

                          return (
                            <tr key={rating.teacher}>
                              <th className="sticky left-0 bg-base-100">{index + 1}</th>
                              <td>{`${rating.teacher} (${totalForms})`}</td>
                              {uniqueQuestions.map((question) => {
                                const answersSum = calculateAnswerSum(teacherForms, question);
                                const averageRating = (answersSum / totalForms).toFixed(2);
                                return <td key={question.question} className="text-right">{averageRating}</td>;
                              })}
                              <td className="text-right">{totalAverageRating}</td>
                              <td>{sendRatingButton}</td>
                            </tr>
                          );
                        }
                        )}
                      </tbody>
                      <tfoot className="bg-orange-600 text-white text-right text-base">
                        <tr>
                          <th className="sticky left-0"></th>
                          <th className="text-left">Promedio Gral.</th>
                          {uniqueQuestions.map((question, index) => {
                            // Calcular la calificación promedio para cada pregunta
                            let totalAnswer = 0;
                            teacherRatings.forEach((rating) => {
                              const teacherForms = formsAnswers.filter((formAnswer) => formAnswer.teacher === rating.teacher);
                              const answersSum = calculateAnswerSum(teacherForms, question);
                              const averageRating = (answersSum / teacherForms.length).toFixed(2);
                              totalAnswer += Number(averageRating);
                            });
                            const averageRating = (totalAnswer / teacherRatings.length).toFixed(2);
                            return (
                              <td key={question.question}>
                                {averageRating}
                              </td>
                            );
                          })}
                          <td>
                            {totalRowAverage}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  ) : (
                    <div>
                      <PolarArea data={chartDataQuestions} options={optionsQuestions}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:row-span-4">
                <p className="mb-4 text-3xl font-semibold">Preguntas</p>
                <div className="p-4 rounded-lg shadow-xl bg-base-100 overflow-y-auto max-h-80">
                  {uniqueQuestions.map((question, index) => (
                    <div key={question.question}>
                      <p className="font-semibold text-lg">P{index + 1}...
                        <span className="font-normal text-base">
                          {question.question}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:row-span-2">
                <p className="mb-4 text-3xl font-semibold">Por Pregunta</p>
                <div className="rounded-lg shadow-xl bg-base-100">
                  <div className="p-2">
                    <select className="select select-bordered w-full max-w-xs" onChange={handleQuestionChange}>
                      <option value="">Selecciona una pregunta...</option>
                      {uniqueQuestions.map((question) => (
                        <option key={question._id}>{question.question}</option>
                      ))}
                    </select>
                    <div className="m-4 flex items-center justify-between">
                      <p className="font-semibold">Cal. Promedio</p>
                      {selectedQuestionRating !== null ? (
                        <p className="text-xl flex justify-end">{selectedQuestionRating}</p>
                      ) : (
                        <p className="text-xl flex justify-end">-</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-6">
                <div className="collapse bg-base-200">
                  <input type="checkbox" />
                  <div className="collapse-title">
                    Click para visualizar/ocultar información acerca del Dashboard.
                  </div>
                  <div className="collapse-content">
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>El gráfico actualiza la calificación promedio en función de "Filtrar Por...".</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>"Otros" cuenta con las opciones de: "Núm. de Estudiantes" permite visualizar el número de estudiantes en un bloque, de acuerdo al campus seleccionado. "Gráfica de Preguntas" permite cambiar la tabla por una grafica, permitiendo una visualización mas específica sobre la calificación promedio de cada pregunta. "Compartir Resultados" permite compartir la calificación promedio de todos los docentes.</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>"Progreso" se muestra según el filtro seleccionado.</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>"Vista del Formulario" es una visualización del formulario de donde se obtienen los resultados.</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>"Reporte" permite visualizar un formato pdf de la tabla, sus preguntas correspondientes y los mejores docentes evaluados. Permite descargar dicho archivo en formato ".pdf".</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>"Mejores Docentes" muestra los 10 docentes mejor evaluados.</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>"Por Docente" y "Por Pregunta" proporcionan de manera especifica la calificación promedio del docente o pregunta seleccionada.</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>Se muestra un gráfico que permite visualizar la calificación promedio de cada docente que pertenezca a la opción seleccionada en "Progreso" correspondiente al filtro seleccionado.</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>La tabla proporciona información general sobre la calificación promedio de cada docente y las preguntas del formulario. Permite compartir la calificación promedio del docente de manera individual.</span>
                    </div>
                    <div className="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>"Preguntas" muestra las preguntas relacionadas a los encabezados de la tabla.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="drawer-side">
            <label htmlFor="form" className="drawer-overlay"></label>
            <div className="p-4 w-96 bg-base-100">
              <div className="w-full navbar bg-base-100 border-b border-orange-600">
                <div className="flex-none">
                  <div className="tooltip tooltip-right" data-tip="Información del Alumno">
                    <button className="btn btn-ghost mask mask-squircle bg-orange-500 h-10 w-10 flex items-center justify-center text-white hover:bg-orange-600">
                    </button>
                  </div>
                </div>
                <div className="flex-1 px-2 mx-2">
                  <h1 className="text-lg font-bold">{form.title}</h1>
                </div>
                <div className="tooltip tooltip-left" data-tip="Acerca del Formulario">
                  <button className="btn btn-ghost mask mask-squircle">
                    <i className="fa-solid fa-info fa-lg"></i>
                  </button>
                </div>
              </div>
              <div className="card-body">
                <p>{form.description}</p>
                <div className="m-2 flex items-center justify-between">
                  <select
                    className="select select-bordered w-48 max-w-xs"
                  >
                    <option value="">Selecciona un Docente...</option>
                  </select>
                  <div className="flex justify-end">
                    <button type="button" className="btn btn-ghost mask mask-squircle">
                      <i className="fa-solid fa-paper-plane fa-xl"></i>
                    </button>
                  </div>
                </div>
                <div className="h-80 overflow-y-scroll">
                  {form.questions.map((question, index) => (
                    <div key={index} className="m-2 border-b border-orange-600">
                      <p className="text-lg">{question.question}</p>
                      {question.type === 'text' && (
                        <div className="m-2">
                          <input
                            type="text"
                            placeholder="Escribe tu respuesta..."
                            className="input input-bordered w-full max-w-xs" />
                        </div>
                      )}
                      {question.type === 'multiple-choice' && (
                        <div className="m-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                className="checkbox mr-2" />
                              <p>{option.option}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === 'scale' && question.scale && (
                        <div className="m-2 w-full max-w-xs">
                          <input
                            type="range"
                            className="range" />
                          <div className="w-full flex justify-between text-xs px-2">
                            <span>{question.scale.min}</span>
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                            <span>6</span>
                            <span>7</span>
                            <span>8</span>
                            <span>9</span>
                            <span>{question.scale.max}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div >
      )
      }
    </>
  )
}

export default Hero