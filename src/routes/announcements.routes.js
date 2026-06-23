import { Router } from 'express'
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcements.controller.js'
import {
  getAnnouncementsValidator,
  getByIdValidator,
  createAnnouncementValidator,
  updateAnnouncementValidator,
} from '../validators/announcements.validators.js'

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Announcement:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - category
 *         - contactInfo
 *       properties:
 *         id:
 *           type: integer
 *           description: Унікальний ID оголошення
 *         title:
 *           type: string
 *           description: Назва оголошення (5-100 символів)
 *         description:
 *           type: string
 *           description: Детальний опис (мінімум 10 символів)
 *         price:
 *           type: number
 *           format: float
 *           description: Ціна (більше 0)
 *         category:
 *           type: string
 *           enum: [sale, service, job, other]
 *           description: Категорія оголошення
 *         contactInfo:
 *           type: string
 *           description: Контактна інформація (мінімум 5 символів)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Отримання списку оголошень з пагінацією
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук по назві
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *         description: Порядок сортування (новий або старий)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Номер сторінки (10 записів на сторінку)
 *     responses:
 *       200:
 *         description: Список оголошень з метаданими пагінації
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Announcement'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     perPage:
 *                       type: integer
 */
router.get('/', getAnnouncementsValidator, getAnnouncements)

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Отримання оголошення за ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID оголошення
 *     responses:
 *       200:
 *         description: Дані оголошення
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Announcement'
 *       404:
 *         description: Оголошення не знайдено
 */
router.get('/:id', getByIdValidator, getAnnouncementById)

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Створення нового оголошення
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - category
 *               - contactInfo
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *               category:
 *                 type: string
 *                 enum: [sale, service, job, other]
 *               contactInfo:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       201:
 *         description: Створене оголошення
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Announcement'
 *       400:
 *         description: Помилка валідації або невірний формат JSON
 */
router.post('/', createAnnouncementValidator, createAnnouncement)

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     summary: Часткове оновлення оголошення
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID оголошення
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *               category:
 *                 type: string
 *                 enum: [sale, service, job, other]
 *               contactInfo:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       200:
 *         description: Оновлене оголошення
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Announcement'
 *       400:
 *         description: Помилка валідації (не надіслано жодного поля або невірна схема)
 *       404:
 *         description: Оголошення не знайдено
 */
router.patch('/:id', updateAnnouncementValidator, updateAnnouncement)

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Видалення оголошення за ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID оголошення
 *     responses:
 *       204:
 *         description: Оголошення успішно видалено (без тіла відповіді)
 *       404:
 *         description: Оголошення не знайдено
 */
router.delete('/:id', getByIdValidator, deleteAnnouncement)

export default router
