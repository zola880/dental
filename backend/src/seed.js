const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('./config/env');
const User = require('./models/User');
const Dentist = require('./models/Dentist');
const Patient = require('./models/Patient');
const Service = require('./models/Service');
const ClinicSetting = require('./models/ClinicSetting');
const logger = require('./utils/logger');

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB for seeding...');

    // Clear existing data (optional - comment out if you want to preserve data)
    // await User.deleteMany({});
    // await Dentist.deleteMany({});
    // await Patient.deleteMany({});
    // await Service.deleteMany({});
    // await ClinicSetting.deleteMany({});

    // 1. Create Admin User
    let adminUser = await User.findOne({ email: 'admin@dentalcare.com' });
    if (!adminUser) {
      adminUser = await User.create({
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@dentalcare.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '+1 (555) 000-0000',
        status: 'active',
      });
      logger.info('✅ Admin user created: admin@dentalcare.com / Admin@123');
    } else {
      logger.info('ℹ️  Admin user already exists');
    }

    // 2. Create Sample Dentist User + Profile
    let dentistUser = await User.findOne({ email: 'dentist@dentalcare.com' });
    if (!dentistUser) {
      dentistUser = await User.create({
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'dentist@dentalcare.com',
        password: 'Dentist@123',
        role: 'dentist',
        phone: '+1 (555) 111-1111',
        status: 'active',
      });

      await Dentist.create({
        user: dentistUser._id,
        specialization: 'General Dentistry',
        licenseNumber: 'DEN-2024-001',
        experience: 10,
        bio: 'Experienced general dentist with a focus on patient comfort.',
        consultationFee: 100,
        isAvailable: true,
        schedule: {
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          startTime: '09:00',
          endTime: '17:00',
        },
      });
      logger.info('✅ Sample dentist created: dentist@dentalcare.com / Dentist@123');
    } else {
      logger.info('ℹ️  Dentist user already exists');
    }

    // 3. Create Receptionist User
    let receptionistUser = await User.findOne({ email: 'receptionist@dentalcare.com' });
    if (!receptionistUser) {
      receptionistUser = await User.create({
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'receptionist@dentalcare.com',
        password: 'Reception@123',
        role: 'receptionist',
        phone: '+1 (555) 222-2222',
        status: 'active',
      });
      logger.info('✅ Receptionist user created: receptionist@dentalcare.com / Reception@123');
    } else {
      logger.info('ℹ️  Receptionist user already exists');
    }

    // 4. Create Accountant User
    let accountantUser = await User.findOne({ email: 'accountant@dentalcare.com' });
    if (!accountantUser) {
      accountantUser = await User.create({
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'accountant@dentalcare.com',
        password: 'Account@123',
        role: 'accountant',
        phone: '+1 (555) 333-3333',
        status: 'active',
      });
      logger.info('✅ Accountant user created: accountant@dentalcare.com / Account@123');
    } else {
      logger.info('ℹ️  Accountant user already exists');
    }

    // 5. Create Sample Services
    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      const services = [
        { name: 'Dental Cleaning', description: 'Professional teeth cleaning and polishing', duration: 30, price: 80, category: 'preventive', isActive: true },
        { name: 'Teeth Whitening', description: 'Professional teeth whitening treatment', duration: 60, price: 250, category: 'cosmetic', isActive: true },
        { name: 'Dental Checkup', description: 'Comprehensive dental examination', duration: 30, price: 60, category: 'preventive', isActive: true },
        { name: 'Root Canal Treatment', description: 'Root canal therapy for infected teeth', duration: 90, price: 600, category: 'restorative', isActive: true },
        { name: 'Dental Filling', description: 'Tooth-colored composite filling', duration: 45, price: 150, category: 'restorative', isActive: true },
        { name: 'Tooth Extraction', description: 'Simple tooth extraction', duration: 30, price: 120, category: 'surgical', isActive: true },
        { name: 'Dental Implant', description: 'Single tooth dental implant', duration: 120, price: 2500, category: 'surgical', isActive: true },
        { name: 'Orthodontic Consultation', description: 'Initial orthodontic assessment', duration: 45, price: 100, category: 'orthodontics', isActive: true },
        { name: 'Pediatric Dental Visit', description: 'Child-friendly dental checkup', duration: 30, price: 70, category: 'pediatric', isActive: true },
        { name: 'Emergency Dental Care', description: 'Urgent dental treatment', duration: 45, price: 200, category: 'emergency', isActive: true },
      ];
      await Service.insertMany(services);
      logger.info(`✅ ${services.length} sample services created`);
    } else {
      logger.info('ℹ️  Services already exist');
    }

    // 6. Create Sample Patients
    const patientsCount = await Patient.countDocuments();
    if (patientsCount === 0) {
      const patients = [
        {
          firstName: 'John', lastName: 'Smith', dateOfBirth: '1985-03-15', gender: 'male',
          phone: '+1 (555) 444-4444', email: 'john.smith@example.com',
          address: { street: '456 Oak Ave', city: 'Springfield', state: 'IL', zipCode: '62701', country: 'USA' },
          bloodGroup: 'O+', status: 'active',
        },
        {
          firstName: 'Maria', lastName: 'Garcia', dateOfBirth: '1990-07-22', gender: 'female',
          phone: '+1 (555) 555-5555', email: 'maria.garcia@example.com',
          address: { street: '789 Pine St', city: 'Springfield', state: 'IL', zipCode: '62702', country: 'USA' },
          bloodGroup: 'A+', status: 'active',
        },
        {
          firstName: 'David', lastName: 'Wilson', dateOfBirth: '1978-11-08', gender: 'male',
          phone: '+1 (555) 666-6666', email: 'david.wilson@example.com',
          address: { street: '321 Elm St', city: 'Springfield', state: 'IL', zipCode: '62703', country: 'USA' },
          bloodGroup: 'B+', allergies: 'Penicillin', status: 'active',
        },
      ];
      await Patient.insertMany(patients);
      logger.info(`✅ ${patients.length} sample patients created`);
    } else {
      logger.info('ℹ️  Patients already exist');
    }

    // 7. Initialize Default Settings
    const settingsCount = await ClinicSetting.countDocuments();
    if (settingsCount === 0) {
      const settingService = require('./services/settingService');
      await settingService.initializeDefaultSettings();
      logger.info('✅ Default clinic settings initialized');
    } else {
      logger.info('ℹ️  Settings already exist');
    }

    logger.info('\n🎉 Database seeding completed successfully!');
    logger.info('\n📋 Login Credentials:');
    logger.info('   Admin:        admin@dentalcare.com / Admin@123');
    logger.info('   Dentist:      dentist@dentalcare.com / Dentist@123');
    logger.info('   Receptionist: receptionist@dentalcare.com / Reception@123');
    logger.info('   Accountant:   accountant@dentalcare.com / Account@123\n');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();