import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

/* 카카오톡·SNS 공유용 OG 이미지 (1200×630) */
export default async function handler() {

  /* ── 한글 폰트 로드 (타임아웃 3초 제한) ── */
  let fontData = null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&text=' +
      encodeURIComponent('제주도가족여행부모님환갑기념년월일박밤낮어니아버지누나매형도은준후나✈️🍊🎊'),
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        signal: controller.signal,
      }
    ).then(r => r.text());
    clearTimeout(timeout);

    const match = css.match(/src:\s*url\(([^)]+\.woff2[^)]*)\)/);
    if (match) {
      const fontRes = await fetch(match[1]);
      if (fontRes.ok) fontData = await fontRes.arrayBuffer();
    }
  } catch (_) {}

  const fonts = fontData
    ? [{ name: 'NotoKR', data: fontData, weight: 700, style: 'normal' }]
    : [];

  const fontFamily = fontData ? '"NotoKR", sans-serif' : 'sans-serif';

  try {
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(135deg, #0c1a2e 0%, #0f3460 55%, #16213e 100%)',
            fontFamily,
            position: 'relative',
            padding: '0',
          }}
        >
          {/* 좌측 오렌지 사이드바 */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: '12px',
            backgroundImage: 'linear-gradient(180deg, #b45309, #d97706, #b45309)',
            display: 'flex',
          }} />

          {/* 메인 콘텐츠 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0px',
            paddingLeft: '28px',
          }}>

            {/* 환갑 뱃지 */}
            <div style={{
              display: 'flex',
              gap: '14px',
              marginBottom: '22px',
            }}>
              <div style={{
                display: 'flex',
                backgroundImage: 'linear-gradient(135deg, #7c2d12, #b45309)',
                color: '#fef3c7',
                padding: '8px 22px',
                borderRadius: '999px',
                fontSize: '24px',
                fontWeight: 700,
              }}>
                어머니 환갑 기념
              </div>
              <div style={{
                display: 'flex',
                backgroundImage: 'linear-gradient(135deg, #7c2d12, #b45309)',
                color: '#fef3c7',
                padding: '8px 22px',
                borderRadius: '999px',
                fontSize: '24px',
                fontWeight: 700,
              }}>
                아버지 환갑 기념
              </div>
            </div>

            {/* 메인 타이틀 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '78px',
              fontWeight: 900,
              color: 'white',
              marginBottom: '10px',
              letterSpacing: '-2px',
            }}>
              <span>제주도 가족 여행</span>
            </div>

            {/* 날짜 */}
            <div style={{
              display: 'flex',
              fontSize: '34px',
              color: '#fef3c7',
              fontWeight: 700,
              marginBottom: '28px',
            }}>
              2026년 4월 3일 ~ 5일 · 2박 3일 · 7명
            </div>

            {/* 구분선 */}
            <div style={{
              display: 'flex',
              width: '80px',
              height: '4px',
              backgroundColor: '#d97706',
              borderRadius: '4px',
              marginBottom: '28px',
            }} />

            {/* 가족 태그 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                '아버지 · 어머니',
                '누나 · 매형',
                '도은 · 준후',
                '나',
              ].map((label, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    color: 'rgba(255,255,255,0.9)',
                    padding: '10px 20px',
                    borderRadius: '999px',
                    fontSize: '23px',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* URL */}
            <div style={{
              display: 'flex',
              marginTop: '30px',
              fontSize: '20px',
              color: 'rgba(255,255,255,0.3)',
            }}>
              jejuisland-pi.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts,
      }
    );

    return new Response(imageResponse.body, {
      headers: {
        ...Object.fromEntries(imageResponse.headers.entries()),
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
