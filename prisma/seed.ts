import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 게스트 데모 계정 고정 UUID
const GUEST_USER_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  console.log('🌱 Seeding demo data...');

  // 1. Steps 테이블 (1-1 ~ 7-2)
  const stepDefs = [
    { mainNum: 1, subNums: [1, 2, 3, 4, 5, 6] },
    { mainNum: 2, subNums: [1, 2, 3, 4] },
    { mainNum: 3, subNums: [1, 2, 3] },
    { mainNum: 4, subNums: [1, 2, 3, 4] },
    { mainNum: 5, subNums: [1, 2, 3, 4] },
    { mainNum: 6, subNums: [1, 2, 3] },
    { mainNum: 7, subNums: [1, 2] },
  ];

  const stepMap: Record<string, number> = {};

  for (const { mainNum, subNums } of stepDefs) {
    for (const subNum of subNums) {
      const step = await prisma.step.upsert({
        where: {
          id: (mainNum - 1) * 10 + subNum,
        },
        update: {},
        create: {
          id: (mainNum - 1) * 10 + subNum,
          mainNum,
          subNum,
        },
      });
      stepMap[`${mainNum}-${subNum}`] = step.id;
    }
  }
  console.log('✅ Steps created');

  // 2. 게스트 데모 유저
  const guestUser = await prisma.user.upsert({
    where: { id: GUEST_USER_ID },
    update: {},
    create: {
      id: GUEST_USER_ID,
      name: '게스트',
      nickname: 'guest',
      username: 'guest@bogam.demo',
      password: '$2b$10$placeholder.hash.not.for.login.xxxxxxxxxxxxxxxxxx',
      pinNumber: '000000',
      phoneNumber: '010-0000-0000',
    },
  });
  console.log('✅ Guest user created:', guestUser.nickname);

  // 3. 샘플 주소 (서울 강남구 역삼동 아파트)
  const sampleAddress = await prisma.address.upsert({
    where: {
      latitude_longitude_dong_ho: {
        latitude: 37.500632,
        longitude: 127.036439,
        dong: '101동',
        ho: '1201호',
      },
    },
    update: {},
    create: {
      latitude: 37.500632,
      longitude: 127.036439,
      legalDistrictCode: '1168010600',
      dong: '101동',
      ho: '1201호',
      lotAddress: '서울특별시 강남구 역삼동 736-1',
      roadAddress: '서울특별시 강남구 테헤란로 427',
    },
  });
  console.log('✅ Sample address created');

  // 4. UserAddress
  const userAddress = await prisma.userAddress.upsert({
    where: {
      userId_nickname: {
        userId: GUEST_USER_ID,
        nickname: '역삼 샘플 매물',
      },
    },
    update: {},
    create: {
      userId: GUEST_USER_ID,
      addressId: sampleAddress.id,
      nickname: '역삼 샘플 매물',
      isPrimary: true,
      isSelected: true,
    },
  });
  console.log('✅ UserAddress created:', userAddress.nickname);

  // 5. StepResult 데이터 (전 단계 완료 상태)
  const stepResults = [
    // Step 1: 집 고를 때 (TextOnly - 학습 단계, details만 존재)
    { key: '1-1', match: 0, mismatch: 0, unchecked: 0, details: { read: true } },
    { key: '1-2', match: 0, mismatch: 0, unchecked: 0, details: { read: true } },
    { key: '1-3', match: 0, mismatch: 0, unchecked: 0, details: { read: true } },
    { key: '1-4', match: 0, mismatch: 0, unchecked: 0, details: { read: true } },
    { key: '1-5', match: 0, mismatch: 0, unchecked: 0, details: { read: true } },
    { key: '1-6', match: 0, mismatch: 0, unchecked: 0, details: { read: true } },

    // Step 2: 계약 전 확인
    {
      key: '2-1',
      match: 3, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'yes' },
        summary: '등기부등본 확인 완료',
      },
    },
    {
      key: '2-2',
      match: 2, mismatch: 0, unchecked: 1,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'unchecked' },
        summary: '건축물대장 확인 완료',
      },
    },
    {
      key: '2-3',
      match: 2, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes' },
        summary: '임대인 신분 확인 완료',
      },
    },
    {
      key: '2-4',
      match: 3, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'yes' },
        summary: '확정일자 및 전입신고 계획 확인',
      },
    },

    // Step 3: 계약 시 확인
    {
      key: '3-1',
      match: 4, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'yes', q4: 'yes' },
        summary: '계약서 특약사항 확인 완료',
      },
    },
    {
      key: '3-2',
      match: 2, mismatch: 1, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'no', q3: 'yes' },
        summary: '중개사 확인 — 일부 주의 필요',
      },
    },
    {
      key: '3-3',
      match: 3, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'yes' },
        summary: '계약금 지급 확인 완료',
      },
    },

    // Step 4: 잔금 전 확인
    {
      key: '4-1',
      match: 3, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'yes' },
        summary: '잔금 지급 전 등기부등본 재확인',
      },
    },
    {
      key: '4-2',
      match: 2, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes' },
        summary: '전세보증보험 가입 확인',
      },
    },
    {
      key: '4-3',
      match: 2, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes' },
        summary: '전입신고 완료',
      },
    },
    {
      key: '4-4',
      match: 2, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes' },
        summary: '확정일자 완료',
      },
    },

    // Step 5: 입주 후 확인
    {
      key: '5-1',
      match: 3, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'yes' },
        summary: '입주 상태 확인 완료',
      },
    },
    {
      key: '5-2',
      match: 2, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes' },
        summary: '관리비 납부 방법 확인',
      },
    },
    {
      key: '5-3',
      match: 2, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes' },
        summary: '세입자 권리 확인 완료',
      },
    },
    {
      key: '5-4',
      match: 2, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes' },
        summary: '비상연락망 확인',
      },
    },

    // Step 6: 만기 전 확인
    {
      key: '6-1',
      match: 3, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'yes' },
        summary: '계약 갱신 요구권 확인',
      },
    },
    {
      key: '6-2',
      match: 2, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes' },
        summary: '보증금 반환 계획 확인',
      },
    },
    {
      key: '6-3',
      match: 2, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes' },
        summary: '이사 일정 조율 완료',
      },
    },

    // Step 7: 종합 진단
    {
      key: '7-1',
      match: 4, mismatch: 1, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'yes', q4: 'no', q5: 'yes' },
        summary: '전세 위험도 진단 — 주의 1건',
      },
    },
    {
      key: '7-2',
      match: 3, mismatch: 0, unchecked: 0,
      details: {
        answers: { q1: 'yes', q2: 'yes', q3: 'yes' },
        summary: '최종 안전 확인 완료',
      },
    },
  ];

  for (const { key, match, mismatch, unchecked, details } of stepResults) {
    const stepId = stepMap[key];
    if (!stepId) {
      console.warn(`⚠️  Step ${key} not found in stepMap`);
      continue;
    }

    await prisma.stepResult.upsert({
      where: {
        userAddressId_stepId: {
          userAddressId: userAddress.id,
          stepId,
        },
      },
      update: { match, mismatch, unchecked, details },
      create: {
        userAddressId: userAddress.id,
        stepId,
        match,
        mismatch,
        unchecked,
        details,
      },
    });
  }
  console.log('✅ StepResults created (25 steps)');

  // 6. 샘플 RealEstate 데이터
  await prisma.realEstate.upsert({
    where: { userAddressId: userAddress.id },
    update: {},
    create: {
      userAddressId: userAddress.id,
      realEstateData: JSON.stringify({
        buildingName: '역삼 아이파크',
        exclusiveArea: 59.94,
        supplyArea: 84.96,
        floor: 12,
        totalFloors: 25,
        buildYear: 2018,
        usage: '아파트',
        ownerCount: 1,
        mortgageAmount: 0,
        leaseAmount: 450000000,
        salePrice: 1050000000,
        danjiInfo: {
          name: '역삼 아이파크',
          totalHouseholds: 452,
        },
      }),
    },
  });
  console.log('✅ RealEstate data created');

  // 7. 샘플 GuaranteeLimit 데이터
  await prisma.guaranteeLimit.upsert({
    where: { userAddressId: userAddress.id },
    update: {},
    create: {
      userAddressId: userAddress.id,
      guaranteeLimitData: JSON.stringify({
        maxGuaranteeAmount: 500000000,
        currentGuaranteeAmount: 450000000,
        safetyRatio: 85.7,
        riskLevel: 'low',
        recommendation: '보증보험 가입 권장',
      }),
    },
  });
  console.log('✅ GuaranteeLimit data created');

  // 8. 샘플 Broker 데이터
  await prisma.broker.upsert({
    where: { userAddressId: userAddress.id },
    update: {},
    create: {
      userAddressId: userAddress.id,
      brokerData: JSON.stringify({
        officeName: '역삼공인중개사사무소',
        agentName: '김민준',
        registrationNumber: '11680-2019-00123',
        phone: '02-555-1234',
        address: '서울 강남구 테헤란로 123',
        isVerified: true,
      }),
    },
  });
  console.log('✅ Broker data created');

  console.log('\n🎉 Seed complete!');
  console.log(`   Guest user: nickname="guest", id="${GUEST_USER_ID}"`);
  console.log(`   Address: 서울 강남구 역삼동 736-1 / 역삼 샘플 매물`);
  console.log(`   UserAddress ID: ${userAddress.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
