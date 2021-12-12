export default {
    type: "object",
    properties: {
      email: { type: 'string' },
      name:{ type: 'string' },
      balance:{ type: 'int' }
    },
    required: ['email', 'name']
  } as const;
  