import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { UserRole } from './entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Create head nurse
    await authService.register({
      name: 'หัวหน้าพยาบาล สมใจ',
      email: 'head@hospital.com',
      password: 'password123',
      role: UserRole.HEAD_NURSE,
    });
    console.log('Head nurse created successfully');

    // Create nurses
    const nurses = [
      { name: 'พยาบาล สมหญิง', email: 'nurse1@hospital.com' },
      { name: 'พยาบาล สมชาย', email: 'nurse2@hospital.com' },
      { name: 'พยาบาล สมศรี', email: 'nurse3@hospital.com' },
    ];

    for (const nurse of nurses) {
      await authService.register({
        name: nurse.name,
        email: nurse.email,
        password: 'password123',
        role: UserRole.NURSE,
      });
      console.log(`${nurse.name} created successfully`);
    }

  } catch (error) {
    console.error('Seeding failed:', error.message);
  }

  await app.close();
}

seed();
