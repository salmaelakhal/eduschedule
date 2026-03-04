import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

const DAYS = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

const TIME_RANGES = [
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
  { start: '17:00', end: '18:00' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // ── 1. Time Slots ──
  console.log('📅 Création des créneaux horaires...');
  for (const day of DAYS) {
    for (const range of TIME_RANGES) {
      await prisma.timeSlot.upsert({
        where: { day_startTime: { day, startTime: range.start } },
        update: {},
        create: { day, startTime: range.start, endTime: range.end },
      });
    }
  }
  console.log(`   ✅ ${DAYS.length * TIME_RANGES.length} créneaux créés`);

  // ── 2. Admin ──
  console.log('👤 Création de l\'admin...');
  const hashedAdmin = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@eduschedule.com' },
    update: {},
    create: {
      fullName: 'Super Admin',
      email: 'admin@eduschedule.com',
      password: hashedAdmin,
      role: 'ADMIN',
    },
  });
  console.log('   ✅ admin@eduschedule.com / admin123');

  // ── 3. Matières ──
  console.log('📚 Création des matières...');
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { name: 'Mathématiques' },
      update: {},
      create: { name: 'Mathématiques', description: 'Analyse et algèbre' },
    }),
    prisma.subject.upsert({
      where: { name: 'Algorithmique' },
      update: {},
      create: { name: 'Algorithmique', description: 'Structures de données' },
    }),
    prisma.subject.upsert({
      where: { name: 'Anglais Technique' },
      update: {},
      create: { name: 'Anglais Technique', description: 'Communication pro' },
    }),
  ]);
  console.log('   ✅ 3 matières créées');

  // ── 4. Classes ──
  console.log('🏫 Création des classes...');
  const classes = await Promise.all([
    prisma.class.upsert({
      where: { name: 'L1 Informatique' },
      update: {},
      create: { name: 'L1 Informatique' },
    }),
    prisma.class.upsert({
      where: { name: 'L2 Informatique' },
      update: {},
      create: { name: 'L2 Informatique' },
    }),
  ]);
  console.log('   ✅ 2 classes créées');

  // ── 5. Salles ──
  console.log('🚪 Création des salles...');
  await Promise.all([
    prisma.room.upsert({
      where: { name: 'Amphi A' },
      update: {},
      create: { name: 'Amphi A', capacity: 200 },
    }),
    prisma.room.upsert({
      where: { name: 'Salle Info 1' },
      update: {},
      create: { name: 'Salle Info 1', capacity: 30 },
    }),
  ]);
  console.log('   ✅ 2 salles créées');

  // ── 6. Enseignants ──
  console.log('👨‍🏫 Création des enseignants...');
  const teacherPass = await bcrypt.hash('teacher123', 12);
  await prisma.user.upsert({
    where: { email: 'sara.moussaoui@eduschedule.com' },
    update: {},
    create: {
      fullName: 'Sara Moussaoui',
      email: 'sara.moussaoui@eduschedule.com',
      password: teacherPass,
      role: 'TEACHER',
      subjectId: subjects[0].id,
    },
  });
  await prisma.user.upsert({
    where: { email: 'nadia.elfassi@eduschedule.com' },
    update: {},
    create: {
      fullName: 'Nadia El Fassi',
      email: 'nadia.elfassi@eduschedule.com',
      password: teacherPass,
      role: 'TEACHER',
      subjectId: subjects[1].id,
    },
  });
  console.log('   ✅ 2 enseignants créés');

  // ── 7. Étudiant ──
  console.log('👨‍🎓 Création de l\'étudiant...');
  const studentPass = await bcrypt.hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'ahmed.tazi@eduschedule.com' },
    update: {},
    create: {
      fullName: 'Ahmed Tazi',
      email: 'ahmed.tazi@eduschedule.com',
      password: studentPass,
      role: 'STUDENT',
    },
  });

  // Inscription étudiant → L2 Informatique
  await prisma.enrollment.upsert({
    where: {
      studentId_classId: {
        studentId: student.id,
        classId: classes[1].id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      classId: classes[1].id,
    },
  });
  console.log('   ✅ ahmed.tazi@eduschedule.com / student123');

  console.log('\n🎉 Seed terminé !');
  console.log('\n📋 Comptes de test :');
  console.log('   Admin   : admin@eduschedule.com / admin123');
  console.log('   Teacher : sara.moussaoui@eduschedule.com / teacher123');
  console.log('   Student : ahmed.tazi@eduschedule.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });