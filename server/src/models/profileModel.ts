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
  team: string;
}

interface IProfileResponse {
  id: string;
  login: string;
  role: string;
  avatar: string;
  team: string;
}

interface IProfile extends Model {
  id: string;
  email: string;
  login: string;
  role: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  avatar: string;
  team: string;
  kickReason: string;
  isActive: boolean;
  suspendReason: string;
  createdAt: Date;

  getSignedJwtToken(): string;
  matchPassword(password: string): Promise<boolean>;
  toResponse(): IProfileResponse;
}

class ProfileModel extends Model implements IProfile {
  public id!: string;
  public email!: string;
  public login!: string;
  public role!: string;
  public password!: string;
  public resetPasswordToken!: string;
  public resetPasswordExpire!: Date;
  public avatar!: string;
  public team!: string;
  public kickReason!: string;
  public isActive!: boolean;
  public suspendReason!: string;

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
    const { id, login, role, avatar, team } = this;
    return { id, login, role, avatar, team };
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
    role: {
      type: DataTypes.STRING,
      defaultValue: 'player',
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
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    },
    team: {
      type: DataTypes.STRING,
    },
    kickReason: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    suspendReason: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    updatedAt: false,
    modelName: 'profile',
  },
);

ProfileModel.sync();

export default ProfileModel;
export { IProfile, IProfileRequest, IProfileResponse };
