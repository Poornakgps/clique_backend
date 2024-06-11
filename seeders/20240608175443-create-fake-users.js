'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        uuid: '8f929095-8334-466c-92b2-00db3f26e750',
        fullName: 'Thomas Shelby',
        username: 'shelby123',
        email: 'test1@gmail.com',
        role: 'user',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: '53f835ee-ffad-4834-98a9-974a31fc53f2',
        fullName: 'John Snow',
        username: 'john143',
        email: 'test2@gmail.com',
        role: 'user',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: 'fa7752dd-f36c-49fe-8b5c-24644db48d13',
        fullName: 'Daemon Targaryen',
        username: 'daemon123',
        email: 'test3@gmail.com',
        role: 'user',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: '479d4703-bde6-4e76-bd36-ae55c11ac205',
        fullName: 'Daenerys Targaryen',
        username: 'daenerys123',
        email: 'test4@gmail.com',
        role: 'user',
        gender: 'female',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: '76eb27f7-c736-4200-a120-f5d1f69be19d',
        fullName: 'Joker',
        username: 'joker123',
        email: 'joker@gmail.com',
        role: 'user',
        gender: 'male',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
