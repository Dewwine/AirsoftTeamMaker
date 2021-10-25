import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/postgresdb';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface IProfileRequest {
  email: string;
  login: string;
  password: string;
  role: string;
  avatar: string;
}

interface IProfileResponse {
  id: string;
  login: string;
  roleId: number;
  avatar: string;
  teamId: number;
}

interface IProfile extends Model {
  id: string;
  email: string;
  login: string;
  roleId: number;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  avatar: string;
  teamId: number;
  createdAt: Date;

  getSignedJwtToken(): string;
  matchPassword(password: string): Promise<boolean>;
  toResponse(): IProfileResponse;
}

class ProfileModel extends Model implements IProfile {
  public id!: string;
  public email!: string;
  public login!: string;
  public roleId!: number;
  public password!: string;
  public resetPasswordToken!: string;
  public resetPasswordExpire!: Date;
  public avatar!: string;
  public teamId!: number;

  public readonly createdAt!: Date;

  getSignedJwtToken(): string {
    return jwt.sign(
      {
        login: this.login,
        id: this.id,
        time: this.createdAt,
      },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: process.env.JWT_EXPIRE,
      },
    );
  }

  async matchPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  toResponse(): IProfileResponse {
    const { id, login, roleId, avatar, teamId } = this;
    return { id, login, roleId, avatar, teamId };
  }
}

ProfileModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue:
        'uploads/avatars/1635170908486--png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png',
    },
  },
  {
    sequelize,
    updatedAt: false,
    modelName: 'profile',
  },
);



export default ProfileModel;
export { IProfile, IProfileRequest, IProfileResponse };
