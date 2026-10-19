using KMC.API.Models;
using Microsoft.EntityFrameworkCore;

namespace KMC.API.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            await context.Database.MigrateAsync();

            if (await context.Users.AnyAsync())
            {
                return; // DB has been seeded already
            }

            var defaultPasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!");

            var organizer1 = new User
            {
                FullName = "KMC Event Director",
                Email = "organizer@kmc.gov.lk",
                PasswordHash = defaultPasswordHash,
                Role = "Organizer",
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            };

            var organizer2 = new User
            {
                FullName = "Kandy Heritage & Arts Council",
                Email = "culture@kmc.gov.lk",
                PasswordHash = defaultPasswordHash,
                Role = "Organizer",
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            };

            var participant1 = new User
            {
                FullName = "Kasun Perera",
                Email = "perera@gmail.com",
                PasswordHash = defaultPasswordHash,
                Role = "Participant",
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            };

            var participant2 = new User
            {
                FullName = "Amali Silva",
                Email = "silva@gmail.com",
                PasswordHash = defaultPasswordHash,
                Role = "Participant",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            };

            await context.Users.AddRangeAsync(organizer1, organizer2, participant1, participant2);
            await context.SaveChangesAsync();

            var events = new List<Event>
            {
                new Event
                {
                    Title = "Kandy Esala Perahera Cultural Showcase 2026",
                    Description = "Annual magnificent procession celebrating Sri Lankan heritage, featuring traditional drummers, dancers, and illuminated pageantry around the Sacred Temple of the Tooth Relic.",
                    Category = "Cultural",
                    Location = "Sacred Temple Square, Kandy",
                    StartDate = DateTime.UtcNow.AddDays(14),
                    EndDate = DateTime.UtcNow.AddDays(16),
                    MaxParticipants = 500,
                    OrganizerId = organizer1.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    UpdatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Event
                {
                    Title = "Kandy Lake Round Green & Clean Drive",
                    Description = "Community eco-initiative organized by KMC to rejuvenate the historic Kandy Lake bund, plant native flora, and promote environmental sustainability.",
                    Category = "Community",
                    Location = "Kandy Lake Round Promenade",
                    StartDate = DateTime.UtcNow.AddDays(7),
                    EndDate = DateTime.UtcNow.AddDays(7).AddHours(5),
                    MaxParticipants = 150,
                    OrganizerId = organizer1.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    UpdatedAt = DateTime.UtcNow.AddDays(-4)
                },
                new Event
                {
                    Title = "KMC Smart City Youth Tech Summit",
                    Description = "Innovators, students, and tech entrepreneurs gather to demonstrate IoT smart municipal solutions, coding challenges, and AI for public services.",
                    Category = "Technology",
                    Location = "Kandy Municipal Town Hall Auditorium",
                    StartDate = DateTime.UtcNow.AddDays(21),
                    EndDate = DateTime.UtcNow.AddDays(22),
                    MaxParticipants = 200,
                    OrganizerId = organizer2.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Event
                {
                    Title = "Hill Country Culinary & Street Food Fest",
                    Description = "Savor authentic Central Province delicacies, traditional sweetmeats, tea tasting sessions, and live acoustic music by local artists.",
                    Category = "Food & Festival",
                    Location = "Bogambara Stadium Grounds, Kandy",
                    StartDate = DateTime.UtcNow.AddDays(30),
                    EndDate = DateTime.UtcNow.AddDays(31),
                    MaxParticipants = 350,
                    OrganizerId = organizer2.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                }
            };

            await context.Events.AddRangeAsync(events);
            await context.SaveChangesAsync();

            var registrations = new List<Registration>
            {
                new Registration
                {
                    EventId = events[0].Id,
                    ParticipantId = participant1.Id,
                    RegistrationDate = DateTime.UtcNow.AddDays(-2),
                    Status = "Registered"
                },
                new Registration
                {
                    EventId = events[1].Id,
                    ParticipantId = participant1.Id,
                    RegistrationDate = DateTime.UtcNow.AddDays(-1),
                    Status = "Registered"
                },
                new Registration
                {
                    EventId = events[0].Id,
                    ParticipantId = participant2.Id,
                    RegistrationDate = DateTime.UtcNow.AddDays(-1),
                    Status = "Registered"
                }
            };

            await context.Registrations.AddRangeAsync(registrations);
            await context.SaveChangesAsync();
        }
    }
}
