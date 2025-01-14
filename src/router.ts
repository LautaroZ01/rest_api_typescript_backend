import { Router } from 'express'
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from './handlers/product'
import { handleInputErrors } from './middleware'

const router = Router()
/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The product ID
 *                  example: 1
 *              name:
 *                  type: string
 *                  description: The product name
 *                  example: Monitor Curvo
 *              price:
 *                  type: number
 *                  description: The product price
 *                  example: 300
 *              availability:
 *                  type: boolean
 *                  description: The availability product
 *                  example: true
 *          required:
 *              - name
 *              - price
 *              - availability
 */


/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: Get a list of products
 *      tags:
 *          - Products
 *      description: Return a list of products
 *      responses: 
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 */

router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product by its ID
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: The product ID
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad request - Invalid ID
 */

router.get('/:id',
    param('id').isInt().withMessage('Id no valido'),
    handleInputErrors,
    getProductById
);

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Create a new Product
 *      tags:
 *          - Products
 *      description: Retun a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo de 32 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Product created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid input data
 *              
 */

router.post('/',
    // Validacion
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio'),

    body('price')
        .isNumeric().withMessage("Valor no valido")
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('El precio no es valido'),
    handleInputErrors,

    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Update a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: The product ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo de 32 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Product updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not found
 */

router.put('/:id',
    param('id').isInt().withMessage('Id no valido'),
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio'),

    body('price')
        .isNumeric().withMessage("Valor no valido")
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('El precio no es valido'),
    body('availability')
        .isBoolean().withMessage('Disponibilidad no valida'),
    handleInputErrors,

    updateProduct)


/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Updated Product availability
 *      tags:
 *          - Products
 *      description: Actualiza la disponibilidad de un producto específico por su ID.
 *      parameters:
 *          - in: path
 *            name: id
 *            description: ID del producto a actualizar
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Product updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid ID
 *          404:
 *              description: Product Not found
 */

router.patch('/:id',
    param('id').isInt().withMessage('Id no valido'),
    handleInputErrors,
    updateAvailability)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a product
 *      tags:
 *          - Products
 *      description: Elimina un producto de la base de datos
 *      parameters:
 *          - in: path
 *            name: id
 *            description: ID del producto a eliminar
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Product updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Producto eliminado'
 *          400:
 *              description: Bad request - Invalid ID
 *          404:
 *              description: Product Not found
 */

router.delete('/:id',
    param('id').isInt().withMessage('Id no valido'),
    handleInputErrors,
    deleteProduct
)

export {
    router
}