// refresh-token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { RefreshToken } from './schemas/refreshToken.schema';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async createToken(userId: Types.ObjectId): Promise<string> {
    const rawToken = crypto.randomBytes(64).toString('hex');
    const hashedToken = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await this.refreshTokenModel.create({
      token: hashedToken,
      userId,
      expiresAt,
    });

    return rawToken;
  }

  async validateAndRotate(rawToken: string): Promise<Types.ObjectId> {
    const hashedToken = this.hashToken(rawToken);
    const existing = await this.refreshTokenModel.findOne({
      token: hashedToken,
    });

    if (!existing) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (existing.isRevoked) {
      // reuse of a dead token = compromise signal, kill every session for this user
      await this.revokeAllForUser(existing.userId);
      throw new UnauthorizedException(
        'Refresh token reuse detected, all sessions revoked',
      );
    }

    if (existing.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    existing.isRevoked = true;
    await existing.save();

    return existing.userId;
  }

  async revokeToken(rawToken: string): Promise<void> {
    const hashedToken = this.hashToken(rawToken);
    await this.refreshTokenModel.updateOne(
      { token: hashedToken },
      { isRevoked: true },
    );
  }

  async revokeAllForUser(userId: Types.ObjectId): Promise<void> {
    await this.refreshTokenModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }
}
