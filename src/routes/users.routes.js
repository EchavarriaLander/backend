import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/users.controller.js';
import { createProfile, getProfiles, updateProfile, deleteProfile } from '../controllers/profiles.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Rutas de autenticación
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);

// Rutas de perfiles
router.get('/users/profiles', authRequired, getProfiles);
router.post('/users/profiles', authRequired, createProfile);
router.put('/users/profiles/:id', authRequired, updateProfile);
router.delete('/users/profiles/:id', authRequired, deleteProfile);

export default router;