import { Request, Response } from 'express'
// import { check, validationResult } from 'express-validator'
import Product from '../models/Product.model'

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [
                ['id', 'desc']
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
            // limit: 2
        })

        res.json({ data: products })
    } catch (error) {
        // console.log(error)
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({
                error: 'Producto no encontrado'
            })
            return
        }
        res.json({ data: product })
    } catch (error) {
        // console.log(error)
    }

};

// export const getProductById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params
//         const product = await Product.findByPk(id)

//         if (!product) {
//             res.status(404).json({
//                 error: 'Producto no encontrado'
//             })
//         }

//         return res.json({ data: product })
//     } catch (error) {
//         console.log(error)
//     }
// }

export const createProduct = async (req: Request, res: Response) => {

    // Validar
    // await check('name')
    //     .notEmpty().withMessage('El nombre de Producto no puede ir vacio')
    //     .run(req)

    // await check('price')
    //     .isNumeric().withMessage("Valor no valido")
    //     .notEmpty().withMessage('El precio de Producto no puede ir vacio')
    //     .custom(value => value > 0).withMessage('El precio no es valido')
    //     .run(req)

    // let errors = validationResult(req)

    // if (!errors.isEmpty()) {
    //     res.status(400).json({
    //         errors: errors.array()
    //     })
    // }

    try {

        const product = await Product.create(req.body)

        res.status(201).json({
            data: product
        })

    } catch (error) {
        // console.log(error)
    }

}

export const updateProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({
                error: 'Producto no encontrado'
            })
            return
        }

        // Actualizar
        await product.update(req.body)
        await product.save()

        res.json({data: product})

    } catch (error) {
        // console.log(error)
    }
}

export const updateAvailability = async (req: Request, res: Response) => {
    try {

        const { id } = req.params
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({
                error: 'Producto no encontrado'
            })
            return
        }

        // Modificar
        product.availability = !product.dataValues.availability
        await product.save()

        res.json({data: product})

    } catch (error) {
        // console.log(error)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({
                error: 'Producto no encontrado'
            })
            return
        }

        // Eliminar
        await product.destroy()
        res.json({data: 'Producto Eliminado'})

    } catch (error) {
        // console.log(error)
    }
}