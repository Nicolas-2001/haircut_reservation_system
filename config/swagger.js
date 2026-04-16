const swaggerUi = require("swagger-ui-express");

const swaggerSpec = {
	openapi: "3.0.0",
	info: {
		title: "Haircut Reservation System API",
		version: "1.0.0",
		description: "API for managing haircut reservations",
	},
	servers: [{ url: "/api" }],
	tags: [
		{ name: "Clients" },
		{ name: "Professionals" },
		{ name: "Services" },
		{ name: "Appointments" },
	],
	components: {
		schemas: {
			ApiResponse: {
				type: "object",
				properties: {
					status: { type: "integer" },
					message: { type: "string" },
					data: { nullable: true },
					error: { nullable: true },
				},
			},
			Person: {
				type: "object",
				required: ["name", "email", "phone"],
				properties: {
					name: { type: "string", example: "John Doe" },
					email: { type: "string", example: "john@gmail.com" },
					phone: { type: "string", example: "3001234567" },
				},
			},
			Service: {
				type: "object",
				required: ["name", "description", "duration_minutes", "price"],
				properties: {
					name: { type: "string", example: "Haircut" },
					description: { type: "string", example: "Classic haircut service" },
					duration_minutes: { type: "integer", example: 45 },
					price: { type: "number", example: 25000 },
				},
			},
			AppointmentCreate: {
				type: "object",
				required: ["client_id", "professional_id", "service_id", "appointment_date", "start_time"],
				properties: {
					client_id: { type: "integer", example: 1 },
					professional_id: { type: "integer", example: 2 },
					service_id: { type: "integer", example: 1 },
					appointment_date: { type: "string", format: "date", example: "2026-04-20" },
					start_time: { type: "string", example: "10:00:00" },
					notes: { type: "string", example: "Classic cut", nullable: true },
				},
			},
			AppointmentUpdate: {
				type: "object",
				properties: {
					appointment_date: { type: "string", format: "date", example: "2026-04-22" },
					start_time: { type: "string", example: "11:00:00" },
					status_id: { type: "integer", example: 4 },
					notes: { type: "string", example: "Rescheduled", nullable: true },
				},
			},
			AssignService: {
				type: "object",
				required: ["service_id"],
				properties: {
					service_id: { type: "integer", example: 1 },
				},
			},
		},
		parameters: {
			IdParam: {
				name: "id",
				in: "path",
				required: true,
				schema: { type: "integer" },
			},
		},
	},
	paths: {
		"/clients": {
			get: {
				tags: ["Clients"],
				summary: "Get all clients",
				responses: {
					200: { description: "List of clients", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } } },
				},
			},
			post: {
				tags: ["Clients"],
				summary: "Create a client",
				requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Person" } } } },
				responses: {
					201: { description: "Client created" },
					400: { description: "Invalid data" },
					409: { description: "Email already in use" },
				},
			},
		},
		"/clients/{id}": {
			get: {
				tags: ["Clients"],
				summary: "Get client by ID",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				responses: {
					200: { description: "Client found" },
					404: { description: "Client not found" },
				},
			},
			patch: {
				tags: ["Clients"],
				summary: "Update client",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Person" } } } },
				responses: {
					200: { description: "Client updated" },
					400: { description: "Invalid data" },
					404: { description: "Client not found" },
				},
			},
		},
		"/clients/{id}/deactivate": {
			patch: {
				tags: ["Clients"],
				summary: "Deactivate client",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				responses: {
					200: { description: "Client deactivated" },
					404: { description: "Client not found" },
				},
			},
		},
		"/professionals": {
			get: {
				tags: ["Professionals"],
				summary: "Get all professionals with their services",
				responses: {
					200: { description: "List of professionals" },
				},
			},
			post: {
				tags: ["Professionals"],
				summary: "Create a professional",
				requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Person" } } } },
				responses: {
					201: { description: "Professional created" },
					400: { description: "Invalid data" },
					409: { description: "Email already in use" },
				},
			},
		},
		"/professionals/{id}": {
			get: {
				tags: ["Professionals"],
				summary: "Get professional by ID with their services",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				responses: {
					200: { description: "Professional found" },
					404: { description: "Professional not found" },
				},
			},
			patch: {
				tags: ["Professionals"],
				summary: "Update professional",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Person" } } } },
				responses: {
					200: { description: "Professional updated" },
					400: { description: "Invalid data" },
					404: { description: "Professional not found" },
				},
			},
		},
		"/professionals/{id}/deactivate": {
			patch: {
				tags: ["Professionals"],
				summary: "Deactivate professional",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				responses: {
					200: { description: "Professional deactivated" },
					404: { description: "Professional not found" },
				},
			},
		},
		"/professionals/{id}/services": {
			post: {
				tags: ["Professionals"],
				summary: "Assign a service to a professional",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AssignService" } } } },
				responses: {
					200: { description: "Service assigned" },
					400: { description: "Invalid data" },
					404: { description: "Professional or service not found" },
					409: { description: "Service already assigned" },
				},
			},
		},
		"/services": {
			get: {
				tags: ["Services"],
				summary: "Get all services",
				responses: {
					200: { description: "List of services" },
				},
			},
			post: {
				tags: ["Services"],
				summary: "Create a service",
				requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Service" } } } },
				responses: {
					201: { description: "Service created" },
					400: { description: "Invalid data" },
					409: { description: "Name already in use" },
				},
			},
		},
		"/services/{id}": {
			get: {
				tags: ["Services"],
				summary: "Get service by ID",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				responses: {
					200: { description: "Service found" },
					404: { description: "Service not found" },
				},
			},
			patch: {
				tags: ["Services"],
				summary: "Update service",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Service" } } } },
				responses: {
					200: { description: "Service updated" },
					400: { description: "Invalid data" },
					404: { description: "Service not found" },
				},
			},
		},
		"/services/{id}/deactivate": {
			patch: {
				tags: ["Services"],
				summary: "Deactivate service",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				responses: {
					200: { description: "Service deactivated" },
					404: { description: "Service not found" },
				},
			},
		},
		"/appointments": {
			get: {
				tags: ["Appointments"],
				summary: "Get appointments with optional filters",
				parameters: [
					{ name: "client_id", in: "query", schema: { type: "integer" } },
					{ name: "professional_id", in: "query", schema: { type: "integer" } },
					{ name: "service_id", in: "query", schema: { type: "integer" } },
					{ name: "status_id", in: "query", schema: { type: "integer" } },
					{ name: "date_from", in: "query", schema: { type: "string", format: "date" } },
					{ name: "date_to", in: "query", schema: { type: "string", format: "date" } },
				],
				responses: {
					200: { description: "List of appointments" },
					400: { description: "Invalid filters" },
				},
			},
			post: {
				tags: ["Appointments"],
				summary: "Create an appointment",
				requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AppointmentCreate" } } } },
				responses: {
					201: { description: "Appointment created" },
					400: { description: "Invalid data" },
					404: { description: "Client, professional or service not found / professional not available" },
					409: { description: "Time slot conflict" },
				},
			},
		},
		"/appointments/{id}": {
			get: {
				tags: ["Appointments"],
				summary: "Get appointment by ID",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				responses: {
					200: { description: "Appointment found" },
					404: { description: "Appointment not found" },
				},
			},
			patch: {
				tags: ["Appointments"],
				summary: "Update an appointment",
				parameters: [{ $ref: "#/components/parameters/IdParam" }],
				requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AppointmentUpdate" } } } },
				responses: {
					200: { description: "Appointment updated" },
					400: { description: "Invalid data" },
					404: { description: "Appointment not found / professional not available" },
					409: { description: "Time slot conflict" },
				},
			},
		},
	},
};

module.exports = { swaggerUi, swaggerSpec };
