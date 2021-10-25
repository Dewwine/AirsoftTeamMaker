import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { ProfileModel, RoleModel, TeamModel } from '../models/associate';

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized (no token or cookie)' });
    return;
  }

  try {
    const decoded: string | jwt.JwtPayload = jwt.verify(
      token as string,
      process.env.JWT_SECRET as Secret,
    );

    if (typeof decoded === 'string') {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    res.locals.profile = await ProfileModel.findByPk(decoded.id, {
      include: [
        { model: RoleModel, as: 'role' },
        { model: TeamModel, as: 'team' },
      ],
    });

    if (!res.locals.profile) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized (Token not match)' });
  }
};

const authorize =
  (...roles: Array<number>) =>
  (_req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.profile.roleId)) {
      res.status(403).json({ message: 'Role forbidden' });
      return;
    }
    next();
  };

export { protect, authorize };
