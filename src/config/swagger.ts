import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: "3.0.2",
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'REST API Node.js / Express / TypeScript',
            version: '1.0.0',
            description: 'API Docs for Products'
        }
    },
    apis: ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUIOptions: SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: 'Hola'
        }
    `,
    customSiteTitle: 'Documentacion REST API Express / TypeScript'
}

export default swaggerSpec
export {
    swaggerUIOptions
}