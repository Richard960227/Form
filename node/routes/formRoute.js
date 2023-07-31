import express from 'express';

import { 
    getAllForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
    deleteAllForms,
    getQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    deleteAllQuestions,
    sendFormToStudents,
    FormSelect,
    getSelectedForm,
    getAllFormsAnswers,
    saveFormResponses
} from '../controllers/FormController.js';

const router = express.Router();

router.get('/', getAllForms);
router.get('/:id', getForm);
router.post('/', createForm);
router.put('/:id', updateForm);
router.delete('/:id', deleteForm);
router.delete('/', deleteAllForms);
router.post('/:id/send', sendFormToStudents);

router.get('/:formId/questions', getQuestions);
router.post('/:id/questions', addQuestion);
router.put('/:formId/questions/:questionId', updateQuestion);
router.delete('/:formId/questions/:questionId', deleteQuestion);
router.delete('/:formId/questions', deleteAllQuestions);

router.get('/select/response', getSelectedForm)
router.get('/select/answers', getAllFormsAnswers);
router.post('/select/:formId', FormSelect);
router.delete('/select/:formId', FormSelect);
router.post('/select/:formId/responses', saveFormResponses)

export default router;