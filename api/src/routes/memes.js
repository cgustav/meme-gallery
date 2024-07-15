// routes/memes.js
const express = require("express");
const router = express.Router();
const memesController = require("../controllers/memes");

/**
 * @swagger
 * components:
 *   schemas:
 *     Meme:
 *       type: object
 *       required:
 *         - url
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the meme
 *         url:
 *           type: string
 *           description: The URL of the meme image
 *         title:
 *           type: string
 *           description: The title of the meme
 *         description:
 *           type: string
 *           description: A brief description of the meme
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the meme was created
 *         rating:
 *           type: integer
 *           description: The rating of the meme
 *         author:
 *           type: string
 *           description: The name of the author of the meme
 *       example:
 *         id: 1
 *         url: 'https://s3.amazonaws.com/yourbucket/meme1.jpg'
 *         title: 'First Meme'
 *         description: 'This is the first meme'
 *         created_at: '2023-07-01T00:00:00Z'
 *         rating: 5
 *         author: 'Anonymous'
 */

/**
 * @swagger
 * tags:
 *   name: Memes
 *   description: The memes managing API
 */

/**
 * @swagger
 * /memes:
 *   get:
 *     summary: Returns the list of all the memes
 *     tags: [Memes]
 *     responses:
 *       200:
 *         description: The list of the memes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meme'
 */
router.get("/", memesController.getAllMemes);

/**
 * @swagger
 * /memes:
 *   post:
 *     summary: Creates a new meme
 *     tags: [Memes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meme'
 *     responses:
 *       201:
 *         description: The meme was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meme'
 *       500:
 *         description: Some server error
 */
router.post("/", memesController.createMeme);

module.exports = router;
