export default {
    type: "object",
    properties: {
      userId: { type: 'string' },
      total:{ type: 'int' }
    },
    required: ['userId', 'total']
  } as const;
  