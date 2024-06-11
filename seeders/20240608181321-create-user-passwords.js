'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add seed commands here
    await queryInterface.bulkInsert('user_password', [
      {
        userId: 1,
        uuid: '8f929095-8334-466c-92b2-00db3f26e750',
        passwordHash: 'hashedpassword1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        uuid: '53f835ee-ffad-4834-98a9-974a31fc53f2',
        passwordHash: 'hashedpassword2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        uuid: 'fa7752dd-f36c-49fe-8b5c-24644db48d13',
        passwordHash: 'hashedpassword3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        uuid: '479d4703-bde6-4e76-bd36-ae55c11ac205',
        passwordHash: 'hashedpassword4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 5,
        uuid: '76eb27f7-c736-4200-a120-f5d1f69be19d',
        passwordHash: 'hashedpassword5',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Add commands to revert seed here
    await queryInterface.bulkDelete('user_passwords', {
      userId: { [Sequelize.Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
