import crypto from 'crypto';
import { Model, DataTypes } from "sequelize";
import sequelize from "../db/postgresdb";
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


interface IProfileRequest {
  email: string,
  login: string,
  password: string,
  role: string,
  avatar: string,
  team: string,
}

interface IProfileResponse {
  login: string,
  role: string,
  avatar: string,
  team: string,
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
  createdAt: Date;

  getSignedJwtToken(): string;
  matchPassword(password: string): Promise<boolean>;
  toResponse(): IProfileResponse;
  getResetPasswordToken(): string;
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

  public readonly createdAt!: Date;

  getSignedJwtToken(): string {
    return jwt.sign({
      login: this.login,
      id: this.id,
      time: this.createdAt,
    }, process.env.JWT_SECRET as Secret, {
      expiresIn: process.env.JWT_EXPIRE
    })
  }

  async matchPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }

  toResponse(): IProfileResponse {
    const { login, role, avatar, team } = this;
    return { login, role, avatar, team };
  }

  getResetPasswordToken(): string {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
  }
};

ProfileModel.init({
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
  },
  team: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  updatedAt: false,
  modelName: 'profile',
})

ProfileModel.sync();

export default ProfileModel;
export { IProfile, IProfileRequest, IProfileResponse };