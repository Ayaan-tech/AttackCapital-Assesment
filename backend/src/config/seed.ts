import { is } from 'zod/v4/locales';
import prisma  from '../config/db';
import { faker } from '@faker-js/faker';

async function main(){
    console.log('Seeding started...');
    console.log('Deleting existing data...');
    await prisma.callSummary.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.user.deleteMany();

    console.log('Existing data deleted.');

    const numberOfUsers = 15
    const users = [];
    for(let i=0; i<numberOfUsers; i++){
        users.push({
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number().replace(/\D/g, ''), // Clean non-digit characters
        dateOfBirth: faker.date.past({ years: 50, refDate: '2000-01-01' }),
        allergies: faker.helpers.arrayElement(['Peanuts', 'Pollen', 'None', 'Dust Mites', 'Shellfish']),
        medications: faker.helpers.arrayElement(['Lisinopril', 'Metformin', 'None', 'Atorvastatin', 'Amoxicillin']),
        lastVisit: faker.date.past({ years: 2 }),
        })

    }
    const createdUsers = await prisma.user.createMany({
        data:users,
    });
    console.log(`Created ${createdUsers.count} users.`);

    const allUsers = await prisma.user.findMany();
    const appointments = [];
    for(const user of allUsers){
        const appointmentCount = faker.number.int({ min: 1, max: 3 });
        for(let i=0; i<appointmentCount; i++){
            const appointmentDate = faker.date.past({ years: 2 });
            appointments.push({
                date: appointmentDate,
                time: appointmentDate, // Schema has both, using the same value
                reason: faker.lorem.sentence({ min: 3, max: 7 }),
                patientId: user.patientId, // Link to the user
            }); 
        }
    }
    const createdAppointments = await prisma.appointment.createMany({
        data:appointments,
    })
    console.log(`Created ${createdAppointments.count} appointments.`);
    const allAppointments = await prisma.appointment.findMany();
    const callSummaries = [];

    for(const appointment of allAppointments){
        callSummaries.push({
            externalSessionId: faker.string.uuid(),
            appointmentId: appointment.appointmentId,
            notes: faker.lorem.paragraph(),
            transcript: `Patient: ${faker.lorem.sentence()}\nAgent: ${faker.lorem.sentence()}\nPatient: ${faker.lorem.sentence()}`,
                  dynamicVariables: {
                    supportTier: faker.helpers.arrayElement(['gold', 'silver', 'bronze']),
                    callIntent: faker.helpers.arrayElement(['booking', 'follow-up', 'inquiry']),
            },
             isSuccessful: faker.datatype.boolean(0.8),
              endedAt: faker.date.recent({ days: 1 }),

        })
    }
    const createdSummaries = await prisma.callSummary.createMany({
    data: callSummaries,
    });
    console.log(`${createdSummaries.count} call summaries created.`);
}

main().catch((e)=>{
    console.error(e);
    process.exit(1);
})
.finally(async()=>{
    await prisma.$disconnect();
    console.log('Seeding finished.');
})


