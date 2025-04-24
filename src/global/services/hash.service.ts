import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import DeviceDetector from 'node-device-detector';
import crypto from 'crypto';

const SALT_OR_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_OR_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function generateDeviceId(req: Request) {
  const userAgent = req.header('user-agent') || req.headers['user-agent'] || '';
  //gets device objects
  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
    deviceTrusted: false,
    deviceInfo: false,
    maxUserAgentSize: 500,
  });
  const device = detector.detect(userAgent);

  const deviceString = JSON.stringify(device);
  const hash = crypto.createHash('sha256').update(deviceString).digest('hex');
  // console.log(hash)
  return hash;
}
