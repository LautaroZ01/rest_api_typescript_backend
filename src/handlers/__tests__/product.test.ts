import request from 'supertest'
import server from '../../server'
import { response } from 'express'

describe('POST /api/products', () => {

    it('should display validation errors', async () => {
        const res = await request(server).post('/api/products').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(4)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)

    })

    it('should validate that the price is greater then 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Monitor Curvo",
            price: 0
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)

    })

    it('should validate that the price is a number and greaster then 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Monitor Curvo",
            price: "Hola"
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(1)

    })

    it('should create a new product', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 50
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('error')
    })

})

describe('GET /api/products', () => {

    it('should check if api/products url exists', async () => {
        const res = await request(server).get('/api/products')
        expect(res.status).not.toBe(404)

    })

    it('GET a JSON response with products', async () => {
        const res = await request(server).get('/api/products')

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveLength(1)
        expect(res.headers['content-type']).toMatch(/json/)

        expect(res.body).not.toHaveProperty('errors')
        expect(res.body.data).not.toHaveLength(2)
    })
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(server).get(`/api/products/${productId}`)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Producto no encontrado')
    })

    it('Should check a valid ID in the URL', async () => {
        const res = await request(server).get('/api/products/not-valid-url')

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Id no valido')

    })

    it('get a JSON response for a single product', async () => {
        const res = await request(server).get('/api/products/1')

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

    })
})

describe('PUT /api/products/:id', () => {
    it('Should check a valid ID in the URL', async () => {
        const res = await request(server).put('/api/products/not-valid-url').send({
            name: "Monitor Actualizado",
            price: 320,
            availability: true
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Id no valido')

    })

    it('should display validation error message when updating a product', async () => {
        const res = await request(server).put('/api/products/1').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(5)

        expect(res.status).not.toBe(200)
        expect(res.body).toHaveProperty('errors')

    })

    it('should validation that the price is greater then 0', async () => {
        const res = await request(server)
            .put('/api/products/1')
            .send({
                name: "Monitor Actualizado",
                price: 0,
                availability: true
            })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('El precio no es valido')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')

    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(server)
            .put(`/api/products/${productId}`)
            .send({
                name: "Monitor Actualizado",
                price: 300,
                availability: true
            })

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')

    })

    it('should update an existing product with valid data', async () => {
        const res = await request(server)
            .put(`/api/products/1`)
            .send({
                name: "Monitor Actualizado",
                price: 300,
                availability: true
            })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('errors')

    })
})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const res = await request(server).patch(`/api/products/${productId}`)

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const res = await request(server).patch(`/api/products/1`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.availability).toBe(false)

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('error')

    })
})

describe('DELETE /api/products/:id', () => {
    it('should check a valid ID', async () => {
        const res = await request(server).delete('/api/products/not-valid')

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('Id no valido')

        expect(res.status).not.toBe(200)
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(server).delete(`/api/products/${productId}`)

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)

    })

    it('should delete a product', async () => {
        const res = await request(server).delete('/api/products/1')

        expect(res.status).toBe(200)
        expect(res.body.data).toBe('Producto Eliminado')

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(400)

    })

})