import { google } from "googleapis";
import { prisma } from "@kanal/db";
import { decryptToken, encryptToken } from "./crypto";

export class YouTubeService {
  private static getOAuth2Client() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Generates Google OAuth authorization URL with requested YouTube scopes
   */
  public static getAuthUrl(state?: string): string {
    const oauth2Client = this.getOAuth2Client();
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/youtube.readonly",
    ];

    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
      state,
    });
  }

  /**
   * Obtains an authenticated OAuth2 client for a given channel, automatically refreshing expired tokens.
   */
  public static async getAuthenticatedClient(channelId: string) {
    const channel = await prisma.youTubeChannel.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new Error(`YouTube channel with ID ${channelId} not found.`);
    }

    const oauth2Client = this.getOAuth2Client();
    const accessToken = decryptToken(channel.encryptedAccessToken);
    const refreshToken = decryptToken(channel.encryptedRefreshToken);

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: channel.tokenExpiresAt.getTime(),
    });

    // Check if token needs refresh (5 minute safety buffer)
    const isExpired = Date.now() >= channel.tokenExpiresAt.getTime() - 5 * 60 * 1000;
    if (isExpired) {
      const refreshed = await oauth2Client.refreshAccessToken();
      const newCredentials = refreshed.credentials;

      if (newCredentials.access_token) {
        await prisma.youTubeChannel.update({
          where: { id: channelId },
          data: {
            encryptedAccessToken: encryptToken(newCredentials.access_token),
            tokenExpiresAt: new Date(newCredentials.expiry_date || Date.now() + 3600 * 1000),
          },
        });
      }
    }

    return oauth2Client;
  }

  /**
   * Posts an approved reply to a comment thread
   */
  public static async insertCommentReply(channelId: string, parentCommentId: string, replyText: string) {
    const auth = await this.getAuthenticatedClient(channelId);
    const youtube = google.youtube({ version: "v3", auth });

    const response = await youtube.comments.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          parentId: parentCommentId,
          textOriginal: replyText,
        },
      },
    });

    return response.data;
  }

  /**
   * Syncs recent top comments for a given channel's recent videos
   */
  public static async fetchUnansweredComments(channelId: string) {
    const auth = await this.getAuthenticatedClient(channelId);
    const youtube = google.youtube({ version: "v3", auth });

    const response = await youtube.commentThreads.list({
      part: ["snippet"],
      allThreadsRelatedToChannelId: channelId,
      maxResults: 50,
      order: "time",
    });

    return response.data.items || [];
  }
}
