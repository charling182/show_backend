'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('configurations', [
      {
        id: 1,
        rsa_private_key: `-----BEGIN RSA PRIVATE KEY-----
        MIIBPAIBAAJBAJxyBWuwr6Ctr6UBNp9VFvanTLykZfxGm2qdwEaOqWqWTPGxZ//O
        csaJK2+aONnsvoryMDuVOs+NsugZbS9Z6asCAwEAAQJBAJl06sZIqO3GkR0cxJSj
        5YOKdaYw6Gz+YWLCXKGZPKt0Na9fxmrlq0QQYMEKBDsbGMQxrbMA2qNf4fxKSeTI
        KcECIQDwu0yEG/o28HDbqCtraRcp0ldrNMb8ACgT5u+rDEQOCwIhAKZeL+MWO3QU
        NC0gry3CZM/G5zKdp9qPRb3bw7pcAfbhAiEA1MsLoP/GFwhFCrXF48Vad1p6ccaO
        WjWdN7J8irtl8O8CIAxscCsHF/19HMBZ9nr2T0zsz4sKFuTNWinpZV5fTI5BAiEA
        6kdlV030ql/FTHcxEm2138M3ecj6tFRNLVTcYslteEI=
        -----END RSA PRIVATE KEY-----`,
        rsa_public_key: `-----BEGIN PUBLIC KEY-----
        MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJxyBWuwr6Ctr6UBNp9VFvanTLykZfxG
        m2qdwEaOqWqWTPGxZ//OcsaJK2+aONnsvoryMDuVOs+NsugZbS9Z6asCAwEAAQ==
        -----END PUBLIC KEY-----`,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('configurations', null, {});
  }
};
