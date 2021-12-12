export default {
    type: "object",
    properties: {
      senderId: { type: 'string' },
      receiverId: { type: 'string' },
      amount: {type: 'int'}
    },
    required: ['senderId', 'receiverId', 'amount']
  } as const;
  