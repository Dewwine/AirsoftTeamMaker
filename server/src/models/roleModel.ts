// import { Model, DataTypes } from 'sequelize';
// // import ProfileModel from './profileModel';
// import sequelize from '../db/postgresdb';

// interface IRoleResponse {
//   id: string;
//   name: string;
// }

// interface IRole extends Model {
//   id: string;
//   name: string;
// }

// class RoleModel extends Model implements IRole {
//   public id!: string;
//   public name!: string;
// }

// RoleModel.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     updatedAt: false,
//     createdAt: false,
//     modelName: 'roles',
//   },
// );

// const initial = () => {
//   RoleModel.create({
//     id: 1,
//     name: 'admin',
//   });
//   RoleModel.create({
//     id: 2,
//     name: 'manager',
//   });
//   RoleModel.create({
//     id: 3,
//     name: 'player',
//   });
// };

// RoleModel.sync().then(() => {
//   initial();
// });

// export default RoleModel;
// export { IRole, IRoleResponse };
