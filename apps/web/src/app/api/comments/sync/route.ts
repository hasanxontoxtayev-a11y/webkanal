import { NextRequest, NextResponse } from 'next/server';

export interface RealYouTubeComment {
  id: string;
  authorDisplayName: string;
  originalText: string;
  detectedLanguage: string;
  videoTitle: string;
  publishedTime?: string;
}

/**
 * Universal YouTube Comment Scraper Engine (InnerTube API)
 * Scrapes real comments from ANY public YouTube channel videos without OAuth barriers
 */
async function fetchLiveYouTubeComments(handleOrQuery: string): Promise<RealYouTubeComment[]> {
  const cleanHandle = handleOrQuery.startsWith('@') ? handleOrQuery : `@${handleOrQuery}`;

  // 1. Find recent videos for this channel
  let videoList: { id: string; title: string }[] = [];

  try {
    const channelRes = await fetch(`https://www.youtube.com/${encodeURIComponent(cleanHandle)}/videos`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'uz-UZ,uz;q=0.9,ru;q=0.8,en;q=0.7',
      },
      next: { revalidate: 180 },
    });

    if (channelRes.ok) {
      const html = await channelRes.text();
      const matches = [...html.matchAll(/\/watch\?v=([a-zA-Z0-9_-]{11})/g)];
      const uniqueIds = [...new Set(matches.map((m) => m[1]))].slice(0, 3);

      for (const vid of uniqueIds) {
        videoList.push({ id: vid, title: `${cleanHandle} Video` });
      }
    }
  } catch (err) {
    console.warn('[YouTube Scraper] Error fetching channel videos:', err);
  }

  // Fallback: search videos if direct channel page didn't yield video IDs
  if (videoList.length === 0) {
    try {
      const sRes = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(handleOrQuery)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'uz-UZ,uz;q=0.9,ru;q=0.8,en;q=0.7',
        },
      });
      if (sRes.ok) {
        const sHtml = await sRes.text();
        const matches = [...sHtml.matchAll(/\/watch\?v=([a-zA-Z0-9_-]{11})/g)];
        const uniqueIds = [...new Set(matches.map((m) => m[1]))].slice(0, 3);
        for (const vid of uniqueIds) {
          videoList.push({ id: vid, title: `${handleOrQuery} Upload` });
        }
      }
    } catch {}
  }

  if (videoList.length === 0) {
    return [];
  }

  const collectedComments: RealYouTubeComment[] = [];

  // 2. For each video, extract InnerTube API Key & continuation token to get real live comments
  for (const video of videoList) {
    if (collectedComments.length >= 6) break;

    try {
      const watchRes = await fetch(`https://www.youtube.com/watch?v=${video.id}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'uz-UZ,uz;q=0.9,ru;q=0.8,en;q=0.7',
        },
      });

      if (!watchRes.ok) continue;
      const html = await watchRes.text();

      // Check if comments are disabled on this video
      if (html.includes('Comments are turned off')) {
        continue;
      }

      // Extract video title if available
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const currentVideoTitle = titleMatch ? titleMatch[1].replace('- YouTube', '').trim() : video.title;

      const keyMatch = html.match(/"INNERTUBE_API_KEY":"(.*?)"/);
      const contMatch = html.match(/"continuationCommand":\{"token":"(.*?)"/);

      if (!keyMatch || !contMatch) continue;

      const apiKey = keyMatch[1];
      const token = contMatch[1];

      const commentRes = await fetch(`https://www.youtube.com/youtubei/v1/next?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20240301.00.00',
              hl: 'uz',
              gl: 'UZ',
            },
          },
          continuation: token,
        }),
      });

      if (!commentRes.ok) continue;
      const data = await commentRes.json();

      // Extract comments from entityBatchUpdate mutations
      const mutations = data?.frameworkUpdates?.entityBatchUpdate?.mutations;
      if (Array.isArray(mutations)) {
        for (const m of mutations) {
          const payload = m?.payload?.commentEntityPayload;
          const text = payload?.properties?.content?.content?.trim();
          const author = payload?.author?.displayName || payload?.properties?.authorButtonA11y || 'YouTube Viewer';
          const time = payload?.properties?.publishedTime;
          const cid = payload?.properties?.commentId || `c_${Math.random().toString(36).slice(2, 9)}`;

          if (text && text.length > 2) {
            // Detect language
            const hasCyrillic = /[а-яё]/i.test(text);
            const isUzbekLatin = /(kerak|boladi|rahmat|qachon|videoni|chiqaring|zor|zo'r|yahshi|yaxshi)/i.test(text);
            const detectedLanguage = hasCyrillic ? 'Russian' : isUzbekLatin ? 'Uzbek' : 'English';

            collectedComments.push({
              id: cid,
              authorDisplayName: author,
              originalText: text,
              detectedLanguage,
              videoTitle: currentVideoTitle,
              publishedTime: time,
            });

            if (collectedComments.length >= 8) break;
          }
        }
      }
    } catch (err) {
      console.warn(`[YouTube Scraper] Error fetching comments for video ${video.id}:`, err);
    }
  }

  return collectedComments;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get('channel')?.trim() || '@kunuz';

    const comments = await fetchLiveYouTubeComments(channel);

    return NextResponse.json({
      success: true,
      channel,
      count: comments.length,
      comments,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
