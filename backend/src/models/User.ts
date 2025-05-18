import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';

const prisma = new PrismaClient();

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  agency_name?: string;
  agency_license?: string;
  agency_address?: string;
}

class User {
  static async create(userData: UserData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const verificationToken = jwt.sign(
      { email: userData.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return prisma.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        phone: userData.phone,
        role: userData.role || UserRole.BUYER,
        agency_name: userData.agency_name,
        agency_license: userData.agency_license,
        agency_address: userData.agency_address,
        verification_token: verificationToken,
        verification_token_expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        is_verified: false
      }
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  }

  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  static async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
      const user = await this.findByEmail(decoded.email);

      if (!user || user.verification_token !== token) {
        return null;
      }

      return prisma.user.update({
        where: { id: user.id },
        data: {
          is_verified: true,
          verification_token: null,
          verification_token_expires: null
        }
      });
    } catch (error) {
      return null;
    }
  }

  static async generateNewVerificationToken(email: string) {
    const user = await this.findByEmail(email);
    if (!user || user.is_verified) {
      return null;
    }

    const verificationToken = jwt.sign(
      { email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return prisma.user.update({
      where: { id: user.id },
      data: {
        verification_token: verificationToken,
        verification_token_expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
  }
}

export default User; 