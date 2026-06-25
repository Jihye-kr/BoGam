import bcrypt from 'bcrypt';
import { prisma } from '@utils/prisma';
import { NextResponse } from 'next/server';
import { formatPhone } from '@utils/formatUtils';
//session에 저장된 카카오 정보 불러오기
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/authOptions';

export async function POST(req: Request) {
  // 인증된 사용자 확인
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: '인증이 필요합니다.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { nickname, phoneNumber, pinNumber } = body;

    if (!nickname || !phoneNumber || !pinNumber) {
      return NextResponse.json(
        { success: false, message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    const hashedPin = await bcrypt.hash(pinNumber, 10);
    const formattedPhone = formatPhone(phoneNumber);

    // ✅ 사용자 정보 업데이트
    const updated = await prisma.user.update({
      where: { username: session.user.username },
      data: {
        nickname,
        pinNumber: hashedPin,
        phoneNumber: formattedPhone,
      },
    });

    return NextResponse.json(
      { success: true, message: '추가 정보가 성공적으로 저장' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[KAKAO_UPDATE_ERROR]', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// ✅ 다른 HTTP 메서드 방지
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
