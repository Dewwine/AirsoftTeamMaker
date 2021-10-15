import { Response, Request } from 'express';
import { getProfileById } from '../services/profileService';
import {
  approveManagerById,
  declineManagerById,
  BanProfileById,
  UnbanProfileById,
} from '../services/adminService';

import { IProfile } from '../models/profileModel';
import { IManagerRequest } from '../models/managerRequestsModel';
import { getManagerRequestByProfileId, getAllManagerRequests } from '../services/adminService';

// Admin
const approveManager = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const profile: IProfile | null = await getProfileById(id);
  if (!profile) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const managerRequest = await getManagerRequestByProfileId(id);
  if (!managerRequest) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  await approveManagerById(id);
  res.status(200).json({ message: 'Application approved' });
};

const declineManager = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const profile: IProfile | null = await getProfileById(id);
  if (!profile) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const managerRequest = await getManagerRequestByProfileId(id);
  if (!managerRequest) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  await declineManagerById(id);
  res.status(200).json({ message: 'Application declined' });
};

const banProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const { suspendReason } = req.body;
  if (!suspendReason) {
    res.status(404).json({ message: 'No reason' });
    return;
  }

  const profile: IProfile | null = await getProfileById(id);
  if (!profile) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  if (profile.role === 'admin') {
    res.status(403).json({ message: 'Profile is admin' });
    return;
  }

  await BanProfileById(id, suspendReason);
  res.status(200).json({ message: 'Profile banned' });
};

const unbanProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const { suspendReason } = req.body;
  if (!suspendReason) {
    res.status(404).json({ message: 'No reason' });
    return;
  }

  const profile: IProfile | null = await getProfileById(id);
  if (!profile) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  if (profile.role === 'admin') {
    res.status(403).json({ message: 'Profile is admin' });
    return;
  }

  await UnbanProfileById(id, suspendReason);
  res.status(200).json({ message: 'Profile unbanned' });
};

const getManagerRequests = async (_req: Request, res: Response) => {
  const teamApplications: Array<IManagerRequest> | null = await getAllManagerRequests();
  if (!teamApplications) {
    res.status(404).json({ message: 'Applications not found' });
    return;
  }

  res.status(200).json(teamApplications);
};

export { approveManager, declineManager, banProfile, unbanProfile, getManagerRequests };
