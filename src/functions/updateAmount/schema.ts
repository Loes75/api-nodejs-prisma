export default {
    type: "object",
    properties: {
      id: { type: 'string' },
      amount:{ type: 'int' }
    },
    required: ['id', 'amount']
  } as const;
  