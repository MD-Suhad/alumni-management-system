import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { User } from '../modules/users/user.model.js';
import { AlumniProfile } from '../modules/alumni/alumniProfile.model.js';
import { Department } from '../modules/departments/department.model.js';
import { Batch } from '../modules/batches/batch.model.js';
import { Program } from '../modules/programs/program.model.js';
import { Event } from '../modules/events/event.model.js';
import { News } from '../modules/news/news.model.js';
import { Job } from '../modules/jobs/job.model.js';
import { ROLES, ALUMNI_STATUS } from '../config/roles.js';

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected! Clearing previous demo data...');

    await Promise.all([
      User.deleteMany({}),
      AlumniProfile.deleteMany({}),
      Department.deleteMany({}),
      Batch.deleteMany({}),
      Program.deleteMany({}),
      Event.deleteMany({}),
      News.deleteMany({}),
      Job.deleteMany({})
    ]);

    console.log('Creating Departments...');
    const cse = await Department.create({ name: 'Computer Science and Engineering', code: 'CSE', faculty: 'Engineering' });
    const eee = await Department.create({ name: 'Electrical and Electronic Engineering', code: 'EEE', faculty: 'Engineering' });
    const me = await Department.create({ name: 'Mechanical Engineering', code: 'ME', faculty: 'Engineering' });
    const ce = await Department.create({ name: 'Civil Engineering', code: 'CE', faculty: 'Engineering' });

    console.log('Creating Batches...');
    const b10 = await Batch.create({ name: '10th Batch (2014-2018)', admissionYear: 2014, passingYear: 2018, department: cse._id });
    const b11 = await Batch.create({ name: '11th Batch (2015-2019)', admissionYear: 2015, passingYear: 2019, department: cse._id });
    const b12 = await Batch.create({ name: '12th Batch (2016-2020)', admissionYear: 2016, passingYear: 2020, department: eee._id });

    console.log('Creating Programs...');
    const bscCse = await Program.create({ name: 'B.Sc. in Computer Science & Engineering', code: 'BSC-CSE', degreeType: 'B.Sc.', department: cse._id });

    console.log('Creating Super Admin...');
    const admin = await User.create({
      firstName: 'Alumni',
      lastName: 'Administrator',
      email: 'admin@alumni.edu',
      password: 'AdminPassword123!',
      role: ROLES.SUPER_ADMIN,
      status: ALUMNI_STATUS.APPROVED,
      isEmailVerified: true
    });

    console.log('Creating Sample Alumni...');
    const alumniUser1 = await User.create({
      firstName: 'Tanvir',
      lastName: 'Hossain',
      email: 'tanvir@gmail.com',
      password: 'AlumniPassword123!',
      role: ROLES.ALUMNI,
      status: ALUMNI_STATUS.APPROVED,
      isEmailVerified: true,
      phone: '+8801700000001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    });

    await AlumniProfile.create({
      user: alumniUser1._id,
      studentId: '1404001',
      department: cse._id,
      program: bscCse._id,
      batch: b10._id,
      graduationYear: 2018,
      degree: 'B.Sc. in CSE',
      currentCompany: 'Google',
      designation: 'Senior Software Engineer',
      industry: 'Information Technology',
      location: { city: 'Singapore', country: 'Singapore' },
      bloodGroup: 'B+',
      bio: 'Alumnus of Batch 10. Passionate about distributed systems, cloud computing, and mentoring graduates.',
      skills: ['Go', 'Kubernetes', 'Cloud Architecture', 'React'],
      privacySettings: { showEmail: true, showPhone: false, showCurrentCompany: true, showBloodGroup: true }
    });

    const alumniUser2 = await User.create({
      firstName: 'Farhana',
      lastName: 'Akter',
      email: 'farhana@yahoo.com',
      password: 'AlumniPassword123!',
      role: ROLES.ALUMNI,
      status: ALUMNI_STATUS.APPROVED,
      isEmailVerified: true,
      phone: '+8801800000002',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
    });

    await AlumniProfile.create({
      user: alumniUser2._id,
      studentId: '1504022',
      department: cse._id,
      program: bscCse._id,
      batch: b11._id,
      graduationYear: 2019,
      degree: 'B.Sc. in CSE',
      currentCompany: 'Optimizely',
      designation: 'Lead Frontend Architect',
      industry: 'Software Engineering',
      location: { city: 'Dhaka', country: 'Bangladesh' },
      bloodGroup: 'O+',
      bio: 'Enthusiastic web technologist and open-source advocate.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
      privacySettings: { showEmail: true, showPhone: true, showCurrentCompany: true, showBloodGroup: true }
    });

    console.log('Creating Events...');
    await Event.create({
      title: 'Grand Annual Alumni Reunion 2026',
      slug: 'grand-annual-alumni-reunion-2026',
      description: 'Join us for the most awaited reunion of the year! Reconnect with classmates, meet esteemed professors, and celebrate our university legacy.',
      category: 'Reunion',
      bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80',
      location: {
        venue: 'University Central Auditorium & Green Lawn',
        address: 'Main Campus',
        city: 'Dhaka'
      },
      startTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // in 15 days
      endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      capacity: 500,
      registeredCount: 42,
      ticketPrice: 1000,
      organizer: admin._id
    });

    console.log('Creating News...');
    await News.create({
      title: 'Alumni Association Announces New Scholarship Fund',
      slug: 'alumni-association-announces-new-scholarship-fund',
      summary: 'A new endowment fund of 5 Million BDT has been established by alumni members to support meritorious undergraduate students.',
      content: 'The University Alumni Association is delighted to formally announce the inauguration of the Meritorious Student Scholarship Endowment. Funded collectively by overseas and domestic alumni, this initiative aims to provide full tuition and research stipends.',
      category: 'Association Announcement',
      bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
      isFeatured: true,
      author: admin._id
    });

    console.log('Creating Jobs...');
    await Job.create({
      title: 'Senior Full Stack Engineer',
      company: 'Pathao',
      location: { city: 'Dhaka', country: 'Bangladesh', isRemote: false },
      employmentType: 'Full-time',
      experienceLevel: 'Senior Level',
      salaryRange: '180,000 - 240,000 BDT',
      description: 'Looking for an experienced engineer with deep knowledge of Node.js microservices and modern React to join our Core Logistics team.',
      requirements: ['4+ years professional software development', 'Proficiency in Node.js and TypeScript', 'Strong database schema design'],
      applicationUrl: 'https://careers.pathao.com/jobs/senior-fullstack',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      postedBy: alumniUser1._id
    });

    console.log('--- SEED DATA POPULATED SUCCESSFULLY ---');
    console.log('Admin Account: admin@alumni.edu / AdminPassword123!');
    console.log('Alumni Account: tanvir@gmail.com / AlumniPassword123!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
